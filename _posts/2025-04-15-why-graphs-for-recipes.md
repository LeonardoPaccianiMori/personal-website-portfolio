---
layout: post
title: "Modeling recipes as graphs instead of ingredient lists"
date: 2025-12-05 11:20:00
description: The modeling decision that changed my Italian cuisine project from a feature-engineering exercise into a structural one
tags: graph-neural-networks neo4j deep-learning
categories: [technical-notes]
technical_kind: note
last_updated: 2026-08-31
featured: false
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

An ingredient list keeps only the nouns. A recipe keeps the relationships.

That distinction mattered because I wanted to compare regional cuisines without assuming that isolated ingredient frequencies contained the whole signal. A graph gave me a way to retain process information and test a representation that was closer to the source material.

## The moment the representation changed

I therefore built the dataset around recipe graphs:

- `Recipe` nodes for metadata
- `Ingredient` nodes for normalized ingredients
- `Step` nodes for instructions
- edges for `REQUIRES`, `HAS_STEP`, `USES_INGREDIENT`, and `NEXT_STEP`

The richer stored graph could retain:

- sequence
- ingredient-action pairings
- intermediate products
- reuse of outputs across later steps

I stored the graphs in Neo4j because it made querying and inspection easier during development. The later Graph Attention Network used a narrower representation built from recipe, ingredient, and step nodes. Tools and intermediate products remained available in the stored graph for inspection, but they were not all part of the model input.

## Why this was worth the extra complexity

Graphs are more work than flat features. They require a schema, explicit relationships, and more complicated modelling code.

I still think it was the right decision here for three reasons.

### 1. The domain really is relational

Recipes can be treated as rows, but the source material is also a process network.

For a question such as “does this recipe contain tomato?”, a graph would have been unnecessary. For regional classification, preserving structure made it possible to test whether relationships and sequence contributed useful information.

### 2. It changed what the model could represent

The model could work with recipes, ingredients, and steps as connected objects rather than reducing every recipe to independent ingredient indicators. That is a representational capability, not evidence that the graph approach outperformed a flat baseline.

I did not run a bag-of-ingredients baseline or an ablation that isolated the value of each relation type. The classification results therefore show what this graph model achieved, not that graphs were the best possible representation.

### 3. It made the analysis better even before modeling

Even without the GNN, the representation made the extraction output easier to inspect. I could follow steps, see which ingredients and tools they used, and examine the intermediate products connecting one action to the next.

That inspection value was directly useful. It exposed whether the structured extraction resembled a recipe process rather than only producing a valid JSON object.

## What I would not generalize from this

I would not take “use graphs” as a generic recipe-ML rule.

If the task is simple, the data is small, or the relationships are not central, flat features are probably the right first move. Graphs are worthwhile when the structure is doing real work, not when they merely sound more advanced.

The results also remain bounded by the data. Both corpora are curated sources, and LLM-assisted extraction can introduce errors into ingredients, steps, and relationships. The graph preserves the extracted structure; it does not guarantee that every extracted structure is correct.

The lesson I keep from the project is narrower: decide which information the representation must preserve before asking a downstream model to recover patterns from it. A sophisticated model cannot use structure that was discarded upstream.

For the full project context, start with the [project page](/projects/italian-cuisine/). For the implementation details, prompts, and analysis outputs, see the [technical deep dive](/blog/2026/italian-cuisine-deep-dive/).
