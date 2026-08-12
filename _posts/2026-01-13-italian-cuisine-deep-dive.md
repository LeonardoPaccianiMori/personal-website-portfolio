---
layout: post
title: "Technical appendix: recipe graphs and regional cuisine modeling"
date: 2026-01-16 10:10:00
description: The technical appendix to my Italian cuisine project, including extraction prompts, graph modeling choices, and the main analytical outputs.
tags: data-science graphs GNN NLP
categories: [technical-notes]
chart:
  plotly: true
---

## Overview
This post is the technical appendix to my [Italian cuisine project](/projects/italian-cuisine/). I cared about the question before I cared about the model: I wanted a way to treat recipe texts as both historical source material and structured data, and once I took that seriously, the representation problem became the real center of the work. The project page focuses on the portfolio story; this page keeps the extraction prompts, graph-modeling choices, and analytical outputs together in one reference.

---

## Data extraction pipeline
Both datasets started as unstructured text. I used Gemini 2.5 Pro to convert each recipe into a structured JSON schema, then normalized ingredients and tools before loading the results into Neo4j.

The historical source is Pellegrino Artusi's cookbook. The contemporary corpus
was derived from publicly viewable regional recipe pages. Because public
accessibility did not establish redistribution permission, the source text and
recipe-level derivatives are excluded from the public repository. The prompt
templates document the extraction method, while published results are limited
to corpus-level summaries and the separately licensed Artusi materials.

### Prompts used for extraction

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
```
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
```
{%endraw%}
</details>

### Limitations
These results should be read as patterns in curated recipe datasets, not as direct measurements of what Italians ate. Artusi is useful as a historical corpus, but it is not a complete picture of nineteenth-century Italian cuisine. The contemporary corpus is also curated, and the extraction pipeline depends on LLM-produced structured JSON, so ingredient frequencies and step-level structure may include normalization errors. I treated the results as directional evidence and looked for patterns that appeared consistently across visualizations, similarity analysis, and model behavior.

---

## Analysis: historical and contemporary corpus comparison
I used the two datasets to ask a simple question: once Artusi is treated as a historical corpus rather than as a complete picture of Italy, what differences appear between the two curated sources?

### Recipe complexity
The distributions of steps, ingredients, and tools compare how recipe complexity is represented in the two corpora.
```plotly
{% include plotly/italian-cuisine/recipe-complexity.json %}
```

### Category comparison
The category mix comparison shows the percentage of recipes assigned to each category in the two corpora. One visible difference is that the category "Pizzas and savory pies" is absent from the Artusi dataset.
```plotly
{% include plotly/italian-cuisine/category-evolution.json %}
```

### Ingredient frequency comparison
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

---

## Analysis: regional patterns in the contemporary corpus
I then focused on the modern dataset to compare regional patterns across the visual analysis and model outputs.

### Regional characteristics
Use the dropdown to switch between five metrics:
- **Recipe abundance**: number of recipes in the dataset per region
- **Recipe complexity**: average number of steps per recipe per region
- **Recipe variety**: average number of ingredients per recipe per region
- **Ingredient variety**: total unique ingredients used in each region
- **Recipe size**: average number of servings per recipe per region

Choropleth view of each metric by region.
```plotly
{% include plotly/italian-cuisine/regional-characteristics-choropleth.json %}
```

### Corpus-distinctive ingredients (TF-IDF)
Click a region to update the bar chart with its corpus-distinctive ingredients.
```plotly
{% include plotly/italian-cuisine/regional-signature-ingredients-map.json %}
```

Top 10 TF-IDF ingredients for the selected region.
```plotly
{% include plotly/italian-cuisine/regional-signature-ingredients-bar.json %}
```

### Ingredient usage (top 10)
Select an ingredient to see where it is most commonly used.
```plotly
{% include plotly/italian-cuisine/ingredient-usage-choropleth.json %}
```

### Regional similarity
Cosine similarity across ingredient profiles highlights which regions are closest:
- In this corpus, regions within the same macro-region often cluster closely
- Valle d'Aosta stands out as a strong outlier in the ingredient profiles
- Liguria aligns more with Central/Southern profiles than with Northern ones in this analysis

```plotly
{% include plotly/italian-cuisine/regional-similarity-choropleth.json %}
```

Heatmap shows full pairwise similarities, ordered by macro-region.
```plotly
{% include plotly/italian-cuisine/regional-similarity-heatmap-macro.json %}
```

The dendrogram view reinforces the same grouping:
{% include figure.liquid loading="lazy" path="assets/img/projects/italian-cuisine/italian-cuisine-hierarchical-clustering.png" title="Hierarchical clustering of regional recipe ingredient profiles" class="img-fluid rounded z-depth-1" %}

### The olive oil vs butter line
The relative frequency of olive oil and butter shows a sharp north-south pattern in the contemporary corpus:
<div class="caption">
    Relative olive-oil and butter frequency in the curated regional recipes: green = olive oil dominant, red = butter dominant. Hover and zoom to inspect.
</div>
```plotly
{% include plotly/italian-cuisine/olive-oil-butter-divide.json %}
```

### Tomato gradient
Tomato appears more frequently in Southern recipes in this corpus, following a pattern similar to the olive-oil distribution:
<div class="caption">
    Tomato frequency is highest in the Southern portion of the curated regional corpus.
</div>
```plotly
{% include plotly/italian-cuisine/tomato-usage.json %}
```

### Cheese and seafood patterns
Cheese appears most frequently in regions including Emilia-Romagna and Lombardy in this corpus.
```plotly
{% include plotly/italian-cuisine/cheese-usage.json %}
```

Seafood appears more frequently in recipes associated with coastal regions, while landlocked and alpine regions are lower in this corpus.
```plotly
{% include plotly/italian-cuisine/seafood-usage.json %}
```

### The starch triangle
Northern recipes in the corpus contain relatively more rice and polenta, while Southern recipes contain relatively more pasta; other regions show mixed profiles.
```plotly
{% include plotly/italian-cuisine/pasta-rice-polenta-triangle.json %}
```

---

## ML classification deep dive
On the fixed held-out split, the macro-region classifier reached 59.49% accuracy, 52.98% macro-F1, and 58.79% weighted-F1. The region-level model reached 20.26% accuracy and 18.50% macro-F1, while a hierarchical variant reached 22.31% accuracy and 17.82% macro-F1. In this experiment, the fine-grained region labels had lower separability than the broader macro-regions. The GAT uses recipe, ingredient, and step nodes; the richer Neo4j graph also retains tools, intermediate products, and sequence for inspection.

### PCA clustering
Key observations from the recipe embeddings:
- Northern recipes form a relatively tight cluster
- Recipes from the Islands are comparatively well separated
- Southern and Central recipes overlap
- Ligurian recipes cluster closer to the Central/Southern groups in this projection

PCA projection of recipe embeddings colored by macro-region.
```plotly
{% include plotly/italian-cuisine/pca-regional-clustering.json %}
```

---

## Takeaways
- Graph structure earned its keep because it kept relationships and sequence visible instead of turning recipes into ingredient bags.
- On this fixed split, the macro-region classifier performed better than the individual-region models, while the fine-grained labels showed lower separability.
- The most satisfying result for me was that the patterns learned by the model aligned with signals visible in the project's other exploratory analyses instead of feeling like arbitrary clusters.

---

## Look at the code
All code for this project is available on GitHub [here](https://github.com/LeonardoPaccianiMori/portfolio-italian-cuisine).

The repository intentionally excludes the contemporary recipe text, processed recipe graphs, feature matrices, and train/validation/test splits. My original aggregate analysis and visualizations are published under CC BY 4.0; that license does not apply to underlying third-party recipe materials. Retained Artusi material follows the digital source's stated “CC By-NC-SA” terms.
