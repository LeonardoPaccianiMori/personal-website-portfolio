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

## The report was the real product

The first version of this application was a chatbot for exploring qualitative interview material. It worked, but conversations with researchers exposed a more important need: their work ends in a long, structured report, not a chat session.

I therefore rebuilt the experience around a first thematic report organized by the interview guide. Question answering, translation, and session recovery still matter, but they now support the document that researchers must ultimately produce.

The application works across Italian transcripts, interview guides, participant worksheets, and project context. It is deployed, and I continue to refine it with Consumer Insight colleagues during user testing.

## Letting researchers inspect the evidence

A useful draft is not enough if nobody can see where its claims came from. The application first maps the project material: what each document is, who each interviewee is, and how the interview guide structures the research.

When a researcher asks a specific question, the agent searches the original documents, narrows the relevant material, and reads the candidate passages directly. This approach is known as Direct Corpus Interaction and is described in [the research paper that introduced the method](https://arxiv.org/abs/2605.05242).

Answers link back to supporting passages. Researchers can inspect the cited paragraph, its surrounding context, the source document, and the interviewee. The application can also translate transcripts and human-prepared presentations from Italian to English while preserving the presentation structure and formatting.

## What users are testing now

I designed and built the application end to end. I now maintain and deploy it independently within shared infrastructure that another engineer originally established.

Users estimate that it could reduce the full workflow from about one month to about one week. That is their estimate rather than an independently measured benchmark, and researchers still own the interpretation, revision, and final client deliverable.

The open question is no longer whether the system can produce a report. It is what structure and level of quality will make that first draft genuinely useful. That is the question guiding the current round of user testing.
