---
layout: page
title: Building an agentic creative research assistant
description: An exploratory multi-agent prototype that turns web, video, and user-supplied creative material into an evidence-grounded research report
img: assets/img/projects/professional/creative-research-synthesis.png
importance: 4
category: professional
---

<div class="row">
    <div class="col-sm mt-3 mt-md-0">
        {% include figure.liquid loading="eager" path="assets/img/projects/professional/creative-research-synthesis.png" title="Building an Agentic Creative Research Assistant" class="img-fluid rounded z-depth-1" %}
    </div>
</div>
<div class="caption">
    Image generated with <a href="https://developers.openai.com/api/docs/models/gpt-image-2">GPT Image 2</a>
</div>

## Summary

I designed and built an exploratory multi-agent prototype for creative research. It tested whether specialized agents could investigate web pages, video sources, and creative material supplied by a user, then combine their findings into one evidence-grounded report.

The prototype completed that research-and-reporting loop. It was never a priority product initiative, however, and was later paused when more pressing work took precedence.

---

## Problem

Before developing campaign ideas, creative teams often spend a large amount of time researching the brand, product category, previous communication, cultural context, and relevant examples. That research can span public web pages, video sources, audio material, and creative-reference material.

The work is valuable, but fragmented: teams have to collect sources, inspect them manually, compare observations, and turn everything into a coherent brief before strategic creative work can begin.

---

## My role

I designed and implemented the prototype, including the division of work between agents, the evidence flow, and the final synthesis process. The part I found most valuable was learning how to coordinate specialized agents and turn their findings into a coherent synthesis.

---

## How the multi-agent workflow worked

The workflow separated research by source type:

- A web-research agent searched for relevant information about the brand, visited promising pages, and extracted useful evidence.
- A video-research agent searched for and analysed relevant YouTube material.
- Another agent inspected creative material uploaded by the user.
- Downstream synthesis agents combined those specialized findings into a structured final report.

Dividing the work was relatively straightforward. The harder problem was turning the agents' separate findings into one coherent output without losing the evidence behind them.

---

## Reliability and constraints

I designed the evidence flow so that source material was not rewritten as it moved between agents and its citations remained attached throughout the workflow. The synthesis stages organized the findings into a readable report while preserving the source evidence and its correct citations.

The prototype was research support, not final creative direction. Public sources can be incomplete, outdated, or noisy, and a coherent report is not necessarily a complete or correct account. Human review would therefore remain necessary before using its output in strategy work.

---

## What the prototype demonstrated

The prototype could complete an end-to-end loop across public web pages, video sources, and user-supplied creative material, then produce a cited research report. It also gave me practical experience designing specialized agents and coordinating their outputs rather than asking one model to perform the entire task.

---

## Status and takeaway

The project is currently paused. It began as an exploratory experiment and was sidelined when higher-priority work required attention. Its adoption and business impact were never validated, so I do not present it as a production product.

I still consider the experiment worthwhile. Not every successful prototype needs to reach production: an exploratory project can demonstrate an approach, expose the difficult parts of a system, and develop skills that remain useful elsewhere.
