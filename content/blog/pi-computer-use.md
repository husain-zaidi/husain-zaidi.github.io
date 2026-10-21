---
title: "Building a Better Computer-Use Extension for Pi: 3.26× Faster with Python"
date: "2026-10-21"
description: "I built a code-first computer-use extension for Pi. Persistent Python and Playwright cut a local form benchmark from 13 tool calls to 2, with a 3.26× speedup."
keywords: "pi, computer use, agents, Python, Playwright, PyAutoGUI, benchmarks"
---

Computer-use agents spend a surprising amount of time talking about clicking things. Observe a page, choose a field, call a tool, wait for the model, type something, observe again. Repeat until either the form is complete or we have all aged considerably.

I built [pi-computer-use-exec](https://pi.dev/packages/pi-computer-use-exec) to implement the best practices for computer use with GPT-6 in Pi: **persistent Python, Playwright, and optional desktop control through PyAutoGUI**, inside Pi's existing model conversation.

On a local form-filling benchmark, it completed the task in **19.89 seconds versus 64.93 seconds** for `@injaneity/pi-computer-use@0.5.1`. That is a **3.26× speedup**, using **2 tool calls instead of 13**. Both extensions completed all three measured runs correctly.

My goal was to build the best computer-use extension for how I use Pi: let a capable model express a short sequence of actions as code, keep the browser alive, and spend its next turn checking the result. The benchmark supports that design on this task. It does not establish a universal winner across every website and desktop application.

### Code-driven interaction is becoming the default

[OpenAI's computer-use guide](https://developers.openai.com/api/docs/guides/tools-computer-use) explicitly recommends code execution for GPT-6 Astra: give the model a script-execution tool, preserve the environment between calls, and return observations including screenshots. That is the pattern I wanted this extension to bring into Pi.

I think this will become the new normal. Newer models seem to be increasingly reinforcement-learned to generate code for UI interaction: inspect the screen, write a short program, execute it, inspect the result, and correct course. That is my reading of their behaviour and the direction of the tooling, rather than a claim that I know the providers' private training recipes.

The same direction is visible with Claude. [Anthropic's programmatic tool calling](https://www.anthropic.com/research/advanced-tool-use) lets Claude orchestrate tools through code, using loops and conditionals while keeping intermediate results out of the model conversation. It is broader than UI automation, but the principle transfers: let code handle a sequence of understood operations and bring the model back when another judgment is needed.

My hypothesis is that this same code-generation and feedback loop is also a source of the advances we are seeing in these models' 3D capabilities. A model can write a Blender script to construct geometry, render the scene, inspect the image, and revise its code. Coding ability becomes a practical way to create and manipulate a 3D world. That does not establish that UI-focused RL caused the spatial gains; it explains why better code generation and visual feedback can unlock more capable 3D workflows. Anthropic's [robotics experiments](https://www.anthropic.com/research/claude-plays-robotics) similarly show how strongly results depend on the control interface, including whether a model can write controller code.

For Pi, I wanted an interface that fits that direction: persistent execution, short grounded action sequences, and visual verification.

### Give the agent a small program

The extension exposes one main tool:

```text
exec_py({ code, timeout_ms? })
```

It runs synchronous Python in a persistent worker. Variables survive between calls, along with the browser session. Pi handles the model conversation and authentication; the worker handles execution. There is no separate model client or extra API key for this extension.

The basic loop is:

1. Inspect the current page or screen.
2. Run a short sequence of actions grounded in that observation.
3. Verify the resulting interface and return useful text or a screenshot.

For example, the first call can open the dedicated browser and inspect the form:

```python
start_browser('http://127.0.0.1:8080')
log(page.locator('body').aria_snapshot())
display(page.screenshot())
```

Once the agent has observed the controls, it can fill several fields in the next call:

```python
page.get_by_label('Full name', exact=True).fill('Ada Lovelace')
page.get_by_label('Email', exact=True).fill('ada@example.test')
# Continue with the other fields observed on this page.
display(page.screenshot())
```

The agent still needs to inspect the next state when a page changes unexpectedly. Batching works well when the actions are already understood. A long script built on guesses simply fails more efficiently.

Playwright supplies browser locators, form input, screenshots and accessibility snapshots. Desktop mode adds PyAutoGUI for mouse and keyboard interaction. The dedicated Chromium browser is visible, so I can watch what the agent is doing.

### The benchmark

I compared the extension against the unmodified published `@injaneity/pi-computer-use@0.5.1` on a local registration form. It required five text values and a checkbox, followed by a Register action.

A separate loopback server validated every required value and recorded submissions. Success meant **exactly one correct submission**, and the agent also had to observe the visible completion message. A confident “done” was insufficient. A useful policy for software in general.

The recorded runs were made on **September 12, 2026**, using `github-copilot/gpt-6-astra` with medium thinking, Pi 0.85.0, Windows, and Chromium 145.0.7632.6.

| Metric | pi-computer-use | Baseline |
| --- | ---: | ---: |
| Correct, exactly-once submissions | 3/3 | 3/3 |
| Median end-to-end time | **19.89 s** | 64.93 s |
| Median time to validated submission | **16.36 s** | 29.84 s |
| Median tool calls | **2** | 13 |
| Median model turns | **3** | 14 |
| Median total time inside tools | 5.21 s | **3.69 s** |
| Median Pi-reported tokens, including cache categories | **4,358** | 43,374 |

The most interesting row is time inside the tools. **My backend took longer to execute its tool calls in aggregate.** The end-to-end improvement came primarily from needing fewer model/tool round trips and fewer observation and recovery steps.

The extension consistently used one call to launch and inspect the form, then another to fill the fields, check the box, submit and verify the result. The baseline also supported batching and batched field edits, but used more calls to discover references, inspect the checkbox and confirm completion.

This is why I think the interface matters. The model's ability to plan several steps only helps when the tool lets it execute those steps together.

### Every measured run

| Pair | Execution order | pi-computer-use: time / calls | Baseline: time / calls |
| --- | --- | ---: | ---: |
| 1 | Mine → baseline | 20.45 s / 2 | 42.03 s / 13 |
| 2 | Baseline → mine | 19.89 s / 2 | 64.93 s / 12 |
| 3 | Mine → baseline | 17.78 s / 2 | 85.32 s / 26 |

Each run used a separate Pi process, a fresh URL/profile, identical task wording and the same model, thinking level and browser executable. Extensions, skills, context files and built-in filesystem/shell tools outside the comparison were disabled. The baseline kept all eleven of its tools, including batching and browser evaluation. Neither agent received a prewritten solution or permission to bypass the UI through direct backend requests.

No measured run was removed. The third baseline run had a failed CDP launch, fell back to native UI interaction, encountered foreground-focus refusals, and eventually relaunched the browser successfully. That recovery time is included. Earlier development pilots are retained separately and excluded from this series.

There are limits to what these numbers tell us. This is **one simple task with three runs per extension**, and each extension retained its default viewport and observation policies. Model latency, caches and recovery behaviour affect the outcome. Wall time includes CLI startup and process exit, while later manual cleanup of leftover benchmark browser processes is excluded. The token counts are reported usage, including cache categories; they are not a dollar-cost comparison.


### A longer task: DMV appointments

The project's README also records a DMV appointment-task comparison:

| Metric | pi-computer-use | Baseline |
| --- | ---: | ---: |
| Time | **7 min 46 s** | 13 min 59 s |
| Tool calls | **60** | 119 |
| Tool errors | **1** | 10 |

That is approximately **1.80× faster** with about half as many tool calls. It points in the same direction as the form benchmark, but the README does not provide the same run-level evidence, repeated trials or validation details for this task. I treat it as an additional reported result, rather than combining it with the controlled form experiment.

### Persistent state needs a lifecycle

Keeping Python and a browser alive makes the interface useful, but it also introduces state to manage. Calls are serialized, ordinary Python exceptions preserve variables for correction, and timeout, cancellation or a PyAutoGUI failsafe stops the worker. A reset discards the runtime. Resuming a conversation does not restore the old browser or Python variables.

Desktop input needs particular care. On Windows, `focus_browser()` requests native foreground focus and verifies it before physical keyboard input. It refuses ambiguous targets or denied focus. Bringing a Playwright page to the front does not guarantee that the operating system will send keystrokes there.

That check happens at call time; another window can still steal focus later. The PyAutoGUI failsafe stays enabled.

This is also **unrestricted local Python running with the user's permissions**. A worker process and dedicated browser profile do not create a security sandbox. Browser and desktop modes choose the available convenience helpers; they do not prevent arbitrary imports. For untrusted tasks, use a disposable desktop or VM, and keep sensitive submissions, purchases and external messages under explicit user control.

### Try it

Install the extension into Pi:

```sh
pi install npm:pi-computer-use-exec
```

Or install from the repository:

```sh
pi install git:github.com/husain-zaidi/pi-computer-use-exec
```

The installer is set up to create a Python environment, install the dependencies and download Playwright's Chromium. Inside Pi, choose the mode:

```text
/computer-use browser
/computer-use desktop
/computer-use reset
```

Browser mode is the default. Desktop mode adds the PyAutoGUI helpers. Linux desktop control requires X11; macOS requires the relevant Accessibility and Screen Recording permissions. The recorded comparison and native focus helper were tested on Windows.

The result I care about is straightforward: on the measured form, a model using two short Python calls finished correctly with substantially less waiting. Persistent execution gives the agent room to use what it already knows about the page. The next step is to test that advantage across more varied, longer tasks.

[Install pi-computer-use-exec from the Pi package directory →](https://pi.dev/packages/pi-computer-use-exec)

[Extension source →](https://github.com/husain-zaidi/pi-computer-use-exec)
