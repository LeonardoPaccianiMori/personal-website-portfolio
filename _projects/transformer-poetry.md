---
layout: page
title: Teaching transformers to write classical Italian sonnets
description: A plan-then-poem pipeline that holds the strict Italian sonnet form without repair, and an honest account of the coherence limit that remains
img: assets/img/projects/transformer-poetry/transformer-poetry-thumbnail.webp
importance: 0
category: experimental
github: https://github.com/LeonardoPaccianiMori/portfolio-transformer-poetry
chart:
  plotly: true
card_role: Research direction; substantial AI assistance
project_overview:
  status: Completed
  period: May–September 2026
  role: I conceived and directed the project; AI assistants assisted design, implementation, and execution under my direction
  outcome: Specialised a small open-weight model to write sonnets in strict form; 69% of its outputs hold the rhyme scheme without repair.
  evidence: Public GitHub source, reports, and verification; the Hugging Face release with nine artifacts; the prosody checker and poem explorer
  demonstrates: "Open-weight LLM specialisation: LoRA and preference tuning of a 7B model for a strict structured task, with a purpose-built checker and pre-registered evaluation."
project_actions:
  - label: View source
    url: https://github.com/LeonardoPaccianiMori/portfolio-transformer-poetry
    style: primary
    external: true
  - label: View models
    url: https://huggingface.co/LPM93/teaching-transformers-classical-italian-sonnets
    style: secondary
    external: true
  - label: Read the decomposition note
    url: /writing/2026/two-skills-not-one-how-decomposition-fixed-the-sonnet-form/
    style: secondary
    external: false
  - label: Read the distillation note
    url: /writing/2026/distilling-a-stronger-poet-into-a-7b-model/
    style: secondary
    external: false
---

<div class="project-lead-image row justify-content-sm-center">
  <div class="col-sm-8 mt-3 mt-md-0">
    {% include figure.liquid loading="eager" path="assets/img/projects/transformer-poetry/transformer-poetry-thumbnail.webp" title="Historical manuscript detail" alt="" class="img-fluid rounded z-depth-1" %}
  </div>
</div>
<div class="caption">
  Manuscript photograph from <a href="https://pxhere.com/en/photo/795701">PxHere</a>, where it is marked CC0. Cropped and converted to WebP for this page; used as a thematic image, not as a claim about the project's textual sources.
</div>

## The task

A sonnet has rules: fourteen lines, a fixed rhyme scheme, and — in Italian — hendecasyllable metre. I wanted to know whether a compact open-weight language model could be taught them.

The project has two arcs. The first is a roughly 70-million-parameter transformer written from scratch in PyTorch, used to learn and test the components of a modern language model. The second adapts an existing Italian 7B model through a staged literary curriculum, and then reworks the task itself when the first measurement shows no form at all.

## The gap

The staged-adaptation system produced verse that looked right and held no form. When 4,976 sealed outputs were scored with a purpose-built prosody checker, **not one** held a valid rhyme scheme, metre, and fourteen-line structure at the same time.

That number, not a feeling, is where the method starts. It is also the kind of number most generative-AI demos avoid.

## Measure first

Before changing the model, I built the instrument: a deterministic checker for metre, rhyme, rhyme scheme, and stanza structure, validated against public-domain sonnets (100% metre accuracy on definite ground-truth lines, 87% coverage) with the conservative flags reviewed by hand. Alongside it sits a rhyme lexicon of 1,220 keys extracted from 228,164 line endings of the training corpus.

Where form alone cannot judge, a calibrated AI judge panel scores grammar, continuity, and imagery. The panel is validated by separating clean sonnets from corrupted ones; on the corpus calibration its separation is about 1.2–1.9 points on a 1–5 scale. It is evidence, not literary truth, and the checker never claims to measure quality.

## Try the explorer

The pool below is pre-generated, not live: the widget samples from saved outputs, so the page stays static and free to host. It writes to the screen the way a chat model streams an answer, but every character comes from a saved poem.

<div markdown="0">
<div id="sonnet-generator" class="my-4 p-3 border rounded">
  <noscript>Enable JavaScript to try the poem explorer.</noscript>
</div>
<script src="{{ '/assets/js/sonnet-explorer.js' | relative_url }}"></script>
<style>
  .sonnet-poem { line-height: 1.5; min-height: 21em; }
  .sonnet-line { white-space: pre-wrap; }
  .sonnet-caret { display: inline-block; margin-left: 0.1em; color: var(--global-theme-color); animation: sonnet-caret-blink 1s steps(2, start) infinite; }
  .sonnet-meta { display: flex; flex-wrap: wrap; gap: 0.4rem; }
  .sonnet-chip { display: inline-flex; align-items: baseline; gap: 0.3rem; padding: 0.22rem 0.7rem; border: 1px solid var(--global-divider-color); border-radius: 999px; background: var(--global-card-bg-color); font-size: 0.8rem; }
  .sonnet-chip__label { color: var(--global-text-color-light); }
  .sonnet-chip__value { color: var(--global-text-color); font-weight: 600; }
  .sonnet-chip__value--bad { color: var(--bs-danger, #dc3545); }
  @keyframes sonnet-caret-blink { 50% { opacity: 0; } }
  @media (prefers-reduced-motion: reduce) { .sonnet-caret { animation: none; } }
</style>
</div>

<div class="caption">
  Poems are generated by the project's final model, saved in advance, and shown at random. Only deterministic checker measurements are displayed for each poem. No text leaves your browser.
</div>

## What did not work

Several approaches failed before the method worked, and they are part of the result:

- **More full-weight training on the corpus** did not move form.
- **AI-judged preference training** (DPO) produced a small, real gain on an automatic surface screen, but no fully valid sonnet and no reliable literary gain. The blind review scored 0/100 strict-good outputs for both systems. The [DPO note](/writing/2026/a-narrow-win-that-did-not-make-a-good-poet/) tells that story.
- **Asking the model to commit to rhymes in the prompt** failed: adherence was 3.4% with the plan list, and the list degraded metre by about 1.15 accepted lines.
- **Training the model to follow a plan** made it copy whichever list was in context — including a mismatched one — rather than choose rhymes.
- **Letting the model imitate its own valid poems** taught it stanza structure but not rhyme: 57% of its quatrains had eight different ending sounds.
- **Giving the model examples in context** changed nothing measurable, so prompt context was closed as a coherence fix.

## The method: plan, then write

The task only looks like one skill. It is two: _choosing_ a rhyme plan, and _writing_ to it. The 7B model could not do both at once — but it could do each separately.

1. A **plan generator** writes a rhyme plan: a fourteen-letter scheme plus one ending word for each of lines 2–14. Trained on corpus traces and lexicon-augmented plans, it reaches **0.921** valid plans (221/240), against 0/240 for the unadapted baseline.
2. A **poem writer** receives that plan and writes the sonnet to it, with no repair step.

Fine-tuning the writer on the project's own valid outputs mattered: it learns the distribution of model-written plans, not only corpus plans. Poem validity given a valid plan rose from 0.518 to 0.793, and composed validity on the frozen plan grid reached 0.6250.

Sampling temperature was the most practical finding of the work. At 0.85 the plan model was extremely seed-sensitive: on the same 120 openings, two seeds produced plans valid only 26% and 35% of the time, while other seeds sat above 90%. At 0.4 the two unlucky seeds recovered to 92.1%, and good seeds reached 92.9%. Plan generation is a short, structured output; sampling noise buys nothing and costs a lot. The frozen plan recipe uses 0.4.

A single model that writes plan and poem in one pass was also built, as a compact alternative. It reaches **0.5719** composed validity, and the two-model pipeline remains stronger.

## The result

| System                               | Composed scheme validity, no repair | Accepted lines | Failed lines |
| ------------------------------------ | ----------------------------------: | -------------: | -----------: |
| Initial staged-adaptation system     |                           0 / 4,976 |              — |            — |
| Plan generator + tuned writer        |                              0.6250 |           7.33 |         1.15 |
| Plan generator + distilled writer    |                          **0.6917** |           7.29 |         0.95 |
| Single model, plan and poem together |                              0.5719 |           7.70 |         1.48 |

Two checks keep the numbers honest. The memorization screens run on the pipeline outputs compare each poem against the 16,298 training sonnets at the line and five-word-shingle level: no copied lines and a mean five-gram overlap below 0.007. And the checker never gets to grade itself: the same outputs are scored by calibrated AI judges.

## Distillation and the coherence limit

Form is measured and largely solved. Coherence is not, so the last experiment asked whether a stronger model could transfer it.

I generated about 4,300 sonnets with the DeepSeek `deepseek-chat` API, kept only those that passed the project's checker, and fine-tuned the poem writer on them. The provider's terms explicitly permit using outputs to train other models, including distillation, and the repository records the provider, model, date, volumes, filtering, and licence clause. Form improved to **0.6917** composed validity, the best result in the project.

Coherence did not follow. The judges moved from 2.875/2.750 to 3.075/2.825 and then back to 2.917/2.725 — a gain of +0.145 at best against a pre-registered +0.3 gate — while the teacher sonnets themselves score 4.12 and 4.47. Form transfers; coherence does not. The line stopped there rather than keep tuning, and that null result is written up in [Distilling a stronger poet into a 7B model](/writing/2026/distilling-a-stronger-poet-into-a-7b-model/).

## What this project demonstrates

The value here is not the poem. It is the loop around it: build the measurement, find the failure mode, decompose the task, adapt a small open model with LoRA, synthesise data under a verified licence, and report the limit instead of hiding it.

Concretely, the work covers:

- **open-weight LLM specialisation** — PEFT LoRA adaptation of a 7B Italian model for a narrow task, trained and evaluated end to end on rented single GPUs;
- **evaluation engineering** — a validated prosody checker, a rhyme lexicon, calibrated AI judge panels, memorization screening, and pre-registered gates for every experiment;
- **data work under licence review** — corpus traces, lexicon-generated plans, self-play data, and licence-cleared synthetic teacher data with recorded provenance;
- **honest limits** — the difference between form (measured, solved) and coherence (measured, not solved at this scale).

## What it still does not do

The models are research artifacts. The checker says nothing about grammar, meaning, or whether a poem is any good; the AI judges that do comment on those things put the output at roughly 2.7–2.9 of 5, and they are machines too. The plan-then-poem pipeline cannot yet produce a _good_ poem reliably; it can produce a _well-formed_ one about two times in three, without repair, which is the specific gap this project set out to close.

## Public code, models, and studies

The [source repository](https://github.com/LeonardoPaccianiMori/portfolio-transformer-poetry) contains the checker, lexicon, trainers, plans, reports, and verification instructions. The [Hugging Face release](https://huggingface.co/LPM93/teaching-transformers-classical-italian-sonnets) contains nine artifacts: the three staged full models and the DPO adapter, plus the plan-following adapter, the plan generator, the tuned poem writer, the distilled poem writer (with its licence disclosure), and the single model that writes plan and poem in one pass.

Related studies in the same project: the [DPO evaluation note](/writing/2026/a-narrow-win-that-did-not-make-a-good-poet/) and the [model-change study](/writing/2026/how-one-7b-italian-language-model-changed-across-staged-adaptation/).

I conceived and directed the project, set the goals and gates, reviewed the outputs, and made every publication decision. AI assistants (Codex 5.5/5.6 Sol and opencode with DeepSeek and other models) assisted design, implementation, execution, and analysis under my direction.
