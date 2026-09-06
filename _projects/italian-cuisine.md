---
layout: page
title: A look into Italian cuisine
description: Comparing recipe structure and regional patterns; a graph model recognized broad areas more readily than individual regions
img: assets/img/projects/italian-cuisine/italian-cuisine.jpg
importance: 2
category: portfolio
github: https://github.com/LeonardoPaccianiMori/portfolio-italian-cuisine
chart:
  plotly: true
vis_network: true
card_role: Independent implementation
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

<div class="project-lead-image row">
  <div class="col-sm mt-3 mt-md-0">
    {% include figure.liquid loading="eager" path="assets/img/projects/italian-cuisine/italian-cuisine.jpg" title="Italian regional cuisine" alt="" class="img-fluid rounded z-depth-1" %}
  </div>
</div>
<div class="caption">
  <a href="https://pxhere.com/en/photo/1000518">Image source</a>
</div>

## A recipe is a process

What can a recipe tell us about the place it comes from? I explored that question by keeping more than an ingredient list. Each recipe became a graph connecting ingredients, tools, steps, intermediate products, and their order.

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

The macro-region model reached 59.49% test accuracy, compared with 20.26% for individual regions and 22.31% for a hierarchical model. Region-level training showed heavy overfitting; the appendix retains the complete accuracy and macro-F1 comparison.

The gap was the principal modelling result. Broad geography was partly recoverable, while the model did not reliably distinguish individual regions. I did not run a flat-feature baseline, so this result does not establish that graphs were better than ingredient lists.

## What the project cannot establish

- Artusi's corpus is geographically imbalanced.
- Both corpora are curated sources, not direct measurements of what Italians cooked.
- LLM-assisted extraction and normalization can introduce errors.
- Region-level training had limited data, culinary overlap, and substantial overfitting.
- Contemporary recipe text, derived recipe-level data, model checkpoints, and splits are excluded from the public repositories.

The public source contains code and aggregate outputs; retained Artusi material follows its source terms. Read [why I used recipe graphs](/blog/2025/why-graphs-for-recipes/) for the representation decision, [the visualization note](/blog/2025/visualizing-italian-cuisine/) for the geographic views, or the [technical appendix](/blog/2026/italian-cuisine-deep-dive/) for extraction and evaluation details.
