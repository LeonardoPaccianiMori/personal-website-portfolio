---
layout: page
title: A Look Into Italian Cuisine
description: Understanding the historical evolution and geographical diversity of Italian cuisine
img: assets/img/projects/italian-cuisine/italian-cuisine.jpg
importance: 2
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

## Summary
I built two complementary recipe datasets, one from Pellegrino Artusi's 1891 cookbook and one from a contemporary regional corpus, then converted each recipe into a graph so I could study Italian cuisine across both time and geography. The project combines extraction, data modeling, visualization, and graph machine learning in one workflow.

---

## Why This Matters
The key decision in this project was representational, not just algorithmic. Once recipes are treated as structured processes instead of flat ingredient lists, it becomes much easier to connect historical change, regional identity, and model behavior.

---

## Historical Context
In 1891, shortly after Italian unification, Pellegrino Artusi published *"La Scienza in cucina e l'arte di mangiar bene"*, a collection of 790 recipes that helped shape a shared national culinary identity[^1]. Artusi knew Tuscany and Emilia-Romagna especially well, so his book offers an influential but regionally biased baseline rather than a neutral picture of all Italian cuisine.

The modern dataset fills that gap with regional recipes from all 20 Italian regions, which makes the comparison historically uneven but analytically useful.

---

## What I Built
- **Historical baseline**: 790 recipes from Artusi's 1891 cookbook, concentrated in Central and Northern Italy.
- **Modern dataset**: 2,599 traditional recipes covering all 20 Italian regions.
- **Recipe graphs**: each recipe stores ingredients, tools, steps, intermediate products, and order instead of collapsing everything into a flat list.
- **Analysis stack**: comparative historical analysis, regional visualization, and a heterogeneous GAT for region and macro-region classification.

Each recipe is represented as a **graph** so the full structure is preserved:
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
  Graph representation of recipe #76 from Artusi's book (mushroom risotto). Zoom in for more detail, drag the nodes,
  and hover or click to inspect metadata.
</div>

---

## Results

### Historical Change
Ingredient usage shifts notably between the late 19th century and today:
```plotly
{% include plotly/italian-cuisine/top-ingredients-scatter.json %}
```
<div class="caption">
    Ingredient frequency comparison between Artusi (1891) and contemporary recipes. Olive oil rises, butter declines, and southern staples appear more often.
</div>

The biggest historical takeaway is not one ingredient by itself. It is the broader movement from a Central/Northern, butter-heavy baseline toward a more nationally representative cuisine in which olive oil, garlic, onion, and Southern staples are much more visible.

### Geographic Patterning
The clearest regional split is the **oil-butter line**:
<div class="caption">
    Diverging choropleth map showing fat preference by region: green = olive oil dominant, red = butter dominant. Hover for details, zoom or pan to explore.
</div>
```plotly
{% include plotly/italian-cuisine/olive-oil-butter-divide.json %}
```

That divide tracks climate and agricultural history: olive oil dominates Central and Southern Italy, while butter is more common in the North.

### Graph Classification
Macro-regions are much easier to classify than individual regions:
- **Macro-region model**: about **60% F1-score**
- **Region model**: about **20% test F1-score**, with heavy overfitting

Per-class performance in the macro-region setup:
- **North**: 81% F1
- **Islands**: 52% F1
- **South**: 44% F1
- **Center**: 35% F1

---

## Technical Approach
- **Extraction**: both datasets started as unstructured text, so I used an LLM-assisted extraction pipeline and then normalized ingredients and tools to reduce duplication.
- **Storage**: I used Neo4j because recipe data is easier to inspect and query as a graph than as a flat table or document store.
- **Modeling**: I trained a heterogeneous Graph Attention Network so ingredients, steps, tools, and sequence could all contribute to the final representation.

---

## What This Project Shows
- I can turn unstructured domain material into a reusable analytical dataset.
- I care about data representation, not just model choice.
- I can connect technical outputs back to historical and geographic interpretation.

---

## Tools Used

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

## Limitations
- Artusi's dataset is geographically biased toward Central and Northern Italy.
- Regional classification suffers from limited data per class and real culinary overlap between neighboring regions.

---

## Deep Dive
Full extraction prompts, analysis, and model details are in [Italian Cuisine: Full Technical Deep Dive](/blog/2026/italian-cuisine-deep-dive/).

---

## Related Blog Posts
- [Why I Represented Recipes as Graphs (Not Just Ingredient Lists)](/blog/2025/why-graphs-for-recipes/): The modeling decision that changed my Italian cuisine project from a feature-engineering exercise into a structural one.
- [How I Visualized Regional Patterns in Italian Cuisine](/blog/2025/visualizing-italian-cuisine/): Three visualization choices that made the geographic story in my Italian cuisine dataset much easier to see.

---

## View the Code
All code for this project is available on [GitHub](https://github.com/LeonardoPaccianiMori/portfolio-italian-cuisine).

---

## Footnotes
[^1]: At the time of unification, most Italians spoke regional languages (often improperly called *dialects*) that evolved independently from Latin and were not mutually intelligible. Artusi's book helped create a shared national culture through cuisine.
