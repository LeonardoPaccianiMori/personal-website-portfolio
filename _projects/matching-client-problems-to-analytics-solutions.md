---
layout: page
title: Matching client briefs to analytics capabilities
description: A working prototype chatbot that turns client briefs into explainable analytics recommendations grounded in a capabilities catalogue
img: assets/img/projects/professional/analytics-solution-matching.png
importance: 3
category: professional
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

I supervised the development of a working prototype chatbot designed to help client-facing teams match client problems to relevant internal analytics capabilities. The tool takes a client context, business challenge, and optional available data sources, then asks clarifying questions and recommends suitable solutions from an internal capabilities catalogue.

The prototype worked, but development was paused when stakeholder feedback raised a more fundamental question: whether the intended users had enough reason to change an already established workflow.

---

## Problem

Large analytics catalogues can be difficult to navigate, especially when client-facing teams need to quickly connect a business problem with the right internal capability. The goal was to make those capabilities easier to discover, compare, and explain during client-facing work.

The challenge was to make the catalogue easier to use: starting from a client problem, the tool needed to suggest relevant capabilities, explain why they fit, and help users understand what questions to ask next.

---

## My role

I supervised and mentored the primary developer rather than implementing the application myself. We defined how the tool should work together; I tested the prototype with the primary developer, reviewed its recommendations, and occasionally helped resolve technical issues.

---

## What the prototype does

- Accepts structured input about the client, the business problem, and optionally the available data sources.
- Asks clarifying questions when the brief is incomplete.
- Searches an internal catalogue of analytics capabilities and identifies relevant options.
- Explains why each recommended offering fits the client problem.
- Supports follow-up questions and iteration, so users can refine the recommendation through conversation.

---

## Reliability and constraints

The prototype depends heavily on the quality and completeness of the underlying capabilities catalogue; recommendation quality improves as the catalogue becomes more structured and current.

The catalogue was incomplete, and bringing it up to date would have required substantial work. The tool also needed to remain decision support rather than an authoritative recommendation engine: its recommendations could only be as reliable as the catalogue behind them.

---

## Adoption and outcome

Stakeholder feedback indicated that the intended users were deeply embedded in their existing ways of working, creating a substantial risk that a new tool would not be adopted. At the same time, improving the catalogue enough to support the prototype would have required significant effort.

Development was therefore paused pending clearer evidence of demand. The prototype did not reach production adoption or demonstrate business impact.

---

## What I took from it

A technically working prototype is not sufficient when its value depends on users changing an established workflow and on maintaining an expensive knowledge base. For me, this project was also an exercise in supervision: supporting another developer, testing the result together, and recognizing when further engineering was not yet justified.
