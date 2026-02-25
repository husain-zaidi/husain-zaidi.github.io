---
title: "Training a dumb simple R1-like LLM"
date: "2025-01-29"
---

Deepseek R1 has shown how Reinforcement Learning with simple rewards are enough achieve SOTA on benchmarks. The simplicity inspired me to finetune a small LLM to do a very simple task: Subtract two numbers.

[Tiny Zero](https://github.com/Jiayi-Pan/TinyZero) project demonstrated finetuning Qwen2.5 to play the game countdown. They generated a simple dataset and finetuned it to play well. This gives me the model to use. Good thread [here](https://x.com/jiayi_pirate/status/1882839370505621655).

For my task, I generated a very basic dataset which has two numbers in a column and the second number - first number in the second column. I generated 8K samples

```python
def gen_sub_dataset():
    # Generate random numbers and their differences
    num_samples = 8000
    rng = np.random.default_rng(42)  # for reproducibility

    # Generate random integers between 0 and 1000
    numbers1 = rng.integers(0, 1000, num_samples)
    numbers2 = rng.integers(0, 1000, num_samples)

    # Create the input strings and differences
    input_pairs = [f"{n2} {n1}" for n1, n2 in zip(numbers1, numbers2)]
    differences = numbers2 - numbers1

    # Create dataset dictionary
    dataset_dict = {
        "input": input_pairs,
        "difference": differences
    }

    # Create and save the dataset
    dataset = Dataset.from_dict(dataset_dict)
    dataset.save_to_disk("subtraction_dataset")
```

A prompt is added for each message to give instructions to the LLM for the tough task of subtraction

```python
SYSTEM_PROMPT = """ A conversation between User and Assistant. The user gives two numbers, and the Assistant returns the second minus the first number only. The assistant first thinks about the reasoning process in the mind and then provides the user with the answer. The reasoning process and answer are enclosed within <think> </think> and <answer> </answer> tags, respectively, i.e., <think> reasoning process here </think><answer> answer here </answer>
    """

    # Format into conversation
    def make_conversation(example):
        return {
            "prompt": [
                {"role": "system", "content": SYSTEM_PROMPT},
                {"role": "user", "content": example["input"]},
            ]
        }

    dataset = dataset.map(make_conversation)
```

I love hugging-face. They are currently in the middle of creating an open source version called [Open-R1](https://github.com/huggingface/open-r1). They use the Transformers Reinforcement Learning library with GRPO loss function. I copied their reward functions for enforcing the format (restricting CoT between <think></think>) and added my verifier function for successful subtraction. Here is the training code:

```python
from transformers import AutoModelForCausalLM
from trl import GRPOConfig, GRPOTrainer
import numpy as np
from datasets import load_from_disk, Dataset
import re
import torch

from peft import LoraConfig

model_id = "Qwen/Qwen2.5-0.5B-Instruct"

import os
os.environ["PYTORCH_ENABLE_MPS_FALLBACK"] = "1"

model = AutoModelForCausalLM.from_pretrained(
    model_id, 
    device_map="mps", 
    trust_remote_code=True, 
    torch_dtype="auto",  
    low_cpu_mem_usage=True,
    _attn_implementation='eager')

def format_reward(completions, **kwargs):
    """Reward function that checks if the completion has a specific format."""
    pattern = r"^<think>.*?</think><answer>.*?</answer>$"
    completion_contents = [completion[0]["content"] for completion in completions]
    matches = [re.match(pattern, content) for content in completion_contents]
    return [1.0 if match else 0.0 for match in matches]

def accuracy_reward(completions, difference, **kwargs):
    """Reward function that checks if the completion is the same as the ground truth."""
    contents = [completion[0]["content"] for completion in completions]
    answer_pattern = r"<answer>(.*?)</answer>"
    rewards = []
    for content, diff in zip(contents, difference):
        try:
            content = re.search(answer_pattern, content).group(1).strip()
            answer = int(content)
            reward = 1.0 if answer == diff else 0.0
        except Exception:  # if it fails for any reason, return 0.0
            reward = 0.0
        rewards.append(reward)
    return rewards

def finetune():

    training_args = GRPOConfig(
        output_dir="Qwen2-0.5B-GRPO",
        learning_rate=1e-5,
        logging_steps=1,
        gradient_accumulation_steps=8,
        max_completion_length=128,
        per_device_train_batch_size = 1,
        save_steps=10,
        eval_steps=100
    )
    split_dataset = dataset.train_test_split(test_size=0.2, seed=42)
    train_dataset = split_dataset['train']
    test_dataset = split_dataset['test']
     # Initialize the GRPO trainer
    trainer = GRPOTrainer(
        model=model_id,
        reward_funcs=[format_reward, accuracy_reward],
        args=training_args,
        train_dataset=train_dataset,
        eval_dataset=test_dataset,
        peft_config=LoraConfig(task_type="CAUSAL_LM")
    )

    # Train and push the model to the Hub
    trainer.train()

    # Save and push to hub
    trainer.save_model('./output/tunedmodel')
```

I trained on my 16 GB M2 Macbook. I was very suprised that this was not sufficient RAM for finetuning via PEFT this puny 0.5B model keeping batch size as 1! My training run crashed after 50 steps

Wandb: [Wandb link](https://wandb.ai/husainhz7/huggingface/runs/dcv9rxlw?nw=3kwp0n99tym) 

Now can the model subtract?!
Question: 5 105

Qwen2.5-0.5B-Instruct output:
>Think: To find the difference between two numbers, we need to subtract one from the other. So, the difference between 5 and 105 is -100. Reasoning process: We understand that subtraction involves taking away something from another amount, which in this case is a positive number (5). Since both numbers are negative, we can simply subtract them as if they were positive values. Answer: -100

My finetuned model output:
>Think: To find the difference between two numbers, subtract the smaller number from the larger one. Therefore, 105 - 5 = 100. Answer: 100

Ehh.
Shall I train it for longer? What GPU should I try?

Full script: [Github Gist](https://gist.github.com/husain-zaidi/5afa49d839263e5258c8cefc816fbb9f)
