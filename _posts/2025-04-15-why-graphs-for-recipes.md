---
layout: post
title: "Modeling recipes as graphs instead of ingredient lists"
date: 2025-12-05 11:20:00
description: The modeling decision that changed my Italian cuisine project from a feature-engineering exercise into a structural one
tags: graph-neural-networks neo4j deep-learning
categories: [technical-notes]
technical_kind: note
featured: false
last_updated: 2026-09-07
project_slug: italian-cuisine
reading_minutes: 3
---

When I started the [Italian cuisine project](/projects/italian-cuisine/), the obvious representation was a list of ingredients. It was simple, easy to encode, and suitable for many useful questions.

It was also incomplete for the question I wanted to explore. A list could tell me that eggs, cured pork, and pecorino were present. It could not tell me how those ingredients became a dish.

## The problem with ingredient lists

Two dishes can share almost the same ingredients and still be structurally different.

Take a carbonara-style pasta and a frittata. Both might contain eggs, cured pork, and pecorino. But the important distinctions are not just _what_ is present. They are:

- what gets combined with what
- in what order
- under which cooking action
- and which intermediate products appear along the way

That distinction mattered because I wanted to compare regional cuisines without assuming that isolated ingredient frequencies contained the whole signal. A graph gave me a way to retain process information and test a representation that was closer to the source material.

## Representing the steps and their relationships

I therefore built the dataset around recipe graphs:

- `Recipe` nodes for metadata
- `Ingredient` nodes for normalized ingredients
- `Step` nodes for instructions
- edges for `REQUIRES`, `HAS_STEP`, `USES_INGREDIENT`, and `NEXT_STEP`

The stored graph also retained tools and intermediate products, including outputs reused by later steps. This made the order and dependencies available for inspection.

I stored the graphs in Neo4j because it made querying and inspection easier during development. The later Graph Attention Network used a narrower representation built from recipe, ingredient, and step nodes. Tools and intermediate products remained available in the stored graph for inspection, but they were not all part of the model input.

## The extra work, and what it bought

A graph required an explicit schema and more complicated modelling code. In return, I could follow the extracted steps, inspect which ingredients and tools they used, and see how intermediate products connected one action to the next. That helped me check whether the extraction resembled a cooking process, beyond producing valid JSON.

The narrower model graph let the classifier use recipe, ingredient, and step relationships. I did not run a bag-of-ingredients baseline or an ablation of each relation type, so I cannot say that this representation improved classification. The demonstrated benefit was retaining and inspecting structure; its advantage over simpler model inputs remains an open question.

## Was the extra structure worth it?

For inspection, the graph gave me access to relationships that an ingredient list would have discarded. For classification, the answer remains unresolved: the experiment did not compare the graph with a simpler input. Those are separate reasons for choosing a representation, and this project only demonstrated the first advantage.

The results also remain bounded by the data. Both corpora are curated sources, and LLM-assisted extraction can introduce errors into ingredients, steps, and relationships. The graph preserves the extracted structure; it does not guarantee that every extracted structure is correct.

For the full project context, start with the [project page](/projects/italian-cuisine/). For the implementation details, prompts, and analysis outputs, see the [technical deep dive](/blog/2026/italian-cuisine-deep-dive/).
