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

## Keeping evidence attached

Creative research often brings together material from web pages, videos, and references supplied by the user. An agent can summarize each source, but a longer chain creates a new risk: by the time several summaries become one report, the connection between a claim and its evidence can disappear.

That became the central problem for this exploratory prototype. I designed and implemented a workflow in which source material and citations stayed attached as findings moved from research to synthesis.

## A small research team of agents

Different agents handled different parts of the work. Web and video researchers collected findings from public sources. Another agent inspected creative material supplied by the user. Downstream agents then organized those findings into a structured report.

The division of work was straightforward. Preserving provenance was harder. I kept the evidence with each finding instead of asking later agents to recreate or guess its source. The final report could therefore remain readable without becoming detached from the material behind it.

## What the prototype established

The prototype completed the full path from multi-source research to a cited report. It showed that the evidence-preserving workflow could operate end to end and gave me practical experience coordinating specialized agents.

The report was still research support rather than final creative direction. Public sources may be incomplete, outdated, or wrong, and citations make a claim inspectable rather than automatically reliable.

The project paused when other work took priority. Adoption was not tested, so there is no claim of production use or commercial impact. What remains is a working exploration of a more useful multi-agent question: not how many agents can participate, but whether their combined answer can still show its work.
