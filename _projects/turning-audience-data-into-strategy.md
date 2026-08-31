---
layout: page
title: Interpreting consumer segments at scale
description: An internal LLM workflow for making large segment-profile outputs easier to explore, summarize, and use in strategy work
img: assets/img/projects/professional/interpreting-consumer-segments.png
importance: 1
category: professional
project_overview:
  status: Active · Deployed
  period: June 2025–present
  role: Primary developer and technical owner
  outcome: Turns a multi-day segment-exploration process into a minutes-scale interactive workflow.
  evidence: Internal system; code and data are private.
---

<div class="row">
  <div class="col-sm mt-3 mt-md-0">
    {% include figure.liquid loading="eager" path="assets/img/projects/professional/interpreting-consumer-segments.png" title="Interpreting consumer segments at scale" class="img-fluid rounded z-depth-1" %}
  </div>
</div>
<div class="caption">
  Image generated with <a href="https://developers.openai.com/api/docs/models/gpt-image-2">GPT Image 2</a>
</div>

## Making large profiles usable

Consumer-segment profiles can contain many variables and comparison points. The information is valuable, but large tabular exports make it slow to find the patterns that could support a strategic discussion.

I built an internal product that turns those structured profiles into a guided exploration. It gives users concise section summaries, selected charts, and a way to ask questions about the complete dataset. A process that previously took multiple days can now happen interactively in minutes.

I am the primary developer and technical owner. I designed the workflow, developed the application, and continue to maintain the deployed product.

## From tables to guided questions

The product did not begin with its current interface. Early versions worked more directly with large exports. Over time, I added several ways into the data: summaries for orientation, charts for visible patterns, and questions for following a specific line of inquiry.

Each part serves a different purpose. The summaries help users decide where to look. The charts make comparisons easier to inspect. Questions let them move beyond the curated views without losing access to the underlying evidence.

## A reliability lesson hidden in the input

One early problem looked like a prompting problem but came from the data representation. When the structure of a large table was lost, the model struggled to follow relationships between questions, values, and comparison groups.

Preserving that structure made the answers more dependable. It helped the model work from the supplied data instead of producing unsupported codes or conclusions. This became one of the main design rules for the product: reliable model behaviour starts with reliable input structure.

The application makes exploration faster. People still check the evidence and decide which findings are suitable for client work.
