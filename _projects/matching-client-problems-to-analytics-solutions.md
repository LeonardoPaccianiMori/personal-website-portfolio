---
layout: page
title: Matching Client Briefs to Analytics Capabilities
description: A working internal chatbot that turns client briefs into explainable analytics recommendations grounded in a capabilities catalogue
img: assets/img/projects/work/analytics-solution-matching.png
importance: 3
category: work
---

<div class="row">
    <div class="col-sm mt-3 mt-md-0">
        {% include figure.liquid loading="eager" path="assets/img/projects/work/analytics-solution-matching.png" title="Generic business planning table" class="img-fluid rounded z-depth-1" %}
    </div>
</div>

## Summary
I supervised the development of a working prototype chatbot that helps client-facing teams match client problems to relevant internal analytics capabilities. The tool takes a client context, business challenge, and optional available data sources, then asks clarifying questions and recommends suitable solutions from an internal capabilities catalogue.

---

## Problem
The company had a broad catalogue of analytics capabilities, but the people closest to clients did not always know which solutions existed, how they worked, or when they were relevant. As a result, useful internal capabilities could be missed during client-facing workflows.

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
The prototype depends heavily on the quality of the internal capabilities catalogue. If the catalogue is incomplete, outdated, or too vague, the chatbot's recommendations become less reliable.

For that reason, the tool is currently treated as decision support rather than an authoritative recommendation engine. Full development would require improving the catalogue itself and validating whether the intended users would rely on the tool in real client-facing workflows.

---

## Status
This remains a working prototype. Further development depends on user validation to understand whether the tool would be useful enough to justify the catalogue maintenance and additional implementation work.

Planned extensions include connecting recommendations to richer capability documentation and past use-case material, so users can understand not only which solution fits but also how similar work has been delivered before.
