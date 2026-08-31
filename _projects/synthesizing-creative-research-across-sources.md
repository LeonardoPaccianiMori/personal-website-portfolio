---
layout: page
title: Building an agentic creative research assistant
description: An exploratory multi-agent prototype that turns web, video, and user-supplied creative material into an evidence-grounded research report
img: assets/img/projects/professional/creative-research-synthesis.png
importance: 4
category: professional
project_overview:
  status: Exploratory prototype · Paused
  period: started March 2026
  role: Sole designer and implementer
  outcome: Demonstrated an end-to-end cited research-report loop; adoption and business impact were not validated.
  evidence: Internal prototype; code and supplied creative material are private.
---

<div class="row">
  <div class="col-sm mt-3 mt-md-0">
    {% include figure.liquid loading="eager" path="assets/img/projects/professional/creative-research-synthesis.png" title="Building an Agentic Creative Research Assistant" class="img-fluid rounded z-depth-1" %}
  </div>
</div>
<div class="caption">
  Image generated with <a href="https://developers.openai.com/api/docs/models/gpt-image-2">GPT Image 2</a>
</div>

## Summary

I designed and implemented an exploratory multi-agent prototype for creative research. It completed an end-to-end loop across public web pages, video sources, and user-supplied creative material, then produced a cited report.

The technical loop worked. Adoption was not tested, and business impact was not validated. Higher-priority work caused the project to pause.

## Evidence-preserving synthesis

The central technical problem was not splitting research across agents. It was combining their findings without losing the evidence behind them.

I designed the workflow so that source material and citations stayed attached as findings moved through the system. The final synthesis organized the collected evidence into a readable report without separating claims from their sources.

The workflow used a small set of specialized roles:

- web and video research agents collected source-grounded findings;
- an agent inspected creative material supplied by the user;
- downstream agents combined the findings into a structured report.

## Boundaries and status

The output was research support, not final creative direction. Public sources can be incomplete, outdated, or noisy, and a coherent cited report can still be wrong or incomplete. Human review would remain necessary before strategic use.

The prototype demonstrated a complete cited reporting loop and gave me practical experience coordinating specialized agents. It did not demonstrate product adoption or commercial value. It remains paused because other work took priority, not because the end-to-end loop failed.
