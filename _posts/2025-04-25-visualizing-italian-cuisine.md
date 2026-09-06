---
layout: post
title: "Visualizing regional structure in Italian cuisine"
date: 2025-12-19 16:15:00
description: Three visualization choices that made the geographic story in my Italian cuisine dataset much easier to see
tags: data-visualization plotly maps
categories: [technical-notes]
technical_kind: note
featured: false
chart:
  plotly: true
last_updated: 2026-09-07
project_slug: italian-cuisine
reading_minutes: 3
---

Three views did different jobs in the [Italian cuisine project](/projects/italian-cuisine/): comparing two ingredients, reading a three-way proportion, and finding groups of similar regions. I chose the encodings around those reading tasks.

Each view describes the curated recipe corpus. None measures regional cooking practices in general.

## Compare olive oil and butter in one view

The contrast between olive-oil and butter frequency was clearer on one map than on two maps that a reader would have to compare mentally. I used a diverging scale:

- orange for butter-dominant regions
- blue for olive-oil-dominant regions
- the middle of the scale for transitional areas

```plotly
{% include plotly/italian-cuisine/olive-oil-butter-divide.json %}
```

<div class="caption">
    Diverging choropleth of relative ingredient frequency in the corpus. A single map makes the transition zone easier to see than two separate usage maps.
</div>

The combined scale made the broad transition easier to see while the hover values retained the underlying percentages. That transition describes the collection; the map cannot explain its cause.

## Read three starch proportions together

The second useful shift came from treating three-way starch preference as a color problem instead of a table problem.

I wanted to compare pasta, rice, and polenta across regions without forcing the reader to mentally combine multiple maps or stacked bars. So I mapped them directly into RGB space:

- red = pasta
- green = rice
- blue = polenta

```plotly
{% include plotly/italian-cuisine/pasta-rice-polenta-triangle.json %}
```

<div class="caption">
    RGB ternary map: red for pasta, green for rice, blue for polenta. Mixed colors show transitional regional profiles.
</div>

One view carried geography and all three proportions, including mixtures. That saved the reader from combining separate maps, but it also made the colours harder to interpret.

The Alpine polenta concentration and the Po Valley rice concentration became easier to inspect. The map did not replace the underlying percentages, and its colour mixtures are not equally easy for every reader to distinguish. Hover values and the accompanying prose therefore remain necessary parts of the explanation.

## Find groups of similar regions

The third case was regional similarity. A plain heatmap is fine if you already know what you are looking for, but it is not a great first view when the aim is to understand how regional cuisines group together.

The useful move was to keep the heatmap, but reorder it by clustered similarity and annotate it in a way that preserves macro-region structure.

```plotly
{% include plotly/italian-cuisine/regional-similarity-heatmap.json %}
```

<div class="caption">
    Regional similarity heatmap reordered by clustering. Grouping similar regions together makes the block structure legible.
</div>

The reordered view made the broad geographic groups easier to inspect. That pattern also appeared in the classification results, where the model distinguished macro-regions more readily than individual regions. Both views describe the same curated source, so their agreement does not establish that it represents regional cooking in general.

## Keep the values available

Each design exchanges one reading task for another. The oil-and-butter map makes a comparison direct; the starch map puts three proportions in one place but requires more explanation; the reordered heatmap brings similar regions together. Labels and hover values keep the underlying quantities available when the visual pattern is not enough.

For the broader context, start with the [project page](/projects/italian-cuisine/). The [technical deep dive](/blog/2026/italian-cuisine-deep-dive/) has the rest of the analysis and the supporting outputs.
