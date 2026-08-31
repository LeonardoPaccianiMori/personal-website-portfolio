---
layout: page
title: Accelerating qualitative interview analysis
description: An internal AI agent that turns extensive Italian interview materials into thematic syntheses, traceable answers, and translated client deliverables
img: assets/img/projects/professional/qualitative-interview-analysis.png
importance: 1
category: professional
project_overview:
  status: Active · Deployed · User testing
  period: May 2026–present
  role: Primary developer; maintains and deploys the application
  outcome: Users estimate that it could reduce the complete workflow from about one month to about one week.
  evidence: Internal system; code, project materials, and user examples are private.
---

<div class="row">
  <div class="col-sm mt-3 mt-md-0">
    {% include figure.liquid loading="eager" path="assets/img/projects/professional/qualitative-interview-analysis.png" title="Accelerating Qualitative Interview Analysis" class="img-fluid rounded z-depth-1" %}
  </div>
</div>
<div class="caption">
  Image generated with <a href="https://developers.openai.com/api/docs/models/gpt-image-2">GPT Image 2</a>
</div>

## Summary

I designed and built an internal AI application for qualitative interview analysis. It turns Italian transcripts, interview guides, participant worksheets, and project context into a first thematic report, traceable answers to bespoke questions, and translated client materials.

The application is deployed and in user testing. Researchers remain responsible for interpretation, revision, and the final client deliverable.

## Finding the actual deliverable

The first version was a chatbot. It worked technically, but researchers explained that their real need was a long, structured report organized around the interview guide. I moved the first-draft thematic report to the centre of the product and retained question answering, translation, and session recovery around it.

This change mattered more than adding another feature. It aligned the application with the document that researchers must produce.

## Evidence-grounded interaction

The application maps each project corpus, identifies document roles and interviewees, and creates a synthesis around the interview guide. For bespoke questions, it uses Direct Corpus Interaction: the agent searches the raw corpus, narrows the candidate material, and inspects the evidence directly. [The method is described in this research paper](https://arxiv.org/abs/2605.05242).

Each answer includes citations to supporting passages. A researcher can inspect the cited paragraph, its surrounding context, its document, and its interviewee. The system also translates Italian transcripts and human-prepared presentations into English while preserving presentation structure and formatting.

## Deployment, testing, and impact

I built the application end to end and now maintain and deploy it independently within shared infrastructure that another engineer originally established. I refine it with feedback from Consumer Insight colleagues.

Users estimate that it could reduce the complete qualitative-analysis workflow from about one month to about one week. This is a qualified user estimate, not an independently measured benchmark.

The unresolved question is the quality and structure of the generated report. The system can produce one, but user testing must still determine what makes that first draft genuinely useful. Human review remains essential before any output becomes a client deliverable.
