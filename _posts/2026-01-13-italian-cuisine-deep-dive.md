---
layout: post
title: "Italian Cuisine Deep Dive: Graph Recipes and Regional Patterns"
date: 2026-01-13 10:00:00
description: Full technical details for the Italian cuisine project, including extraction prompts, graph schema, analysis, and model results.
tags: data-science graphs GNN NLP
categories: [data-science, projects]
chart:
  plotly: true
---

## Overview
This post is the technical deep dive for my [Italian Cuisine project](/projects/italian-cuisine-v2/). It includes extraction prompts, graph modeling details, and the full analysis.

---

## Data Extraction Pipeline
Both datasets were unstructured text. I used Gemini 2.5 Pro to convert each recipe into a structured JSON schema, then normalized ingredients and tools before loading into Neo4j.

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
<summary><strong>AIC extraction prompt</strong></summary>
{%raw%}
```text
You are parsing a recipe from the Italian Academy of Cuisine (Accademia Italiana della Cucina) database.

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

---

## Analysis: Temporal Evolution
I compared the two datasets to understand how Italian cuisine changed over time.

### Recipe Complexity
Distribution of steps, ingredients, and tools per recipe highlights how overall complexity shifted across eras.
```plotly
{% include plotly/italian-cuisine/recipe-complexity.json %}
```

### Category Evolution
Category mix comparison between Artusi and modern recipes shows which types gained or lost prominence.
One striking difference is the absence of "Pizzas and savory pies" from Artusi's dataset. At the end of the 19th century, the word "pizza" referred to baked pies more broadly, not the modern Neapolitan pizza we all know today.
```plotly
{% include plotly/italian-cuisine/category-evolution.json %}
```

### Ingredient Evolution
Key trends:
- Olive oil rises while butter declines (butter used to me more frequently used than salt *and* olive oil)
- Salt appears more often in contemporary recipes
- Garlic, onion, and parsley become staples
- Chili peppers are almost absent in Artusi (only one mention)

Scatter plot comparing ingredient frequency in Artusi vs contemporary recipes.
```plotly
{% include plotly/italian-cuisine/top-ingredients-scatter.json %}
```

This view highlights ingredients that are new in the modern dataset or absent compared to Artusi.
```plotly
{% include plotly/italian-cuisine/new-vs-disappeared-ingredients.json %}
```

---

## Analysis: Geographical Diversity
I analyzed the modern dataset to identify regional patterns.

### Regional Characteristics
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

### Signature Regional Ingredients (TF-IDF)
Click a region to update the bar chart with its signature ingredients.
```plotly
{% include plotly/italian-cuisine/regional-signature-ingredients-map.json %}
```

Top 10 TF-IDF ingredients for the selected region.
```plotly
{% include plotly/italian-cuisine/regional-signature-ingredients-bar.json %}
```

### Ingredient Usage (Top 10)
Select an ingredient to see where it is most commonly used.
```plotly
{% include plotly/italian-cuisine/ingredient-usage-choropleth.json %}
```

### Regional Similarity
Cosine similarity across ingredient profiles highlights which regions are closest:
- Regions within the same macro-region cluster closely
- Valle d'Aosta stands out as a strong outlier
- Liguria aligns more with Central/Southern profiles than Northern ones

```plotly
{% include plotly/italian-cuisine/regional-similarity-choropleth.json %}
```

Heatmap shows full pairwise similarities, ordered by macro-region.
```plotly
{% include plotly/italian-cuisine/regional-similarity-heatmap-macro.json %}
```

The dendrogram view reinforces the same grouping:
{% include figure.liquid loading="lazy" path="assets/img/projects/italian-cuisine/italian-cuisine-hierarchical-clustering.png" title="Hierarchical Clustering of Italian Regional Cuisines" class="img-fluid rounded z-depth-1" %}

### The Olive Oil vs Butter Line
Olive oil vs butter shows a sharp north-south divide:
<div class="caption">
    Fat preference by region: green = olive oil dominant, red = butter dominant. Hover and zoom to inspect.
</div>
```plotly
{% include plotly/italian-cuisine/olive-oil-butter-divide.json %}
```

### Tomato Gradient
Tomato usage increases as you move south, mirroring the olive oil divide:
<div class="caption">
    Tomato usage is strongest in the South, shaped by climate and Mediterranean influences.
</div>
```plotly
{% include plotly/italian-cuisine/tomato-usage.json %}
```

### Cheese and Seafood Patterns
Cheese usage peaks in dairy-heavy regions (e.g., Emilia-Romagna, Lombardy), reflecting production traditions and recipe usage.
```plotly
{% include plotly/italian-cuisine/cheese-usage.json %}
```

Seafood usage follows coastline access; landlocked and alpine regions remain low.
```plotly
{% include plotly/italian-cuisine/seafood-usage.json %}
```

### The Starch Triangle
The North leans toward rice and polenta, the South toward pasta; transitional regions show mixed profiles.
```plotly
{% include plotly/italian-cuisine/pasta-rice-polenta-triangle.json %}
```

---

## ML Classification Deep Dive
The macro-region classifier reached ~60% F1-score, while the region-level model overfit heavily.

### PCA Clustering
Key observations:
- North forms a tight cluster (homogeneous traditions)
- Islands are well separated (geographic isolation)
- South and Center overlap (shared culinary elements)
- Liguria clusters closer to Central/Southern Italy

PCA projection of recipe embeddings colored by macro-region.
```plotly
{% include plotly/italian-cuisine/pca-regional-clustering.json %}
```

---

## Takeaways
- Graph structure captures relationships and sequence that flat ingredient lists miss.
- Macro-regions are more learnable than individual regions because of data volume and culinary overlap.
- The patterns learned by the model match geography and history, not arbitrary boundaries.

---

## Look at the Code
All code for this project is available on GitHub [here](https://github.com/LeonardoPaccianiMori/portfolio-italian-cuisine).

---

## Disclaimer

The content of this page was originally written by me. I used AI tools for editing and clarity only; the ideas, analysis, and conclusions are mine.
