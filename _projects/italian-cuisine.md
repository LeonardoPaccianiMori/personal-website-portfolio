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

## Summary

The central decision in this project was to represent each recipe as a graph instead of a flat ingredient list. This preserved ingredients, tools, steps, intermediate products, and order, and gave one structure for historical comparison, geographic analysis, and graph modelling.

I built a 790-recipe historical corpus from Pellegrino Artusi's 1891 cookbook and a contemporary corpus of 2,599 regional recipes across all 20 Italian regions. Artusi's coverage is concentrated in Central and Northern Italy, so it is a biased historical baseline rather than a representative national sample.

## An inspectable recipe graph

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

I used LLM-assisted extraction and normalization to turn unstructured recipe text into graphs in Neo4j. Python, pandas, PyTorch, and PyTorch Geometric supported the analysis and heterogeneous Graph Attention Network. The model used recipe, ingredient, and step nodes; the richer stored graph retains additional structure for inspection.

## Historical comparison

```plotly
{% include plotly/italian-cuisine/top-ingredients-scatter.json %}
```

<div class="caption">
  Ingredient frequency comparison between the Artusi and contemporary corpora.
</div>

Artusi's Central and Northern, butter-heavy baseline differs from the contemporary corpus, where olive oil, garlic, and onion are more visible. This compares two differently curated sources. It does not directly measure how Italian cooking changed over time.

## Geographic comparison

```plotly
{% include plotly/italian-cuisine/olive-oil-butter-divide.json %}
```

<div class="caption">
  Relative olive-oil and butter frequency in the curated regional recipes. The map describes this corpus, not regional cooking practices in general.
</div>

Within the contemporary corpus, olive oil is more common in Central and Southern recipes, while butter is more common in Northern recipes.

## Graph classification

Macro-regions were substantially easier to classify than individual regions:

- the macro-region model reached 59.49% accuracy and 52.98% macro-F1;
- the region model reached 20.26% accuracy and 18.50% macro-F1, with heavy overfitting;
- the hierarchical model reached 22.31% accuracy and 17.82% macro-F1.

This difference was the principal modelling result. The data contained useful broad geographic structure, but not enough clean separation for reliable individual-region classification.

## Limitations and distribution boundary

- Artusi's corpus is geographically imbalanced.
- Both corpora are curated sources, not direct measurements of what Italians cooked.
- LLM-assisted extraction and normalization can introduce errors.
- Region-level training had limited data, culinary overlap, and substantial overfitting.
- Contemporary recipe text, derived recipe-level data, model checkpoints, and splits are excluded from the public repositories.

The public source contains code and aggregate analytical outputs. The retained Artusi material follows its source terms. The [technical appendix](/blog/2026/italian-cuisine-deep-dive/) provides the extraction, analysis, and model details.
