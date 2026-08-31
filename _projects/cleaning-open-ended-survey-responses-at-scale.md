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

## Automation that knows when to stop

Open-ended brand-awareness answers are rarely tidy. The same brand can appear with misspellings, abbreviations, partial names, or several inconsistent variants. Before analysts can calculate metrics, somebody has to decide which answers belong together.

The risk is easy to overlook: a confident but incorrect mapping can change the analysis that follows. The workflow was therefore designed to be conservative. It standardizes repeatable cases while making uncertainty visible.

## My contribution

I supervised the development of the internal application; a colleague was the primary developer. I defined the end-to-end workflow, reviewed successive versions, and helped troubleshoot difficult issues.

A central review question was where useful automation should end and analyst judgment should begin. That boundary shaped the workflow as much as the model itself.

## Making uncertainty part of the output

The application uses the product category as context and proposes consistent brand labels. When an answer is ambiguous or unrecognized, it enters a manual-review step instead of being forced into the closest known brand.

The user can resolve the mapping or keep the response explicitly as `unknown`. This small option is important: it lets the cleaned dataset admit uncertainty rather than hide it.

The deployed application is now used for recurring Consumer Insight work. After using it on real survey waves, users reported that a process which had taken several days could be completed in minutes. The estimate is user-reported, but the practical lesson is clear: automation can save substantial time without pretending that every case is equally certain.
