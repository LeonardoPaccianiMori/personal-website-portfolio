---
layout: page
title: Cleaning open-ended survey responses at scale
description: A deployed, human-in-the-loop workflow for turning open-ended brand survey answers into reviewable, analysis-ready data
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

I supervised the development of an internal LLM-assisted workflow that turns messy brand-awareness survey responses into reviewable, analysis-ready data. A colleague was the primary developer; I defined the overall workflow, reviewed successive versions of the application, and helped troubleshoot issues. The deployed tool is now used autonomously by the Consumer Insights team for recurring work.

---

## Problem

Brand tracking surveys often include open-ended questions such as which brand first comes to mind within a product category. These answers are very valuable, but they arrive as messy free text: misspellings, abbreviations, partial names, and inconsistent variants of the same brand's name.

Before analysts can even begin using the data to compute metrics or compare results across respondent segments, they have to manually build correction dictionaries and clean the raw answers. This repetitive work can take multiple days for a single survey wave.

---

## My role

My role was supervisory rather than hands-on implementation. I defined how the end-to-end workflow should operate, reviewed different versions as the application developed, and helped the primary developer troubleshoot difficult issues.

---

## What the tool does

- Uploads raw survey response files and uses the selected product category as context.
- Standardizes free-text brand answers into clean, consistent labels.
- Produces cleaned outputs for downstream analysis.
- Sends ambiguous or unrecognized responses to a manual-review step.

---

## Reliability and constraints

The main risk was incorrect standardization: mapping a misspelled or ambiguous response to the wrong brand would distort downstream brand analysis.

The workflow was therefore designed around conservative cleaning, reviewable outputs, and repeatable processing rather than one-off text generation. When the application cannot resolve a response, the user decides how to map it or can retain it explicitly as `unknown`. The goal is not to replace analyst judgment, but to concentrate it on the cases that genuinely require interpretation.

---

## Impact

After using the deployed application on real survey waves, users reported that it reduced a process that had taken multiple days to a matter of minutes. More importantly for adoption, Consumer Insights users now operate the application autonomously as part of recurring survey work.
