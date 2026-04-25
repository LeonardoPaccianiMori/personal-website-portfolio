---
layout: post
title: "Modeling Recipes as Graphs Instead of Ingredient Lists"
date: 2025-12-05 10:00:00
description: The modeling decision that changed my Italian cuisine project from a feature-engineering exercise into a structural one
tags: graph-neural-networks neo4j deep-learning
categories: [technical-notes]
featured: false
---

When I started the [Italian cuisine project](/projects/italian-cuisine/), the obvious representation was also the safest one: treat each recipe as a list of ingredients, one-hot encode it, and train a classifier from there.

That would have been the respectable baseline. It also would have reduced the whole project to ingredient frequencies, which was exactly what I did not want.

## The Problem With Ingredient Lists

Two dishes can share almost the same ingredients and still be structurally different.

Take a carbonara-style pasta and a frittata. Both might contain eggs, cured pork, and pecorino. But the important distinctions are not just *what* is present. They are:

- what gets combined with what
- in what order
- under which cooking action
- and which intermediate products appear along the way

An ingredient list keeps only the nouns. A recipe keeps the relationships.

That mattered for my goal because I was not trying to predict calories or detect the presence of tomato. I was trying to classify regional cuisine. Regional identity often shows up in repeated ingredient-technique pairings and process patterns, not just in isolated ingredients.

## The Moment the Representation Changed

Once I wrote that down clearly, the flat feature setup stopped feeling like a simplification and started feeling like a mismatch.

So I rebuilt the dataset around recipe graphs:

- `Recipe` nodes for metadata
- `Ingredient` nodes for normalized ingredients
- `Step` nodes for instructions
- edges for `REQUIRES`, `HAS_STEP`, `USES_INGREDIENT`, and `NEXT_STEP`

That let me keep the pieces I would otherwise lose:

- sequence
- ingredient-action pairings
- intermediate products
- reuse of outputs across later steps

I stored the graphs in Neo4j because it made both querying and inspection much easier during development. More importantly, it gave me a clean path into a heterogeneous graph neural network later on.

## Why This Was Worth the Extra Complexity

Graphs are more work than flat features. They force you to define a schema, think about relations carefully, and deal with more complicated modeling code.

I still think it was the right decision here for three reasons.

### 1. The domain really is relational

Recipes are not naturally rows. They are little process networks.

If I had been working on a simpler question like "does this recipe contain tomato?", graphs would have been overkill. But for regional identity, the structural information was part of the signal.

### 2. It changed what the model could represent

The eventual macro-region model was far from perfect, but the graph representation let me preserve patterns that are hard to express in bag-of-ingredients form:

- rice plus broth plus repeated sautéing in Northern dishes
- olive oil plus tomato-based step patterns in Southern dishes
- seafood-heavy process clusters in the islands

Those are not single-feature effects. They live in combinations and order.

### 3. It made the analysis better even before modeling

This was the part I underestimated at the start. Even if I had never trained a GNN, the graph representation still would have paid off.

It gave me a better way to inspect recipes, query recurring structures, and think about what the extraction pipeline was actually producing. In practice, that improved the data work as much as the modeling work.

## What I Would Not Generalize From This

I would not take "use graphs" as a generic recipe-ML rule.

If the task is simple, the data is small, or the relationships are not central, flat features are probably the right first move. Graphs are worthwhile when the structure is doing real work, not when they merely sound more advanced.

What I kept from this project is a stronger suspicion of downstream tinkering. Once I accepted that the real decision was representational, I stopped asking the model to recover structure I had already thrown away upstream.

For the full project context, start with the [project page](/projects/italian-cuisine/). For the implementation details, prompts, and analysis outputs, see the [technical deep dive](/blog/2026/italian-cuisine-deep-dive/).
