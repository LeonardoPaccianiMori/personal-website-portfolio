---
layout: page
title: Accelerating qualitative interview analysis
description: An internal AI agent that turns extensive Italian interview materials into thematic syntheses, traceable answers, and translated client deliverables
img: assets/img/projects/professional/qualitative-interview-analysis.png
importance: 1
category: professional
---

<div class="row">
    <div class="col-sm mt-3 mt-md-0">
        {% include figure.liquid loading="eager" path="assets/img/projects/professional/qualitative-interview-analysis.png" title="Accelerating Qualitative Interview Analysis" class="img-fluid rounded z-depth-1" %}
    </div>
</div>
<div class="caption">
    Image generated with <a href="https://developers.openai.com/api/docs/models/gpt-image-2">GPT Image 2</a>
</div>

**May 2026 – present**

## Summary

I designed and built an internal AI application that helps Consumer Insight teams analyse qualitative interview projects. It turns a large corpus of Italian interview transcripts, interview guides, participant worksheets, and project context into a first thematic report, traceable answers to bespoke questions, and translated client materials.

The application is deployed and currently in user testing. Researchers estimate that it could reduce the complete qualitative-analysis workflow from roughly a month to around a week, while keeping them responsible for the final interpretation and presentation.

---

## Problem

Qualitative research projects often involve a dozen or more hour-long interviews. Once transcribed, they can produce hundreds of pages of material, alongside an interview guide and participant evaluation materials.

Researchers traditionally have to read the full corpus, retain connections across interviews, build a thematic document organised around the interview guide, and refine that work into a client presentation. The first thematic synthesis is especially demanding: it can be 40–50 pages long and requires bringing together evidence that is scattered across many conversations.

---

## My role

I built the application end to end, then worked closely with Consumer Insight colleagues to refine its features, workflow, and behaviour. I maintain and deploy the application independently within shared infrastructure that was originally established by another engineer.

The application is usable but not finished. Users test it and report back to me, and we are still defining the right scope and quality threshold—particularly for the structure and content of the generated report.

---

## Finding the actual deliverable

The first version was a chatbot. It worked technically, but researchers told me that a conversational interface was not their real need. Their work ultimately had to become a long, structured report organized around the interview guide.

That changed the centre of the product. I shifted the application toward generating a first-draft thematic report that resembles the researchers' actual deliverable, then kept question answering, translation, and session recovery around that core workflow.

---

## What the tool does

- Accepts a project-context brief, interview transcripts, the interview guide, and participant worksheets.
- Starts each session by mapping the corpus: it identifies the role of each document and the interviewee associated with each transcript without reading every file in full.
- Generates a first-draft thematic synthesis structured around the interview guide, so researchers can begin from a coherent working document instead of a blank page.
- Answers open-ended questions about any part of the corpus in both detailed and concise formats.
- Translates Italian interview transcripts and human-prepared PowerPoint presentations into English while preserving slide structure and formatting.

---

## Evidence-grounded question answering

Every answer to a corpus question includes explicit citations to the supporting source passages. Researchers can open a citation to inspect the cited paragraph, its surrounding context, and the corresponding document and interviewee.

This makes the tool useful for exploration without asking users to treat its synthesis as a black box: they can quickly verify where a claim came from, compare evidence across participants, and retain responsibility for the final client-facing interpretation.

---

## Direct corpus interaction

For question answering, I used **Direct Corpus Interaction (DCI)**, a recent agentic-search approach. Rather than relying on a pre-built retrieval index, the agent plans a search over the raw project corpus, inspects relevant material directly, and progressively narrows from candidate documents to the precise evidence needed for an answer.

This is especially well suited to interview research, where useful evidence can depend on exact wording, local context, and connections formed across different participants and materials. [Read the DCI research paper](https://arxiv.org/abs/2605.05242).

---

## Impact

Users estimate that the application could reduce the complete qualitative-analysis workflow from roughly one month to around one week. This is their estimate, not an independently measured result, and the application remains in testing.

The main open question is no longer whether the system can generate a report. It is what report structure and quality make that output genuinely useful to researchers. Their feedback continues to shape those decisions.

It is designed as decision support, not an automatic replacement for qualitative judgement: human researchers review and refine the synthesis before it becomes a client deliverable.
