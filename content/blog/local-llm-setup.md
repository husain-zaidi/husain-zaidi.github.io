---
title: "Builder's Desk: My local LLM Developer setup"
date: "2026-06-21"
description: "Qwen 3.6 35B A3B MTP + pi + tailscale has freed me from agent subscriptions. It has shocked me a lot. No more token anxiety, just pure work productivity"
keywords: "local llm, qwen, agents, pi, proton"
---

# Builder's Desk: My local LLM Developer setup

Outside of work, AI subscriptions can be a bit expensive and waiting for API rate limits is a special kind of torture. So, I setted up something better: a local coding agent that actually works fast, respects my wallet, and never judges my code quality. And I am shocked as to how well it just works.

## The Model: Qwen 3.6 35B @ 2-bit

The star of the show is **Qwen 3.6 35B A3B MTP** running through [Unsloth studio](https://github.com/unslothai/unsloth). I grab the [UD-IQ2_XXS 2-bit GGUF quant](https://huggingface.co/unsloth/Qwen3.6-35B-A3B-MTP-GGUF) from Hugging Face and run it with a 128K context window. The 2-bit quantization is what makes this possible on consumer hardware — it shaves the model down to a manageable size without sacrificing the intelligence you actually need.

Here's the command I use to spin it up:

```bash
unsloth run --model unsloth/Qwen3.6-35B-A3B-MTP-GGUF:UD-IQ2_XXS --disable-tools -c 128000
```

I run this inside [zellij](https://github.com/zellij-org/zellij) terminal sessions so I can attach and detach without losing the model. Then I plug into **pi** — the local coding harness that turns it into a fully-featured coding agent. It reads files, runs bash commands, edits code, and writes new files.

```bash
pi
```

That's it. No cloud dependency, no API keys, no rate limits. Just my machine doing the heavy lifting.

**All I did was add UnSloth as a provider in `pi`'s `models.json`**. That's it. I disable unsloth's tools so that I can focus on pi's tools and there is no ambiguity in tool calls

## Speed: 100 tok/s on an RTX 5060 Ti 16GB

And it flies. My NVIDIA RTX 5060 Ti with 16GB VRAM pushes out **~100 tokens per second** with this setup. That's blazing fast for a 35B model — it feels almost real-time. 

The pi harness picks up the running UnSloth instance and turns it into a full coding agent — file reading, bash execution, editing, writing — all local, all fast.

## Tailscale: Code from the Mall

Here's where it gets fun — I don't have to sit at my desk to use it. I've set up [Tailscale](https://tailscale.com/) so I can SSH into my machine from anywhere. 

```bash
curl -fsSL https://tailscale.com/install.sh | sh
sudo tailscale up
```

Once that's running, I can connect from any device on my tailnet and run commands against the model. Yes, this means I can prompt my local coding agent while sitting in a mall, which sounds ridiculous and is exactly the point. I did this and it was very productive. No more "token anxiety". The machine is always reachable.

## Global Guidance

I also keep general AI guidance in each repo's `AGENT.md` and a global `~/.pi/agent/AGENTS.md`. These files contain project-specific instructions and behavioral guidelines that pi reads before every interaction, so the agent knows my coding preferences, project structure, and working style.

## Skills I Use

I've got a few [skills](https://github.com/earendil-works/pi-coding-agent) installed in `~/.agents/skills/` that extend what the agent can do:

- **[job-applying](https://github.com/earendil-works/pi-coding-agent)** — Automates job applications on LinkedIn and company career pages. Uses a persistent browser profile with autofill so it never re-logs in. Fills name, email, phone, resume upload, dropdowns — pauses only for account registration or manual interaction needed.

- **[playwright-cli](https://github.com/nicepkg/playwright-cli)** — Browser automation and testing. Lets the agent interact with web pages, take snapshots, fill forms, run tests. Used for anything that needs a real browser.

- **[web-search-ddgs](https://github.com/duckduckgo/search)** — Python-based DuckDuckGo search using the `ddgs` library. Lets the agent do web searches for text, news, images, and videos without leaving the terminal.

## The Gaming Setup

When I'm not coding, I'm gaming. My setup is a love letter to Linux gaming:

- **[Steam](https://store.steampowered.com/) with Proton GE** for Windows games — runs everything beautifully through Proton-GE
- **[Lutris](https://lutris.net/)** for everything else — Epic Games, GOG, and non-Steam titles

I'm up for anyone who wants to play **Age of Empires** or **Deadlock**. Drop a message if you want to queue up. Gamepass games available too through dual-boot or cloud gaming

---

