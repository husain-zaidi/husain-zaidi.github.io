---
title: "Robot memory, finding dory"
date: "2026-06-06"
---

The current robotics landscape is chasing the promised VLM Valhalla. Vision Language Models fine-tuned with hours of human-controlled robot demonstrations is the dominant paradigm for attempting robotic general intelligence. While most VLM evals are focused on measuring individual task success, there are very few and often ignored evals that test memory. This is essential for long-horizon tasks and for human-robot interactions as wouldn't it be a pain to give detailed descriptions of tasks every time. The robot should remember what it had done earlier and revisit the locations described as humans would do to any household member. 

Through my research, I discovered [finding-dory](https://findingdory-benchmark.github.io/) to be a really good eval that measures the recall of VLM's in-context and through the habitat-sim indoor simulator the task success rate is measured. Tasks like "Pick up the tape you saw yesterday" are tested. In this post, I ran the evaluations on newer VLMs like Qwen 3.6 and implemented a text-agent as described in the original paper
### Why robotic memory is important
For seamless robot-human collaboration, it should know your house and its members as well as any human would do. Like you would ask a family member to "get the milk for me" or "Where's my keys", they would immediately know where the item is and where to bring it to. In addition to items, and places of interest, the bot should know who the members of the household are and which item is related to whom. They should know the routines of the house, each member's preference and how they talk. This memory layer paired with VLM's in-context understanding will lead the bot to seamlessly complete tasks.
### What is finding dory - exactly
FindingDory evaluates whether a robot can use yesterday’s experience in a house to solve today’s language-specified memory/navigation tasks: during an initial “day-before” phase, an oracle/demo trajectory moves around, picks, places, and observes objects; then the evaluated agent receives a natural-language instruction like navigating back to an object, interaction, time, room etc. from that prior trajectory, selects one or more remembered frame indices as subgoals, and uses a low-level navigation policy (e.g. travel to xyz coordinates) to return there.  

Chunks of the images (e.g. 250 images) are sent to the model with prompt to predict the frame index for the question. Those frame indices are converted to xyz coordinates. Camera RGB is the only sensor going to the VLM effectively. The whole eval runs on pre-built indoor maps in habitat-sim (thanks Meta!) 

The benchmark scores both high-level recall quality, such as whether the selected frame indices correspond to the right remembered target, and downstream embodied success, such as distance-to-goal, semantic visibility/coverage, SPL, subgoal count, and failure modes like misidentification, wrong number of targets, response errors, or low-level navigation failure.

FindingDory effectively evaluates in-context memories of VLMs for indoor household tasks in the habitat sim. It uses PDDL specifications to convert the frames index (given by the VLM) to the location of the target.

```
Qwen prompt:
You are an expert robot video grounding agent. You will be shown a video collected by a robot yesterday while navigating around a house and picking and placing objects.
Your job is to help the robot complete today's task by returning the minimum necessary frame index or frame indices from yesterday's video.

...

Valid examples:
{"frame_indices": [128]}
{"frame_indices": [14, 87, 203]}

The robot's goal is: {goal}
```

### Results with Qwen2.5
I cloned the eval repository and tried to run for Qwen2.5 3B for 1 episode (52 tasks). It was terrible

| Task Success Rate | High Level Goal SR(end to end) |
| ----------------- | ------------------------------ |
| 7.7%              | 9.6%                           |

The model struggled to correctly predict the number of subgoals. For e.g. "Revisit all the receptacles you interacted with yesterday." should yield 2 positions but the model often predicts 3 or 1.  
### Resurrecting the text agent
The paper also tested a text-based summarization agent. In this, the model would see chunks of images and give a summary of what it observes. This would be given in a json containing objects, room, manipulations etc. 
```
You are given {chunk size} images from one short time window of a robot's past experience in a house.
Summarize the whole window in one compact JSON object.
Return JSON only. Do not use markdown. Do not repeat the schema. Do not list frame-by-frame captions.

Output format:
{
  "room_name": str,
  "picking_placing_or_navigating": str,
  "object_being_manipulated": str,
  "receptacle_being_manipulated": str,
  "other_objects_in_scene": list[str]
}
``` 
https://github.com/husain-zaidi/findingdory-habitat/blob/python310-qwen35-native/findingdory/policies/heuristic/text_mapper.py 

Once the task is given, the list of histories with it's corresponding frame indices are sent to the model for prediction

```
You are given a structured text history of a robot's past experience in a house.
Each history entry summarizes a short frame window and includes the original frame range.
Use the history to choose the frame index or indices that the robot should navigate to for the goal.
Return JSON only. Do not use markdown. Do not repeat the prompt.
...

Agent's history: {history}
The goal is {goal}
```

This model showed improvement as the summarization helped break down the task

| Task SR | High Level Goal SR |
| ------- | ------------------ |
| 9.6%    | 13.5%              |
Because of the chunking it gets harder for the model to give the accurate frame numbers. It would often give 3 indices where 1 was required.

### Qwen 3.5 + python 3.10 update

The evaluation repository was built on python 3.9 to support habitat sim. This limited the models it could be tested on as Qwen 3.5 and later needed python 3.10. Me and codex took up the task to upgrade everything to python 3.10 so that newer models can be evaluated.

Initially, I had created a proxy where LLM calls would go to a python3.10 environment where qwen3.5 lived. After running the evals, I ported the entire codebase to python3.10. This required upgrading numpy, and having some utils written for habitat sim so that it doesn't depend on pytorch 3D. Please do try: https://github.com/husain-zaidi/findingdory-habitat/tree/python310-qwen35-native 

I tested using the Qwen3.5-4B model and behold: 

| Task SR | High Level Goal SR |
| ------- | ------------------ |
| 19.2%   | 21.2%              |

A strong model but there is sill lots of room for improvement. It doesn't output incorrect number of goals and finds the correct locations.

Here is a report for the episode which shows which task it was able to complete in video.

<iframe src="/resources/finding_dory_report/findingdory_metrics_view.html" width="100%" height="600" title="FindingDory metrics report" frameBorder="0" allowFullScreen></iframe>

I will build better harnesses for memory and will try to evaluate more newer models. Memory has to be solved and finding dory looks like a good hill to climb to build emodied robotics memory.
