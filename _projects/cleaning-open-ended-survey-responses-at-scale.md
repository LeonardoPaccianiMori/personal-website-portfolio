---
layout: page
title: Cleaning open-ended survey responses at scale
description: A deployed, human-in-the-loop workflow for turning open-ended brand survey answers into reviewable, analysis-ready data
img: assets/img/projects/professional/survey-response-cleaning.png
importance: 2
category: professional
project_overview:
  status: Development complete · Deployed · Recurring use
  period: March–June 2026
  role: Workflow supervisor; a colleague was the primary developer
  outcome: Users report that it reduced a multi-day cleaning process to minutes.
  evidence: Internal system; code and survey data are private.
---

<div class="row">
  <div class="col-sm mt-3 mt-md-0">
    {% include figure.liquid loading="eager" path="assets/img/projects/professional/survey-response-cleaning.png" title="Cleaning Open-Ended Survey Responses at Scale" class="img-fluid rounded z-depth-1" %}
  </div>
</div>
<div class="caption">
  Image generated with <a href="https://developers.openai.com/api/docs/models/gpt-image-2">GPT Image 2</a>
</div>

## Summary and my role

I supervised the development of an internal LLM-assisted workflow for cleaning open-ended brand-survey responses. A colleague was the primary developer. I defined the end-to-end workflow, reviewed successive versions, and helped troubleshoot difficult issues.

The deployed application is now used autonomously for recurring Consumer Insight work. After using it on real survey waves, users reported that it reduced a process that had taken multiple days to minutes. This is a user-reported result, not an independently measured benchmark.

## The cleaning problem

Open-ended brand-awareness answers contain misspellings, abbreviations, partial names, and inconsistent variants. Analysts must standardize these responses before they can calculate metrics or compare respondent segments.

An incorrect mapping can distort the downstream analysis. For that reason, the important design choice was not aggressive automation. It was conservative, reviewable cleaning.

## Conservative automation

The workflow uses the product category as context, proposes consistent brand labels, and produces analysis-ready output. It does not force every response into a known brand.

Ambiguous or unrecognized answers enter a manual-review step. The user can resolve the mapping or retain the answer explicitly as `unknown`. This concentrates human judgment on uncertain cases while making repeatable cases much faster to process.

The result is a human-in-the-loop workflow: autonomous recurring use for the common cases, clear review boundaries for the difficult ones, and no claim that analyst judgment has been removed.
