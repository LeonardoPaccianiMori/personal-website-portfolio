---
layout: page
title: Cleaning Open-Ended Brand Responses at Scale
description: Production LLM-assisted workflow for standardizing messy survey answers and reducing manual cleaning from days or weeks to minutes
img: assets/img/projects/work/brand-response-cleaning.png
importance: 2
category: work
---

<div class="row">
    <div class="col-sm mt-3 mt-md-0">
        {% include figure.liquid loading="eager" path="assets/img/projects/work/brand-response-cleaning.png" title="Generic spreadsheet and research workspace" class="img-fluid rounded z-depth-1" %}
    </div>
</div>
<div class="caption">
    Generic illustrative thumbnail.
</div>

**Professional AI system, anonymized**

## Summary
I built a production LLM-assisted workflow for standardizing messy open-ended survey answers into cleaner, analysis-ready brand response labels.

---

## Problem
Open-ended survey responses are useful because they preserve respondent language, but they are difficult to analyze at scale. The same brand, product, or concept can appear with spelling variants, abbreviations, partial names, and unrelated noise, leaving analysts with slow manual cleaning work before any meaningful aggregation can happen.

---

## What I Built
- A cleaning workflow that normalized messy free-text responses into standardized labels.
- LLM-assisted candidate matching supported by deterministic validation and review steps.
- Batch processing for large response files so analysts could move from raw answers to usable categories quickly.
- Human review points for ambiguous responses and low-confidence mappings.

---

## Reliability / Constraints
The workflow was built around conservative standardization. It prioritized traceability, confidence checks, and reviewable outputs over fully automated relabeling, because incorrect normalization can distort downstream brand analysis.

---

## Impact
The system turned multi-day cleaning into a minutes-scale workflow and was used in production by internal teams handling recurring survey data.

---

## What I Can Share
I can describe the workflow architecture, review loop, validation approach, and lessons from applying LLMs to messy categorical data. I cannot share raw survey responses, client-specific taxonomies, internal datasets, or proprietary matching rules.
