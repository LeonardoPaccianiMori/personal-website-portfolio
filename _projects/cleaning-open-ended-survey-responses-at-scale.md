---
layout: page
title: Cleaning open-ended survey responses at scale
description: Standardizing messy brand mentions with analyst review; users report reducing days of survey preparation to minutes
img: assets/img/projects/professional/survey-response-cleaning.png
importance: 2
category: professional
card_role: Workflow supervisor
project_overview:
  status: Development complete · Deployed · Recurring use
  period: March–June 2026
  role: Workflow supervisor; a colleague was the primary developer
  outcome: Users report that it reduced a multi-day cleaning process to minutes.
  evidence: Internal system; code and survey data are private.
---

<div class="project-lead-image row">
  <div class="col-sm mt-3 mt-md-0">
    {% include figure.liquid loading="eager" path="assets/img/projects/professional/survey-response-cleaning.png" title="Cleaning Open-Ended Survey Responses at Scale" alt="" class="img-fluid rounded z-depth-1" %}
  </div>
</div>
<div class="caption">
  Image generated with <a href="https://developers.openai.com/api/docs/models/gpt-image-2">GPT Image 2</a>
</div>

## Automation that knows when to stop

Open-ended brand-awareness answers are rarely tidy. The same brand can appear with misspellings, abbreviations, partial names, or several inconsistent variants. Before analysts can calculate metrics, somebody has to decide which answers belong together.

I supervised the development of a workflow to standardize those answers. A colleague was the primary developer; I defined the end-to-end workflow, reviewed successive versions, and helped troubleshoot difficult issues. An incorrect mapping could change the analysis, so ambiguous answers needed a review path.

## Making uncertainty part of the output

The application uses the product category as context and proposes consistent brand labels. When an answer is ambiguous or unrecognized, it enters a manual-review step instead of being forced into the closest known brand.

The user can resolve the mapping or keep the response explicitly as `unknown`. This small option is important: it lets the cleaned dataset admit uncertainty rather than hide it.

The deployed application is now used for recurring Consumer Insight work. After using it on real survey waves, users reported that a process which had taken several days could be completed in minutes. That saving is user-reported rather than independently measured. Analysts still resolve the uncertain cases.
