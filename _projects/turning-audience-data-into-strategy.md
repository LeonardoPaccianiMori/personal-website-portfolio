---
layout: page
title: Interpreting Consumer Segments at Scale
description: An internal LLM workflow for making large segment-profile outputs easier to explore, summarize, and use in strategy work
img: assets/img/projects/work/interpreting-consumer-segments.png
importance: 1
category: work
---

<div class="row">
    <div class="col-sm mt-3 mt-md-0">
        {% include figure.liquid loading="eager" path="assets/img/projects/work/interpreting-consumer-segments.png" title="Interpreting consumer segments at scale" class="img-fluid rounded z-depth-1" %}
    </div>
</div>

## Summary
I built an internal LLM workflow that helps strategy teams explore large, multi-source consumer-segment profiles. The system turns structured segment data into concise summaries, curated dashboard visualizations, and data-backed answers to custom questions.

---

## Problem
Segment reports were historically generated as large tabular exports from several connected data sources. The outputs were rich, but difficult to use: a single report could contain tens of thousands of rows comparing a target segment against a reference group.

Strategists traditionally reviewed these files manually to identify patterns and extract useful insights, a process that could take multiple days before the data became usable in a strategic discussion.

---

## What I Built
- A dashboard for exploring generated segment-profile outputs.
- Section-level LLM summaries for areas such as demographics, attitudes, purchase drivers, brand relationships, and media behavior.
- Curated dashboard charts that make key patterns easier to inspect directly.
- A chat interface that answers open-ended questions over the full structured segment output.
- Prompting and data-formatting guardrails to keep responses grounded in the supplied tables.

---

## Reliability and Constraints
The main technical challenge was preventing the model from inventing unsupported claims. Early versions became unreliable when large tables were flattened into plain text.

The system became much more stable after preserving the data as structured JSON-like inputs and giving the model detailed instructions for navigating the tables. This made the tabular relationships easier to follow and reduced unsupported answers.

The tool is designed as decision support for users reviewing segment reports: it accelerates exploration, but the outputs still need human review before being used in client-facing work.

---

## Impact
The workflow turned a multi-day insight extraction process into a minutes-scale interactive workflow and has been used by internal teams working with consumer-segment reports.
