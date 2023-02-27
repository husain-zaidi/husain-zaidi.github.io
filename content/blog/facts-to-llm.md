---
title: "LLMs with Facts and Truth"
date: "2023-02-27"
---

LLMs like ChatGPT are built to generate words using their billions of weights trained over a significant portion of the crawled internet.  ChatGPT has to perform ~175 billion calculations each time it generates a word.

Training over the task to predict the next word has led it to be very useful in generating fluent text. It is already being seen as an excellent way to generate the first draft of an essay/email and to generate marketing text. With the public release of ChatGPT, it was quickly becoming a tool to learn new concepts. Students were using it to query their doubts and solve their homework questions. Information-addicts like myself are using it to learn more about concepts like how the public-relations industry works, or about some obscure money-shuffling technique used in the financial world. After all of this, we gave it the super power of searching the internet, giving us Bing chat.

It was clear that LLMs have developed some sense of the world. It has some capability to have abstractions among its billions of parameters that it displays when it answers questions that have no-right-answers. It also seems like it can analyse and synthesize answers based on facts presented to it. Plus, it can write simple code pretty well.

While it blew our minds in the beginning, it wasn't correct most of the time.

[François Chollet on Twitter: "LLMs don't answer questions by retrieving information from their training data. Rather, they *invent* their responses by drawing *inspiration* from their training data. That's a good fit for some tasks and a bad fit for others." / Twitter](https://twitter.com/fchollet/status/1626746368424398849) 



LLMs do not have any concept of truth or consistency (unless temperature is 0, but answers vary with slight word changes in prompts too) embodied into its architecture.

Following the mind-blowing release of Bing chat, I had been curious as to how it was constructed and what methods are present in general to enhance LLMs capabilities using search. The following are some ways to 'augment' these models with retrieval to help aid their answers.

## WebGPT
This finetuned version of GPT was trained to browse through a text-only version of Bing, where it could execute searching and scrolling actions. It can also "quote" text from the search results. It does these actions after being trained over human demonstrations. It keeps the context of what question it has been asked and what it had quoted, as every action is a new prompt to the model. After it has either issued the <|end browsing|> token or it had run out of actions to take, it then summarizes its collections of quotes to produce an answer. I highly suspect this is how Bing chat works, given the behaviour it displays when querying it

https://openai.com/blog/webgpt/

## WolframAlpha + LLMs
Stephen Wolfram has been invested in the idea of building a symbolic computational language. Wolfram Alpha has a large structured data warehouse built from curated and trusted data sources. This would include mathematics to facts like capitals of countries. It has a parser that converts natural language to wolfram language, using symbols and concepts to retrieve data, and using LLMs to write an essay-like answer based on that.

https://writings.stephenwolfram.com/2023/01/wolframalpha-as-the-way-to-bring-computational-knowledge-superpowers-to-chatgpt/

## Demonstrate-Search-Predict
DSP is a framework for using neural Retrieval models joined with Large Langauge Models. A pipeline is created to best leverage the strengths of both to build the ultimate question-answering bot. The pipeline is divided into 3 parts of prompts submitted to the LM and RM:

1. Some search and answer pairs are given in the prompt so that the LM is primed on how to answer questions.

2. We then prompt the LM few times with "Write a search query that will help answer a complex question", preserving the context, using it to construct further queries. These queries are given to the RM for retrieval.

3. Once the search phase is done, the model uses all of the saved context to construct the final answer in desired format

[stanfordnlp/dsp: 𝗗𝗦𝗣: Demonstrate-Search-Predict. A framework for composing retrieval and language models for knowledge-intensive NLP. (github.com)](https://github.com/stanfordnlp/dsp)

There is also an interesting approach to build a Bayesian-based world model which the LLM could refer to: [How to make LLMs say true things | Evan Conrad (evanjconrad.com)](https://evanjconrad.com/posts/world-models)

While some might argue that techniques like DSP are moving towards the realm of narrow AI, these techniques most likely will be powering consumer product solutions. DSP may have an advantage over WebGPT and LLMs with WolframAlpha, since it can leverage existing LMs and RMs without requiring additional fine-tuning or web browsing. However, this may also limit its ability to handle novel or complex queries that require more diverse sources of information.

Pursuers of true AGI would find WebGPT a more authentic way to build AI as we rely entirely on a single model to imitate human behaviour with actions. Work will be needed to improve learning about multi-query sessions, increasing the context lengths so that the model understands the activity of research deeply. A super-human researcher would "solve" the problem of search.

I think having a source of ground truth is useful, but maintaining such a data store with the appropriate quality will be a monumental task. Wolframs symbolic language would be just another query language which could run into its constraints. For now, neural retrieving models seem more general. Whatever the optimal system might be, it has to be general enough to handle novel situations.