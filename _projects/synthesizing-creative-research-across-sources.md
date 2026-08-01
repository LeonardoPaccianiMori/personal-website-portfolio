---
layout: page
title: Building an Agentic Creative Research Assistant
description: A working agentic prototype that turns scattered web and video sources into structured research reports for creative strategy
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
I worked on an early-stage agentic prototype for creative research. The tool helps creative teams move from scattered web and video sources to a structured research report that can support campaign strategy.

---

## Problem
Before developing campaign ideas, creative teams often spend a large amount of time researching the brand, product category, previous communication, cultural context, and relevant examples. That research can span public web pages, video sources, audio material, and creative-reference material.

The work is valuable, but fragmented: teams have to collect sources, inspect them manually, compare observations, and turn everything into a coherent brief before strategic creative work can begin.

---

## What I Built
- A working agentic prototype for the early discovery phase of creative strategy.
- A form-based workflow where users provide relevant web pages or video links as starting points.
- Parallel research agents that expand from those links, search for additional context, and inspect relevant sources.
- Web and video processing that turns source material into observations.
- A synthesis layer that combines the agents' findings into a structured research report.
- A report format designed to separate findings, supporting evidence, source notes, and open questions.

---

## Current Scope
The current prototype can complete the research loop for public web pages and video sources: starting from user-provided links, it gathers additional context, inspects the material, and produces a synthesized report.

Possible extensions include support for additional audio and creative-reference sources, so the workflow can cover more of the research material creative teams already use.

---

## Reliability and Constraints
The prototype is designed as research support, not as final creative direction. Public-source research can be incomplete, outdated, or noisy, so the system needs to make sources visible and keep uncertainty explicit.

The main technical challenge is coordinating multiple agents without losing traceability: each synthesized observation needs to remain connected to the material that supported it.

---

## Status
This remains a working prototype. The next step is further validation of report usefulness in realistic creative-research workflows.
