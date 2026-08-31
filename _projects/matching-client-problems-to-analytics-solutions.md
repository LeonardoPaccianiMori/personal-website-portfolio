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

## A working prototype was only the first test

This project explored whether a chatbot could connect a client brief to the most relevant capabilities in an internal analytics catalogue. The prototype could ask clarifying questions, search the catalogue, suggest possible matches, and explain its reasoning.

That proved the interaction could work. It did not answer the more important product question: would people use it often enough to justify maintaining the knowledge behind it?

## My role in the project

I supervised and mentored the primary developer. I helped define the intended behaviour, tested recommendations with the primary developer, reviewed successive versions, and occasionally fixed difficult bugs. I was not the main developer.

This made the project as much about product validation and technical supervision as about the prototype itself.

## The cost behind the interface

Recommendations were only as useful as the catalogue supporting them. That catalogue was incomplete, and keeping capabilities, owners, contacts, and descriptions current would require sustained work.

Stakeholder feedback raised a second concern. The intended users were already strongly established in their existing workflows, so a useful prototype would not automatically lead to adoption.

With no clear demand strong enough to offset those costs, stakeholders recommended keeping the project on hold rather than investing further in the catalogue. No later follow-up arrived, and the prototype did not reach production adoption or demonstrate business impact.

The pause was a useful product signal. Building more features would not by itself resolve uncertain demand, ongoing catalogue maintenance, or the effort required to change an established workflow. The prototype remains a working exploration rather than an explicitly rejected product.
