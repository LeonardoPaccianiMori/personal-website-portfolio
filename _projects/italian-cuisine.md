---
layout: page
title: A look into Italian cuisine
description: Comparing historical and contemporary recipe corpora across Italy
img: assets/img/projects/italian-cuisine/italian-cuisine.jpg
importance: 2
category: portfolio
github: https://github.com/LeonardoPaccianiMori/portfolio-italian-cuisine
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

I built two complementary recipe datasets, one based on Pellegrino Artusi's cookbook and one from a contemporary regional corpus, because I wanted to treat Italian cuisine as both a historical record and a machine-learning problem. Once I started thinking seriously about what a recipe actually is, flat ingredient lists stopped feeling adequate, so I converted each recipe into a graph and used that representation to compare the historical and contemporary corpora and study geographic structure.

---

## Why I cared about this question

I cared about this project before I cared about the model. Italian cuisine was already a subject I found culturally interesting, but the project only became compelling once the representation question took over. I did not want a dressed-up ingredient-frequency exercise. I wanted a way to keep process, sequence, and regional identity in the data instead of flattening them away.

---

## Historical context

Pellegrino Artusi first published _La scienza in cucina e l'arte di mangiar bene_ in 1891. The historical corpus used in this project contains 790 recipes. Its coverage is strongest in Central and Northern Italy, so I use it as a regionally biased historical baseline rather than a representative picture of Italian cuisine at the time.

The modern corpus, collected from a public contemporary regional recipe source, covers recipes associated with all 20 Italian regions. That makes the comparison historically uneven but analytically useful: I was not comparing two neat snapshots, but a regionally biased historical source with a broader contemporary regional corpus.

---

## What I built

- **Historical baseline**: 790 recipes from Artusi's cookbook, concentrated in Central and Northern Italy.
- **Modern dataset**: 2,599 regional recipes covering all 20 Italian regions.
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

### Comparing the historical and contemporary corpora

Ingredient usage differs notably between the two curated recipe corpora:

```plotly
{% include plotly/italian-cuisine/top-ingredients-scatter.json %}
```

<div class="caption">
    Ingredient frequency comparison between the Artusi and contemporary corpora.
</div>

The broadest contrast is between Artusi's Central/Northern, butter-heavy baseline and a contemporary corpus in which olive oil, garlic, and onion are more visible. This is a comparison between two differently curated sources, not a direct measurement of how Italians' cooking changed over time.

### Geographic patterning

The clearest regional pattern in the contemporary corpus is the **oil-butter line**:

<div class="caption">
    Diverging choropleth map showing relative olive-oil and butter frequency in the curated regional recipes: green = olive oil dominant, red = butter dominant. Hover for details, zoom or pan to explore.
</div>
```plotly
{% include plotly/italian-cuisine/olive-oil-butter-divide.json %}
```

Within this dataset, olive oil is more common in Central and Southern recipes, while butter is more common in Northern recipes. The map describes a pattern in the curated corpus rather than directly measuring regional cooking practices.

### Graph classification

Macro-regions are much easier to classify than individual regions:

- **Macro-region model**: **59.49% accuracy**, **52.98% macro-F1**, and **58.79% weighted-F1**
- **Region model**: **20.26% accuracy**, **18.50% macro-F1**, and **21.45% weighted-F1**, with heavy overfitting
- **Hierarchical model**: **22.31% accuracy**, **17.82% macro-F1**, and **21.59% weighted-F1**

Per-class performance in the macro-region setup:

- **North**: 81% F1
- **Islands**: 52% F1
- **South**: 44% F1
- **Center**: 35% F1

---

## Technical approach

- **Extraction**: both datasets started as unstructured text, so I used an LLM-assisted extraction pipeline and then normalized ingredients and tools to reduce duplication.
- **Storage**: I used Neo4j because recipe data is easier to inspect and query as a graph than as a flat table or document store.
- **Modeling**: I trained a heterogeneous Graph Attention Network over recipe, ingredient, and step nodes. The richer Neo4j representation also retains tools, intermediate products, and step order for analysis and inspection, but those elements are not all used as GAT node types.

---

The part that stayed with me most is that the representation choice ended up doing most of the intellectual work. Once I stopped treating recipes as bags of ingredients, the historical analysis, the visualizations, and even the model errors became much easier to interpret.

---

## Tools used

| **Area**         | **Tools**                         |
| ---------------- | --------------------------------- |
| Graph Database   | Neo4j, Cypher                     |
| Data Extraction  | Gemini 2.5 Pro                    |
| Data Processing  | Python, Pandas                    |
| Deep Learning    | PyTorch, PyTorch Geometric        |
| GNN Architecture | GAT (Graph Attention Networks)    |
| Visualization    | Plotly, Matplotlib                |
| Infrastructure   | Neo4j Docker, CUDA (GPU training) |

---

## Limitations

- Artusi's dataset is geographically biased toward Central and Northern Italy.
- Regional classification suffers from limited data per class and real culinary overlap between neighboring regions.
- Both corpora are curated sources rather than direct measurements of what Italians cooked, and LLM-assisted extraction and normalization can introduce errors.
- The contemporary source recipe text and derived recipe-level datasets are not redistributed; the public repository contains code, aggregate analytical outputs, and the separately licensed Artusi materials.

---

## Deep dive

Full extraction prompts, analysis, and model details are in [Technical Appendix: Recipe Graphs and Regional Cuisine Modeling](/blog/2026/italian-cuisine-deep-dive/).

---

## Related blog posts

- [Modeling Recipes as Graphs Instead of Ingredient Lists](/blog/2025/why-graphs-for-recipes/): The modeling decision that changed my Italian cuisine project from a feature-engineering exercise into a structural one.
- [Visualizing Regional Structure in Italian Cuisine](/blog/2025/visualizing-italian-cuisine/): Three visualization choices that made the geographic story in my Italian cuisine dataset much easier to see.

---

## View the code

All code for this project is available on [GitHub](https://github.com/LeonardoPaccianiMori/portfolio-italian-cuisine).

**Data and licensing boundary:** the contemporary recipes came from a publicly accessible source, but public accessibility is not the same as permission to republish them. The source recipes and their processed graph datasets are therefore excluded. My original aggregate analysis and visualizations are published under CC BY 4.0; that license does not apply to underlying third-party recipe materials. The retained Artusi edition and example graph follow the source's stated “CC By-NC-SA” terms. See the [licensing map]({{ '/licensing/' | relative_url }}).

---
