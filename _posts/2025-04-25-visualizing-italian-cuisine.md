---
layout: post
title: "Visualizing regional structure in Italian cuisine"
date: 2025-12-19 16:15:00
description: Three visualization choices that made the geographic story in my Italian cuisine dataset much easier to see
tags: data-visualization plotly maps
categories: [technical-notes]
technical_kind: note
last_updated: 2026-08-31
featured: false
chart:
  plotly: true
---

I like making plots, but I do not trust custom visuals just because they look clever. The visualization work in my [Italian cuisine project](/projects/italian-cuisine/) only got interesting once I stopped asking, "What chart fits this data?" and started asking, "What view would make the pattern obvious?"

That sounds minor, but it changed the whole standard I was using.

At the beginning I had what looked like a comfortable analytics setup: regional counts, ingredient frequencies, a time dimension, and a geographic dimension. Standard charts covered each piece separately. What they did not do well was show the relationships between them.

Three custom views ended up carrying most of the analytical weight.

## 1. The olive oil vs butter map

One of the clearest geographic patterns in the contemporary corpus was the contrast between olive-oil and butter frequency. The mistake would have been to show two separate maps, one for each ingredient.

That would have been technically correct and cognitively annoying.

The better choice was a diverging choropleth where the scale itself expresses the tension:

- orange for butter-dominant regions
- blue for olive-oil-dominant regions
- the middle of the scale for transitional areas

```plotly
{% include plotly/italian-cuisine/olive-oil-butter-divide.json %}
```

<div class="caption">
    Diverging choropleth of regional fat preference. A single map makes the transition zone easier to see than two separate usage maps.
</div>

The combined scale made the broad transition easier to see while the hover values retained the underlying percentages. The map describes relative frequency in this curated corpus. It does not establish a cultural boundary or explain why the pattern exists.

## 2. The pasta-rice-polenta triangle

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

The main benefit was not novelty for its own sake. It was compression. One view now carried geography, relative proportion, and mixed regional profiles at the same time.

The Alpine polenta concentration and the Po Valley rice concentration became easier to inspect. The map did not replace the underlying percentages, and its colour mixtures are not equally easy for every reader to distinguish. Hover values and the accompanying prose therefore remain necessary parts of the explanation.

## 3. Similarity needed structure, not just a list

The third case was regional similarity. A plain heatmap is fine if you already know what you are looking for, but it is not a great first view when the aim is to understand how regional cuisines group together.

The useful move was to keep the heatmap, but reorder it by clustered similarity and annotate it in a way that preserves macro-region structure.

```plotly
{% include plotly/italian-cuisine/regional-similarity-heatmap.json %}
```

<div class="caption">
    Regional similarity heatmap reordered by clustering. Grouping similar regions together makes the block structure legible.
</div>

This supported something the classification model also suggested: the curated corpus contained more visible structure at the macro-region level than at the individual-region level. It did not establish that the corpus was a representative measurement of regional cooking.

## What I took from this

I do not think every project needs custom visuals. Most do not.

In fact, I actively dislike bespoke charts that exist mostly to advertise effort. But when the structure of the data _is_ the story, standard plots can separate relationships that need to be considered together. In this project, the custom views did more than make the charts distinctive. They made corpus-level comparisons easier to inspect.

That is the bar I use for bespoke visualization work: the encoding must make the reasoning clearer, and the same conclusion must remain available through labels, values, or prose rather than colour alone.

For the broader context, start with the [project page](/projects/italian-cuisine/). The [technical deep dive](/blog/2026/italian-cuisine-deep-dive/) has the rest of the analysis and the supporting outputs.
