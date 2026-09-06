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

## Deciding which answers belong together

A brand-awareness survey can contain misspellings, abbreviations, partial names, and several versions of the same brand. Analysts need consistent labels before they can calculate results, but an incorrect match can change the analysis.

I defined the workflow and supervised development of an application to do this cleaning. A colleague was the primary developer. I reviewed successive versions and helped troubleshoot difficult issues.

## A place for unresolved answers

The application uses the product category as context and proposes consistent brand labels. Ambiguous or unrecognized answers go to a manual-review step. The user can resolve the mapping or retain the response as `unknown`.

That choice is part of the workflow. The application can speed up routine corrections while leaving an analyst a clear way to handle the cases that need judgment.

## Recurring use

The deployed application is now used for recurring Consumer Insight work. After using it on real survey waves, users reported that preparation which had taken several days could be completed in minutes. That saving is user-reported rather than independently measured; analysts still resolve uncertain cases.
