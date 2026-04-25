---
layout: page
title: Turning Audience Data Into Strategy
description: Production LLM workflow for summarizing large audience-profiling outputs and answering grounded questions over structured segment data
img: assets/img/projects/work/audience-strategy.png
importance: 1
category: work
---

<div class="row">
    <div class="col-sm mt-3 mt-md-0">
        {% include figure.liquid loading="eager" path="assets/img/projects/work/audience-strategy.png" title="Analyst workspace with audience strategy notes" class="img-fluid rounded z-depth-1" %}
    </div>
</div>
<div class="caption">
    Generic illustrative thumbnail.
</div>

**Professional AI system, anonymized**

## Summary
I built a production LLM workflow that turned large audience-profiling outputs into concise strategy summaries and grounded question answering over structured segment data.

---

## Problem
Audience strategy work often started with large tabular exports from connected audience data sources. The information was rich, but exploring it manually was slow: teams had to inspect many segments, compare signals, and translate statistical patterns into usable strategic language.

---

## What I Built
- A workflow that ingested structured tabular outputs describing audience segments.
- Prompting and retrieval logic for answering questions against the available segment evidence.
- Summary generation that translated survey, brand perception, behavioral, and mobility-derived signals into strategy-oriented observations.
- Guardrails that kept responses grounded in the provided data rather than general market assumptions.

---

## Reliability / Constraints
The system was designed for internal users who needed quick interpretation, not black-box decision making. Outputs preserved links back to the underlying structured evidence, and the workflow avoided exposing internal linkage and segmentation methods in user-facing copy.

---

## Impact
The workflow reduced weeks of manual exploration into a much faster review process and was used in production by internal teams working with audience strategy data.

---

## What I Can Share
I can discuss the product shape, the LLM workflow design, the grounding strategy, and the reliability constraints. I cannot share client-specific examples, exact datasets, internal linkage methods, or proprietary segmentation details.
