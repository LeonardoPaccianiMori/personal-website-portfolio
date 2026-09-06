---
layout: page
title: Building an agentic creative research assistant
description: Keeping source evidence attached as specialized agents turn web, video, and supplied material into a cited research report
img: assets/img/projects/professional/creative-research-synthesis.png
importance: 4
category: professional
card_role: Sole designer and implementer
project_overview:
  status: Exploratory prototype · Paused
  period: started March 2026
  role: Sole designer and implementer
  outcome: Demonstrated an end-to-end cited research-report loop; adoption and business impact were not validated.
  evidence: Internal prototype; code and supplied creative material are private.
---

<div class="project-lead-image row">
  <div class="col-sm mt-3 mt-md-0">
    {% include figure.liquid loading="eager" path="assets/img/projects/professional/creative-research-synthesis.png" title="Building an Agentic Creative Research Assistant" alt="" class="img-fluid rounded z-depth-1" %}
  </div>
</div>
<div class="caption">
  Image generated with <a href="https://developers.openai.com/api/docs/models/gpt-image-2">GPT Image 2</a>
</div>

## Combining research without losing its sources

Creative research brings together web pages, videos, and material supplied by the user. I designed and built a prototype that uses several AI agents to research those sources and produce one structured report.

The difficult part was the handover between agents. A summary might retain a conclusion while losing the passage that supported it. After several such steps, the final report could be difficult to check.

## Designing the handovers

I divided the work by source. Web and video researchers collected findings from public sources, while another agent inspected material supplied by the user. Synthesis agents then organized the findings into a report.

I passed the source evidence and citations along with each finding. The later agents could consult that material while combining the research, rather than relying only on an earlier summary or reconstructing its sources.

This kept the connection between the research and the report available for inspection. It did not make every source dependable: web material can still be incomplete, outdated, or wrong.

## What worked, and where the project stopped

The prototype completed the path from research across several sources to a cited report. I designed and implemented that workflow, including the division of work between agents and the movement of evidence into the final synthesis.

The project paused when other work took priority. It remained an exploratory prototype: adoption was not tested, and no production time saving or commercial impact was measured. Its completed result was the working research-and-reporting process.
