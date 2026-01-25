---
layout: page
title: Italian Cuisine
description: Understanding the historical evolution and geographical diversity of Italian cuisine with data science
img: assets/img/projects/italian-cuisine/italian-cuisine.jpg
importance: 1
category: portfolio
chart:
  plotly: true
vis_network: true
---

<div class="row">
    <div class="col-sm mt-3 mt-md-0">
        {% include figure.liquid loading="eager" path="assets/img/projects/italian-cuisine/italian-cuisine.jpg" title="Italian regional cuisine" class="img-fluid rounded z-depth-1" %}
    </div>
</div>
<div class="caption">
    <a href="https://pxhere.com/en/photo/1000518">Image source</a>
</div>

**October - November 2025**

## Abstract
I built two complementary datasets of Italian recipes (late 19th century vs today), modeled each recipe as a graph, and analyzed how cuisine evolved across time and geography. I then trained a graph neural network to classify recipes by region and macro-region. The results reveal clear ingredient shifts over time and a strong North-South divide that the model learns to recognize.

---

## Research Questions
- How has Italian cuisine changed from the late 19th century to today?
- What geographic patterns emerge across the 20 regions?
- Can a graph neural network distinguish recipes by region or macro-region?

#### Main findings in a nutshell
- Significant ingredient shifts appear between the late 19th century and today (olive oil up, butter down).
- Contemporary cuisine shows strong geographic patterns, especially a North-South divide.
- Macro-regions are easier to classify than individual regions.

---

## Technologies Used

| **Area** | **Tools** |
|----------|-----------|
| Graph Database | Neo4j, Cypher |
| Data Extraction | Gemini 2.5 Pro |
| Data Processing | Python, Pandas |
| Deep Learning | PyTorch, PyTorch Geometric |
| GNN Architecture | GAT (Graph Attention Networks) |
| Visualization | Plotly, Matplotlib |
| Infrastructure | Neo4j Docker, CUDA (GPU training) |

---

## Historical Context
In 1891, shortly after Italian unification, Pellegrino Artusi published *"La Scienza in cucina e l'arte di mangiar bene"*, a collection of 790 recipes that helped shape a shared national identity through food[^1]. Tuscany and Emilia-Romagna feature prominently because Artusi knew those regions best. Like Tuscan historically became the basis for modern standard Italian, this coincidence brought Tuscan cuisine at the forefront of this new national culinary identity[^2].

Modern Italian cuisine emerged well beyond Artusi. The contemporary dataset includes recipes from all 20 regions and captures traditions that Artusi's collection largely missed.

---

## Data and Graph Modeling

### Data Collection
I assembled **two complementary datasets**:

1. **Historical baseline**: Artusi's 1891 cookbook
   - 790 recipes (mostly Central/Northern Italy)
2. **Modern recipes**: 2,599 traditional regional recipes
   - Covers all 20 regions

Each recipe is represented as a **graph** so the full structure (ingredients, tools, steps, and their order) is preserved:
<div
  class="neo4j-graph"
  data-neo4j-graph
  data-graph-src="{{ '/assets/data/italian-cuisine/recipe-76-example-graph.json' | relative_url }}"
>
  <div class="neo4j-graph__canvas" data-neo4j-graph-canvas></div>
  <div class="neo4j-graph__panel" data-neo4j-graph-panel>
    <div class="neo4j-graph__panel-title" data-neo4j-graph-title>Graph details</div>
    <div class="neo4j-graph__panel-body" data-neo4j-graph-body>
      Zoom in for more detail. Click a node or relationship to inspect metadata. Drag nodes to rearrange the graph.
    </div>
  </div>
</div>
<div class="caption">
  Graph representation of recipe #76 from Artusi's book (mushroom risotto). Zoom in for more detail, drag around the nodes,
  and hover or click on a node or relationship to show its metadata.
</div>

### Data Extraction (Brief)
Both datasets were text-only, so I converted recipes into structured graphs using an LLM-based extraction pipeline and then normalized ingredients/tools to avoid duplicate terms. Full prompts and extraction details are in the [deep dive](/blog/2026/italian-cuisine-deep-dive/).

### Neo4j Graph Database
Instead of treating recipes as flat lists, I modeled them as **graphs** to capture relationships and sequence:

#### Nodes
- `Recipe`: metadata like name, category, servings
- `Ingredient`: normalized across recipes
- `Tool`: normalized across recipes
- `Step`: textual instructions
- `IntermediateProduct`: processed ingredients used later
Optional nodes:
- `City` (AIC only)
- `Comment` (both datasets)

#### Relationships
- `(Recipe)-[HAS_STEP]->(Step)`
- `(Recipe)-[REQUIRES]->(Ingredient)`
- `(Recipe)-[NEEDS]->(Tool)`
- `(Step)-[USES_INGREDIENT]->(Ingredient)`
- `(Step)-[USES_TOOL]->(Tool)`
- `(Step)-[PRODUCES]->(IntermediateProduct)`
- `(IntermediateProduct)-[INPUT_TO]->(Step)`
- `(Recipe)-[HAS_COMMENT]->(Comment)`
- `(Recipe)-[INCLUDES_SUBRECIPE]->(Recipe)`
- `(Recipe)-[FROM_REGION]->(Region)`
- `(Recipe)-[CITY_STYLE]->(City)`
- `(Step)-[NEXT_STEP]->(Step)`

### Graph Neural Networks
I trained a **heterogeneous Graph Attention Network (GAT)** that learns from the entire recipe graph:
- Multi-relational message passing between node types
- Attention to weight important connections
- Hierarchical pooling for graph-level embeddings
- Final classifier for region or macro-region

#### Three approaches tested
1. **Fine-grained (20 regions)**
2. **Macro-region (4 classes)**
3. **Hierarchical (two-level)**

---

## Results

### Temporal Evolution
Ingredient usage shifted notably between the late 19th century and today:
```plotly
{% include plotly/italian-cuisine/top-ingredients-scatter.json %}
```
<div class="caption">
    Ingredient frequency comparison between Artusi (1891) and contemporary recipes. Olive oil rises, butter declines, and southern staples appear more often.
</div>

### Geographical Diversity
The most striking geographic divide is the **oil-butter line**:
<div class="caption">
    Diverging choropleth map showing fat preference by region: green = olive oil dominant, red = butter dominant. Hover for details, zoom/pan to explore.
</div>
```plotly
{% include plotly/italian-cuisine/olive-oil-butter-divide.json %}
```

This divide reflects climate and agricultural history: olive oil dominates Central/Southern Italy, while butter is more common in the North.

### ML Classification
Macro-regions are easier to classify than individual regions:
- **Macro-region model**: ~60% F1-score
- **Region model**: ~20% test F1-score due to overfitting

Per-class performance:
- **North**: 81% F1
- **Islands**: 52% F1
- **South**: 44% F1
- **Center**: 35% F1

---

## What I Learned
1. **LLMs are strong for extraction** but require tight prompts and human checks.
2. **Graph structure matters**: sequence and relationships carry information lost in flat lists.
3. **Model complexity cannot fix data scarcity** in fine-grained regional classification.
4. **Geographic culinary patterns are real** and align with history and climate.

---

## Limitations
- Artusi's dataset is geographically biased toward Central/Northern Italy.
- Regional classification suffers from limited data per class.

---

## Deep Dive
Full extraction prompts, analysis, and model details are in [Italian Cuisine: Full Technical Deep Dive](/blog/2026/italian-cuisine-deep-dive/).

---

## View the Code
All code for this project is available on [GitHub](https://github.com/LeonardoPaccianiMori/portfolio-italian-cuisine).

**Note**: This project's code was originally written by me and later reorganized in January 2026 using Codex 5.2, in order to make it tidier and better organized.

---

## Disclaimer

The content of this page was originally written by me. I used AI tools for editing and clarity only; the ideas, analysis, and conclusions are mine.

---

## Footnotes
[^1]: At the time of unification, most Italians spoke regional languages (often improperly called *dialects*) that evolved independently from Latin and were not mutually intelligible. Artusi's book helped create a shared national culture through cuisine.
[^2]: Like Germany, Italy's standard language does not come from the capital's dialect; both countries were politically fragmented for centuries before unification.

