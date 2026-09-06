---
layout: page
title: Interpreting consumer segments at scale
description: Making large consumer-segment profiles easier to explore, reducing a multi-day workflow to minutes
img: assets/img/projects/professional/interpreting-consumer-segments.png
importance: 1
category: professional
card_role: Primary developer and technical owner
project_overview:
  status: Active · Deployed
  period: June 2025–present
  role: Primary developer and technical owner
  outcome: Turns a multi-day segment-exploration process into a minutes-scale interactive workflow.
  evidence: Internal system; code and data are proprietary.
---

<div class="project-lead-image row">
  <div class="col-sm mt-3 mt-md-0">
    {% include figure.liquid loading="eager" path="assets/img/projects/professional/interpreting-consumer-segments.png" title="Interpreting consumer segments at scale" alt="" class="img-fluid rounded z-depth-1" %}
  </div>
</div>
<div class="caption">
  Image generated with <a href="https://developers.openai.com/api/docs/models/gpt-image-2">GPT Image 2</a>
</div>

## From a large table to an application people could use

Consumer-segment profiles contain many variables and comparison points. Working through a large export made it slow to find useful patterns and follow up on them. I developed an internal application that lets users explore those profiles through summaries, charts, and questions about the data.

I am the primary developer and technical owner. I designed the workflow, developed the application, and continue to maintain the deployed product. Measured operating evidence showed the exploration workflow moving from days to minutes.

## The input was part of the problem

One early failure looked like something I could fix by changing a prompt. The model produced unsupported codes or conclusions, but the problem also lay in what it received: the structure of the original table had been lost. It could no longer reliably follow the relationships between questions, values, and comparison groups.

I changed the data representation to preserve those relationships. That made the answers more dependable and became a design rule for later work on the application. The model needed an input it could follow before further prompt changes would be useful.

## Giving users several ways into the same data

Early versions worked more directly with large exports. As the application developed, I added summaries to help users orient themselves, charts to inspect comparisons, and follow-up questions for lines of inquiry that the prepared views did not cover.

These features serve different stages of exploration. A user can begin with an overview, examine a pattern, then ask a more specific question. People still check the evidence and decide which findings are suitable for client work.
