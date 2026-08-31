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

## Summary

I built and maintain a deployed internal product for exploring large consumer-segment profiles. It turns structured segment data into concise summaries, curated charts, and grounded answers to custom questions.

The workflow changes a multi-day exploration process into an interactive task that takes minutes. It supports analysis; it does not replace the human review needed before client-facing use.

## My role

I am the primary developer and technical owner. I designed the workflow, developed the application, and continue to maintain the deployed product.

## From exports to guided exploration

Segment-profile outputs can contain many dimensions and comparison points. The early problem was not a lack of data. It was that large tabular exports were slow to explore and difficult to turn into a strategic discussion.

The product evolved from direct work with those tables into a clearer interface:

- section-level summaries provide an entry point;
- curated charts make important patterns easier to inspect;
- grounded questions let users investigate the complete structured output.

This progression reduced the need to search large exports manually while keeping the underlying evidence available for review.

## Reliability through structured input

Early versions became unreliable when the structure of large tables was lost. Preserving the input structure made the relationships easier for the model to follow and helped it answer from the supplied evidence instead of inventing unsupported claims.

That lesson became a core design constraint: input structure can matter as much as prompt wording. The product accelerates exploration, but people remain responsible for checking the evidence and deciding what belongs in client work.
