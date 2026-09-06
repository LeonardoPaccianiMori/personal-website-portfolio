---
layout: page
title: Accelerating qualitative interview analysis
description: Turning long interview studies into an inspectable first report, with a user-estimated month-to-week workflow reduction
img: assets/img/projects/professional/qualitative-interview-analysis.png
importance: 1
category: professional
card_role: Primary developer
project_overview:
  status: Active · Deployed · User testing
  period: May 2026–present
  role: Primary developer; maintains and deploys the application
  outcome: Users estimate that it could reduce the complete workflow from about one month to about one week.
  evidence: Internal system; code, project materials, and user examples are private.
---

<div class="project-lead-image row">
  <div class="col-sm mt-3 mt-md-0">
    {% include figure.liquid loading="eager" path="assets/img/projects/professional/qualitative-interview-analysis.png" title="Accelerating Qualitative Interview Analysis" alt="" class="img-fluid rounded z-depth-1" %}
  </div>
</div>
<div class="caption">
  Image generated with <a href="https://developers.openai.com/api/docs/models/gpt-image-2">GPT Image 2</a>
</div>

## The report was the real product

The first version of this application was a chatbot for exploring qualitative interview material. It worked, but conversations with researchers exposed a more important need: their work ends in a long, structured report, not a chat session.

I therefore rebuilt the experience around a first thematic report organized by the interview guide. Question answering, translation, and session recovery still matter, but they now support the document that researchers must ultimately produce.

I designed and built the application end to end. It is deployed and works across Italian transcripts, interview guides, participant worksheets, and project context. I now maintain and deploy it independently within shared infrastructure that another engineer originally established.

## Letting researchers inspect the evidence

Researchers need to check the claims in a draft against the original material. The application first maps the project material: what each document is, who each interviewee is, and how the interview guide structures the research.

When a researcher asks a specific question, the agent searches the original documents, narrows the relevant material, and reads the candidate passages directly. This approach is known as Direct Corpus Interaction and is described in [the research paper that introduced the method](https://arxiv.org/abs/2605.05242).

Answers link back to supporting passages. Researchers can inspect the cited paragraph, its surrounding context, the source document, and the interviewee. The application can also translate transcripts and human-prepared presentations from Italian to English while preserving the presentation structure and formatting.

## What users are testing now

I continue to refine the application with Consumer Insight colleagues. Users estimate that it could reduce the full workflow from about one month to about one week. That is their estimate rather than an independently measured benchmark, and researchers still own the interpretation, revision, and final client deliverable.

Current testing focuses on the report itself: which structure helps researchers work, where the draft needs revision, and what quality they need before using it for a client deliverable.
