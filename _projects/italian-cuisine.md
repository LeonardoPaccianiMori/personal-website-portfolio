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
project_overview:
  status: Completed
  period: October–November 2025
  role: Independent end-to-end implementation
  outcome: Used graph representations for historical, geographic, and GAT analysis; macro-regions were substantially easier to classify than individual regions.
  evidence: Interactive graph, aggregate results, code, and technical appendix; restricted recipe-level data are excluded.
project_actions:
  - label: View code
    url: https://github.com/LeonardoPaccianiMori/portfolio-italian-cuisine
    style: primary
    external: true
  - label: Read technical appendix
    url: /blog/2026/italian-cuisine-deep-dive/
    style: secondary
    external: false
---

<div class="row">
  <div class="col-sm mt-3 mt-md-0">
    {% include figure.liquid loading="eager" path="assets/img/projects/italian-cuisine/italian-cuisine.jpg" title="Italian regional cuisine" class="img-fluid rounded z-depth-1" %}
  </div>
</div>
<div class="caption">
  <a href="https://pxhere.com/en/photo/1000518">Image source</a>
</div>

## A recipe is a process

A flat ingredient list tells us what goes into a dish, but not how the dish comes together. For this project, I represented each recipe as a graph so that ingredients, tools, steps, intermediate products, and their order could remain connected.

The same representation then supported three different questions: how two recipe corpora differed, how ingredients varied across regions, and whether a graph model could recognize geographic patterns.

I built a historical corpus of 790 recipes from Pellegrino Artusi's 1891 cookbook and a contemporary corpus of 2,599 regional recipes covering all 20 Italian regions. The historical source concentrates on Central and Northern Italy, so it provides an interesting comparison rather than a balanced picture of the whole country.

## Looking inside a recipe graph

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
  Graph representation of recipe #76 from Artusi's book (mushroom risotto). Zoom, drag nodes, and hover or click to inspect metadata.
</div>

I used LLM-assisted extraction and normalization to turn unstructured recipe text into graphs. Neo4j made those structures inspectable, while Python and PyTorch supported the analysis and modelling.

The interactive example shows more detail than the model eventually used. The stored graph includes tools and intermediate products, while the Graph Attention Network learned from recipe, ingredient, and step nodes.

## Comparing two different corpora

```plotly
{% include plotly/italian-cuisine/top-ingredients-scatter.json %}
```

<div class="caption">
  Ingredient frequency comparison between the Artusi and contemporary corpora.
</div>

The historical corpus has a Central and Northern, butter-heavy profile. Olive oil, garlic, and onion appear more often in the contemporary corpus.

The difference is suggestive, but the two sources were assembled in different ways. This is a comparison between corpora, not a direct measurement of how Italian cooking changed over time.

## A broad oil-and-butter pattern

```plotly
{% include plotly/italian-cuisine/olive-oil-butter-divide.json %}
```

<div class="caption">
  Relative olive-oil and butter frequency in the curated regional recipes. The map describes this corpus, not regional cooking practices in general.
</div>

Within the contemporary corpus, olive oil appears more often in recipes from Central and Southern Italy, while butter appears more often in Northern recipes. The pattern describes this curated collection rather than every regional cooking practice.

## Broad geography was easier to recognize

The model found broad geographic structure much more easily than individual regional identities:

- the macro-region model reached 59.49% accuracy and 52.98% macro-F1;
- the region model reached 20.26% accuracy and 18.50% macro-F1, with heavy overfitting;
- the hierarchical model reached 22.31% accuracy and 17.82% macro-F1.

This gap was the principal modelling result. The graphs contained useful broad geographic signals, but individual regions overlapped too much for reliable classification.

## What the project cannot establish

- Artusi's corpus is geographically imbalanced.
- Both corpora are curated sources, not direct measurements of what Italians cooked.
- LLM-assisted extraction and normalization can introduce errors.
- Region-level training had limited data, culinary overlap, and substantial overfitting.
- Contemporary recipe text, derived recipe-level data, model checkpoints, and splits are excluded from the public repositories.

The public source contains code and aggregate analytical outputs. The retained Artusi material follows its source terms. The [technical appendix](/blog/2026/italian-cuisine-deep-dive/) provides the extraction, analysis, and model details.
