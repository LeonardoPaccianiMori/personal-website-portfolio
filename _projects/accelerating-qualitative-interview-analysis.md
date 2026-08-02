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

**June – July 2026**

## Summary
I built and iterated on an internal AI agent that helps Consumer Insight teams analyse qualitative interview projects. It turns a large corpus of Italian interview transcripts, interview guides, participant worksheets, and project context into a first thematic synthesis, traceable answers to bespoke questions, and translated client materials.

The tool is actively used internally. It reduces an analysis process that previously took roughly a month to around a week, while keeping the researcher in control of the final interpretation and presentation.

---

## Problem
Qualitative research projects often involve a dozen or more hour-long interviews. Once transcribed, they can produce hundreds of pages of material, alongside an interview guide and participant evaluation materials.

Researchers traditionally have to read the full corpus, retain connections across interviews, build a thematic document organised around the interview guide, and refine that work into a client presentation. The first thematic synthesis is especially demanding: it can be 40–50 pages long and requires bringing together evidence that is scattered across many conversations.

---

## My role
I built the first working prototype end to end, then worked closely with Consumer Insight colleagues to refine its features, workflow, and behaviour until it met their needs. The result is an internal tool that is ready for day-to-day use, while continuing to be refined through real projects.

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
The tool changes the bottleneck in qualitative analysis. Instead of spending roughly a month manually consolidating a large document corpus, researchers can produce a strong first synthesis in substantially less time and devote more attention to interpretation, validation, and the client narrative.

It is designed as decision support, not an automatic replacement for qualitative judgement: human researchers review and refine the synthesis before it becomes a client deliverable.
