---
layout: post
title: "Technical appendix: recipe graphs and regional cuisine modeling"
date: 2026-01-16 10:10:00
description: The technical appendix to my Italian cuisine project, including extraction prompts, graph modeling choices, and the main analytical outputs.
tags: data-science graphs GNN NLP
categories: [technical-notes]
technical_kind: appendix
last_updated: 2026-08-31
chart:
  plotly: true
---

## Overview

This is the technical appendix to my [Italian cuisine project](/projects/italian-cuisine/). The project treated recipes as both source texts and structured processes. That required three connected decisions: how to extract a consistent schema from prose, how to represent relationships and sequence, and how to evaluate geographic patterns without treating a curated corpus as a measurement of Italian cooking itself.

The appendix follows that path from extraction to graph modelling. Two focused notes separately explain [why I represented recipes as graphs](/blog/2025/why-graphs-for-recipes/) and [how I designed the principal geographic visualizations](/blog/2025/visualizing-italian-cuisine/).

## Data and public boundary

The historical corpus contains 790 recipes from Pellegrino Artusi's 1891 cookbook. The contemporary corpus contains 2,599 regional recipes covering all 20 Italian regions.

Neither source is a representative sample of what Italians cooked. Artusi concentrates on Central and Northern Italy, while the contemporary corpus is a curated collection. Contemporary source text, recipe-level derivatives, model checkpoints, and data splits are not distributed. Published results are limited to aggregate analysis and separately licensed Artusi material.

## From recipe text to structured data

Both datasets started as unstructured text. I used an LLM to convert each recipe into a structured JSON schema, then normalized ingredients and tools before loading the results into Neo4j.

The schema captured ingredients, tools, steps, intermediate products, order, timing, and other available metadata. LLM-produced JSON made the texts analyzable at scale, but valid structure did not guarantee correct extraction. Normalization could merge distinct ingredients, preserve an inconsistent name, or assign the wrong action or relationship.

I therefore treat the aggregate findings as directional evidence and look for patterns that appear across several views rather than relying on one extracted field.

## Graph representation

Neo4j stored the richer recipe graph, including ingredients, tools, steps, intermediate products, and sequence. That structure supported inspection and querying during development.

The heterogeneous Graph Attention Network used a narrower model graph containing recipe, ingredient, and step nodes. This distinction matters: the public interactive graph shows more structure than the classifier consumed. The focused [graph-representation note](/blog/2025/why-graphs-for-recipes/) explains why I chose this approach and why the project does not establish that graphs outperform a flat baseline.

## Historical and contemporary comparison

Once Artusi is treated as one geographically imbalanced historical corpus rather than a complete picture of Italy, the comparison shows how two differently assembled sources vary.

### Represented complexity

The distributions of steps, ingredients, and tools compare how recipe complexity is represented in the two corpora.

```plotly
{% include plotly/italian-cuisine/recipe-complexity.json %}
```

### Category mix

The category mix comparison shows the percentage of recipes assigned to each category in the two corpora. One visible difference is that the category "Pizzas and savory pies" is absent from the Artusi dataset.

```plotly
{% include plotly/italian-cuisine/category-evolution.json %}
```

### Ingredient frequency

Key differences between the corpora:

- A larger percentage of contemporary recipes contain olive oil, while a larger percentage of Artusi recipes contain butter
- A larger percentage of contemporary recipes contain salt
- Larger percentages of contemporary recipes contain garlic, onion, and parsley
- Chili peppers appear only once in the Artusi corpus

Scatter plot comparing ingredient frequency in Artusi vs contemporary recipes.

```plotly
{% include plotly/italian-cuisine/top-ingredients-scatter.json %}
```

This view highlights ingredients found only in one of the two datasets.

```plotly
{% include plotly/italian-cuisine/new-vs-disappeared-ingredients.json %}
```

## Selected regional patterns

I then focused on the contemporary corpus. The complete visualization discussion lives in [the focused visualization note](/blog/2025/visualizing-italian-cuisine/); this appendix retains the views most relevant to the later modelling result.

### The olive-oil and butter comparison

Olive oil appears more frequently in Central and Southern recipes in the corpus, while butter appears more frequently in Northern recipes. The blue–orange diverging map combines both percentages in one view. It describes this collection and does not establish a cultural boundary or explain its cause.

<div class="caption">
    Relative olive-oil and butter frequency in the curated regional recipes: blue = olive oil dominant, orange = butter dominant. Hover and zoom to inspect the percentages.
</div>
```plotly
{% include plotly/italian-cuisine/olive-oil-butter-divide.json %}
```

Other retained analyses examined regional similarity, corpus-distinctive ingredients, tomato, cheese, seafood, and the pasta–rice–polenta balance. Their charts remain in the repository, while the focused [visualization note](/blog/2025/visualizing-italian-cuisine/) explains the main design decisions without repeating the full gallery here.

## Graph classification

The contemporary corpus used one reproducible, stratified 70/15/15 train, validation, and test split with seed 42. The test set contained 390 recipes. This was a fixed split rather than cross-validation.

| Model             | Test accuracy | Macro-F1 | Interpretation                                        |
| ----------------- | ------------: | -------: | ----------------------------------------------------- |
| Macro-region      |        59.49% |   52.98% | Broad geographic structure was partly recoverable     |
| Individual region |        20.26% |   18.50% | Fine-grained labels overlapped and training overfit   |
| Hierarchical      |        22.31% |   17.82% | The hierarchy did not resolve fine-grained separation |

The principal result was the gap between broad and fine geography. The graph model found some macro-region signal, but it did not classify individual regions reliably.

### What the embedding projection showed

The PCA projection is descriptive rather than a separate performance measure. It helps show where the fixed-split result may have come from:

- Northern recipes form a relatively tight cluster
- Recipes from the Islands are comparatively well separated
- Southern and Central recipes overlap
- Ligurian recipes cluster closer to the Central/Southern groups in this projection

PCA projection of recipe embeddings colored by macro-region.

```plotly
{% include plotly/italian-cuisine/pca-regional-clustering.json %}
```

## Limitations and reproducibility

- Both corpora are curated and geographically imbalanced.
- LLM-assisted extraction and normalization can introduce errors.
- The GAT results use one fixed split and do not establish stability across alternative splits or seeds.
- No flat-feature baseline or relation ablation establishes that the graph representation was superior.
- Contemporary recipe text, recipe-level derivatives, model checkpoints, and splits are excluded from the public repositories.

The public source contains code and aggregate analytical outputs. The retained Artusi material follows its source terms. These boundaries allow inspection of the method and reported results but prevent complete independent reproduction of the recipe-level experiment from the public artifacts alone.

## Takeaways

- Graph structure earned its keep because it kept relationships and sequence visible instead of turning recipes into ingredient bags.
- On this fixed split, the macro-region classifier performed better than the individual-region models, while the fine-grained labels showed lower separability.
- The model result aligned with broad patterns visible in the exploratory analysis, but that agreement remains descriptive rather than independent validation.

<details markdown="1">
<summary><strong>Complete extraction prompts</strong></summary>

<details markdown="1">
<summary><strong>Artusi extraction prompt</strong></summary>
{%raw%}
```text
You are parsing recipe #{recipe['id']} from Pellegrino Artusi's 19th-century Italian cookbook "La scienza in cucina e l'arte di mangiar bene".

Recipe #{recipe['id']}: {recipe['title']}
Category: {recipe['category']}

Recipe Text:
{recipe['text']}

Parse this recipe and return ONLY a valid JSON object (no markdown, no explanation) with this exact structure:
{
    "name": "Recipe name in English (keep specific Italian terms like 'ossobuco', 'risotto' if no clear translation)",
    "ingredients": [
        {
            "name": "ingredient name in English (lowercase, singular)",
            "quantity": "numeric value, range like '1-2', or 'to taste'",
            "unit": "metric unit - MUST convert old units: bicchiere->200ml, cucchiaino->5ml, cucchiaio/cucchiaiata->15ml, libbra->340g, mestolo/ramaiuolo->100ml, tazza->250ml, oncia->28g,
            dito->2cm, dramma->3.5g",
            "notes": "preparation notes if any"
        }
    ],
    "tools": ["list of ALL cooking tools/equipment mentioned, lowercase: pot, pan, oven, knife, whisk, mold, sieve, mortar, etc."],
    "steps": [
        {
            "action": "single cooking verb (chop, boil, mix, saute, bake, fry, combine, etc.)",
            "instruction": "detailed step in English",
            "duration_minutes": numeric value if time specified (null otherwise),
            "temperature_celsius": numeric value if temp specified (null otherwise),
            "inputs": ["what goes INTO this step - raw ingredients OR intermediate products from previous steps like 'chopped_onions', 'the_mixture', 'cooked_pasta'"],
            "outputs": ["what comes OUT - intermediate products like 'roux', 'the_sauce', 'cooked_meat' OR the final dish name"],
            "ingredients_used": ["raw ingredients used in THIS step"],
            "tools_used": ["tools used in THIS step"]
        }
    ],
    "comment": "VERY brief summary (1-2 sentences max) if recipe has cultural/historical notes or comments, otherwise null",
    "referenced_recipes": [list of recipe numbers if this recipe cites others - look for 'n. 123', 'vedi n. 456', 'ricetta 789', etc.],
    "servings": number if mentioned (null otherwise - if range like 4-5, use minimum value 4),
    "prep_time_minutes": number if mentioned (null otherwise - if range like 10-15, use minimum value 10),
    "cook_time_minutes": number if mentioned (null otherwise - if range like 30-45, use minimum value 30)
}

CRITICAL JSON FORMATTING RULES:
- servings, prep_time_minutes, cook_time_minutes MUST be either a single number or null
- If you see a range (e.g., "4-5 servings"), use the MINIMUM value (4)
- All strings must be properly quoted
- All field names must be in double quotes

CRITICAL RULES:
1. Extract EVERY ingredient mentioned, even if not in a formal list
2. Convert ALL measurements to metric (grams, ml, pieces, cm)
3. Identify ALL tools (pentola=pot, cazzaruola=pan, tegame=pan, forno=oven, gratella=grill, mortaio=mortar, etc.)
4. Break instructions into clear sequential steps
5. Extract recipe references carefully (pattern: "n. NUMBER" or "vedi n. NUMBER" or "ricetta NUMBER")
6. Translate 19th-century terms: "diaccia"=cold/ice-cold, "adagino"=slowly, "schiumare"=skim, etc.
7. Keep Italian terms ONLY when no clear English equivalent exists
8. Be thorough - this is for a data science portfolio analyzing Italian cuisine

Return ONLY the JSON object, nothing else.
````
{%endraw%}
</details>

<details markdown="1">
<summary><strong>Contemporary-corpus extraction prompt</strong></summary>
{%raw%}
```text
You are parsing a recipe from a contemporary regional Italian recipe corpus.

Recipe: {recipe['name']}
Region: {recipe['region']}
Category: {recipe['category']}
{city_line}

Ingredients:
{ingredients_text}

Procedure:
{recipe['procedure']}

Parse this recipe and return ONLY a valid JSON object (no markdown, no explanation) with this exact structure:
{
    "name": "Recipe name in English (keep specific Italian terms like 'ossobuco', 'risotto' if no clear translation)",
    "ingredients": [
        {
            "name": "ingredient name in English (lowercase, singular)",
            "quantity": "numeric value, range like '1-2', or 'to taste'",
            "unit": "metric unit - MUST convert: bicchiere->200ml, cucchiaino->5ml, cucchiaio->15ml, manciata->50g, pizzico->2g",
            "notes": "preparation notes if any"
        }
    ],
    "tools": ["list of ALL cooking tools/equipment mentioned, lowercase: pot, pan, oven, knife, whisk, etc."],
    "steps": [
        {
            "action": "single cooking verb (chop, boil, mix, saute, bake, fry, combine, etc.)",
            "instruction": "detailed step in English",
            "duration_minutes": numeric value if time specified (null otherwise),
            "temperature_celsius": numeric value if temp specified (null otherwise),
            "inputs": ["what goes INTO this step - raw ingredients OR intermediate products from previous steps like 'chopped_onions', 'the_mixture', 'cooked_pasta'"],
            "outputs": ["what comes OUT - intermediate products like 'roux', 'the_sauce', 'cooked_meat' OR the final dish name"],
            "ingredients_used": ["ingredients used in THIS step"],
            "tools_used": ["tools used in THIS step"]
        }
    ],
    "comment": "VERY brief summary (1-2 sentences max) if recipe has cultural/historical notes or comments, otherwise null",
    "servings": number if mentioned (null otherwise - if range like 4-5, use minimum value 4),
    "prep_time_minutes": number if mentioned (null otherwise - if range, use minimum),
    "cook_time_minutes": number if mentioned (null otherwise - if range, use minimum)
}

CRITICAL RULES:
1. Extract servings from the FIRST ingredient (often says "Ingredienti per X persone") - do NOT include this as an ingredient
2. Convert ALL measurements to metric (grams, ml, pieces)
3. Identify ALL tools mentioned in the procedure
4. Break procedure into clear sequential steps
5. Keep Italian culinary terms when no clear English equivalent exists
6. Use MINIMUM value from ranges (e.g., "4-5" -> 4)
7. All strings must be properly quoted
8. servings, prep_time_minutes, cook_time_minutes MUST be either a single number or null

Return ONLY the JSON object, nothing else.
````

{%endraw%}

</details>

</details>

---

## Code and rights boundary

All code for this project is available on GitHub [here](https://github.com/LeonardoPaccianiMori/portfolio-italian-cuisine).

The repository intentionally excludes the contemporary recipe text, processed recipe graphs, feature matrices, and train/validation/test splits. My original aggregate analysis and visualizations are published under CC BY 4.0; that license does not apply to underlying third-party recipe materials. Retained Artusi material follows the digital source's stated “CC By-NC-SA” terms.
