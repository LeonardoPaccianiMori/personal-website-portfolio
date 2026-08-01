---
layout: page
title: Matching Client Briefs to Analytics Capabilities
description: A working internal chatbot that turns client briefs into explainable analytics recommendations grounded in a capabilities catalogue
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
I supervised the development of a working prototype chatbot that helps client-facing teams match client problems to relevant internal analytics capabilities. The tool takes a client context, business challenge, and optional available data sources, then asks clarifying questions and recommends suitable solutions from an internal capabilities catalogue.

---

## Problem
Large analytics catalogues can be difficult to navigate, especially when client-facing teams need to quickly connect a business problem with the right internal capability. The goal was to make those capabilities easier to discover, compare, and explain during client-facing work.

The challenge was to make the catalogue easier to use: starting from a client problem, the tool needed to suggest relevant capabilities, explain why they fit, and help users understand what questions to ask next.

---

## My Role
I helped scope the prototype, define the interaction flow, and supervise the development of the recommendation logic. I also reviewed the outputs with a focus on whether the suggestions were understandable, useful for client-facing work, and appropriately grounded in the internal catalogue.

---

## What the Prototype Does
- Accepts structured input about the client, the business problem, and optionally the available data sources.
- Asks clarifying questions when the brief is incomplete.
- Searches an internal catalogue of analytics capabilities and identifies relevant options.
- Explains why each recommended offering fits the client problem.
- Supports follow-up questions and iteration, so users can refine the recommendation through conversation.

---

## Reliability and Constraints
The prototype depends heavily on the quality and completeness of the underlying capabilities catalogue; recommendation quality improves as the catalogue becomes more structured and current.

For that reason, the tool is currently treated as decision support rather than an authoritative recommendation engine. Further development would require continued catalogue refinement and validation with intended users.

---

## Status
This remains a working prototype. Further development depends on user validation, catalogue refinement, and prioritization against other internal workflow needs.

Planned extensions include connecting recommendations to supporting documentation and example use cases, so users can better understand why a recommendation fits.
