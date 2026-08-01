---
layout: page
title: Cleaning Open-Ended Survey Responses at Scale
description: An internal workflow that standardizes respondent-written survey answers so analysts can move from raw files to usable metrics in minutes
img: assets/img/projects/professional/survey-response-cleaning.png
importance: 2
category: professional
---

<div class="row">
    <div class="col-sm mt-3 mt-md-0">
        {% include figure.liquid loading="eager" path="assets/img/projects/professional/survey-response-cleaning.png" title="Cleaning Open-Ended Survey Responses at Scale" class="img-fluid rounded z-depth-1" %}
    </div>
</div>
<div class="caption">
    Image generated with <a href="https://developers.openai.com/api/docs/models/gpt-image-2">GPT Image 2</a>
</div>

## Summary
I supervised the development of an internal LLM-assisted workflow that standardizes messy open-ended survey responses into analysis-ready labels. The tool takes survey Excel files, uses the relevant product category as context, and cleans respondent-written answers in minutes instead of multiple days.

---

## Problem
Brand tracking surveys often include open-ended questions such as which brand first comes to mind within a product category. These answers are valuable, but they arrive as messy free text: misspellings, abbreviations, partial names, and inconsistent variants of the same brand.

Before analysts could compute metrics or compare results across respondent segments, they had to manually build correction dictionaries and clean the raw answers. This was repetitive, error-prone work that could take multiple days, and sometimes longer, for a single survey wave.

---

## My Role
I helped scope the workflow, translate the team's manual process into product requirements, and supervise the development of the LLM-assisted cleaning logic. I also reviewed the outputs with a focus on reliability, usability, and whether the tool preserved enough transparency for analysts to trust the cleaned results.

---

## What the Tool Does
- Uploads raw survey response files and uses the selected product category as context.
- Standardizes free-text brand answers into clean, consistent labels.
- Turns raw responses into analysis-ready outputs for downstream aggregation and segmentation.
- Produces reviewable mapping outputs so analysts can inspect how messy responses were standardized.
- Preserves the historical correction process while removing most of the manual cleaning effort.

---

## Reliability and Constraints
The main risk was incorrect standardization: mapping a misspelled or ambiguous response to the wrong brand would distort downstream brand analysis.

The workflow was therefore designed around conservative cleaning, reviewable outputs, and repeatable processing rather than one-off text generation. The goal was not to replace analyst judgment entirely, but to remove the repetitive manual work that made the process slow.

---

## Impact
The tool turned a multi-day survey-response cleaning process into a minutes-scale workflow and supports recurring survey-analysis workflows.
