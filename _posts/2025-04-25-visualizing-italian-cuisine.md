---
layout: post
title: "How I Visualized Regional Patterns in Italian Cuisine"
date: 2025-12-19 11:00:00
description: Three visualization choices that made the geographic story in my Italian cuisine dataset much easier to see
tags: data-visualization plotly maps
categories: data-science
featured: false
chart:
  plotly: true
---

The visualization work in my [Italian cuisine project](/projects/italian-cuisine/) only got interesting once I stopped asking, "What chart fits this data?" and started asking, "What view would make the pattern obvious?"

That sounds minor, but it changed the project.

At the beginning I had what looked like a comfortable analytics setup: regional counts, ingredient frequencies, a time dimension, and a geographic dimension. Standard charts covered each piece separately. What they did not do well was show the relationships between them.

Three custom views ended up carrying most of the analytical weight.

## 1. The Olive Oil vs Butter Map

The most memorable geographic pattern in the dataset was the North-South split in cooking fats. The mistake would have been to show two separate maps, one for olive oil and one for butter.

That would have been technically correct and cognitively annoying.

The better choice was a diverging choropleth where the scale itself expresses the tension:

- red for butter-dominant regions
- green for olive-oil-dominant regions
- the middle of the scale for transitional areas

```plotly
{% include plotly/italian-cuisine/olive-oil-butter-divide.json %}
```
<div class="caption">
    Diverging choropleth of regional fat preference. A single map makes the transition zone easier to see than two separate usage maps.
</div>

This was the point where the pattern stopped being a set of statistics and became a story. You could see the boundary immediately, and once it was visible, it became easier to connect it back to climate, agriculture, and regional culinary history.

## 2. The Pasta-Rice-Polenta Triangle

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

The main benefit was not novelty for its own sake. It was compression. One view now carried geography, relative proportion, and transition zones at the same time.

That is where the Alpine polenta cluster and the Po Valley rice cluster became much easier to explain. The map did not replace quantitative analysis, but it made the right questions obvious.

## 3. Similarity Needed Structure, Not Just a List

The third case was regional similarity. A plain heatmap is fine if you already know what you are looking for, but it is not a great first view when the aim is to understand how regional cuisines group together.

The useful move was to keep the heatmap, but reorder it by clustered similarity and annotate it in a way that preserves macro-region structure.

```plotly
{% include plotly/italian-cuisine/regional-similarity-heatmap.json %}
```
<div class="caption">
    Regional similarity heatmap reordered by clustering. Grouping similar regions together makes the block structure legible.
</div>

This mattered because it confirmed something the classification model was already hinting at: macro-regions are not arbitrary convenience labels. They show up as real structure in the data.

## What I Took From This

I do not think every project needs custom visuals. Most do not.

But when the structure of the data is the story, standard plots can flatten the analysis without you noticing. In this project, the right custom view did not make the charts prettier. It made the conclusions easier to reach and easier to defend.

That is the bar I now use for bespoke visualization work: if a custom chart does not make the underlying reasoning clearer, it is decoration.

For the broader context, start with the [project page](/projects/italian-cuisine/). The [technical deep dive](/blog/2026/italian-cuisine-deep-dive/) has the rest of the analysis and the supporting outputs.
