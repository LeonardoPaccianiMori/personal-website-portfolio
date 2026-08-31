---
layout: page
title: Matching client briefs to analytics capabilities
description: A working prototype chatbot that turns client briefs into explainable analytics recommendations grounded in a capabilities catalogue
img: assets/img/projects/professional/analytics-solution-matching.png
importance: 3
category: professional
project_overview:
  status: Working prototype · Paused
  period: started February 2026
  role: Supervisor, mentor, tester, and occasional bug fixer
  outcome: Paused because adoption risk and catalogue-maintenance cost were not justified by clear demand.
  evidence: Internal prototype; code and catalogue data are private.
---

<div class="row">
  <div class="col-sm mt-3 mt-md-0">
    {% include figure.liquid loading="eager" path="assets/img/projects/professional/analytics-solution-matching.png" title="Generic business planning table" class="img-fluid rounded z-depth-1" %}
  </div>
</div>
<div class="caption">
  Image generated with <a href="https://developers.openai.com/api/docs/models/gpt-image-2">GPT Image 2</a>
</div>

## Summary

This was a product-validation and supervision case, not a production success. I supervised and mentored the primary developer of a working prototype that matched client briefs to an internal analytics-capabilities catalogue.

The prototype could clarify a brief, find relevant capabilities, and explain why they might fit. Development paused because the maintenance and adoption conditions were not strong enough to justify more engineering.

## My role

I was the supervisor, mentor, tester, and occasional bug fixer. I helped define how the tool should work, reviewed its recommendations with the primary developer, and supported difficult technical issues. I was not its primary developer.

## What the prototype tested

The chatbot accepted client context, a business problem, and optional data information. It could ask clarifying questions, search the internal catalogue, explain possible matches, and support follow-up discussion.

The technical loop worked. The harder questions concerned the product around it.

## Why it paused

The catalogue was incomplete, and keeping it current would require sustained ownership and maintenance. Stakeholder feedback also indicated that intended users were strongly established in their existing workflows. This created a material adoption risk.

Without clearer demand, that combination did not justify the catalogue work and further product investment. The prototype did not reach production adoption or demonstrate business impact.

The main lesson was product discipline: a working interface does not solve weak demand, high knowledge-maintenance cost, or workflow inertia.
