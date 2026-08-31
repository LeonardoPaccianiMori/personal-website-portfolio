---
layout: page
title: Teaching Transformers to Write Classical Italian Sonnets
description: A dual-arc study combining a transformer built from scratch with controlled adaptation and evaluation of an existing Italian 7B model
img: assets/img/projects/transformer-poetry/transformer-poetry-thumbnail.webp
importance: 0
category: experimental
github: https://github.com/LeonardoPaccianiMori/portfolio-transformer-poetry
chart:
  plotly: true
project_overview:
  status: Completed
  period: May–August 2026
  role: Conceived and directed by Leonardo with substantial Codex assistance
  outcome: AI-judged DPO produced a narrow sealed automatic surface-screen gain, but both final systems scored 0/100 strict-good outputs in the frozen blind review.
  evidence: GitHub v1.0.0, the Hugging Face model release, and two technical notes; raw data and outputs remain excluded.
project_actions:
  - label: View source
    url: https://github.com/LeonardoPaccianiMori/portfolio-transformer-poetry
    style: primary
    external: true
  - label: View models
    url: https://huggingface.co/LPM93/teaching-transformers-classical-italian-sonnets
    style: secondary
    external: true
  - label: Read the DPO evaluation
    url: /blog/2026/a-narrow-win-that-did-not-make-a-good-poet/
    style: secondary
    external: false
  - label: Read the model-change study
    url: /blog/2026/how-one-7b-italian-language-model-changed-across-staged-adaptation/
    style: secondary
    external: false
---

<div class="row justify-content-sm-center">
  <div class="col-sm-8 mt-3 mt-md-0">
    {% include figure.liquid loading="eager" path="assets/img/projects/transformer-poetry/transformer-poetry-thumbnail.webp" title="Historical manuscript detail" class="img-fluid rounded z-depth-1" %}
  </div>
</div>
<div class="caption">
  Manuscript photograph from <a href="https://pxhere.com/en/photo/795701">PxHere</a>, where it is marked CC0. Cropped and converted to WebP for this page; used as a thematic image, not as a claim about the project's textual sources.
</div>

## The metric improved. The poetry did not.

This project studied language models from two directions. One branch used a roughly 70-million-parameter GPT-style transformer implemented and trained from scratch. The other used controlled adaptation of an existing Minerva 7B model. The final 7B system was adapted rather than built or pretrained from scratch.

The preference-training step produced a small improvement on an automatic screen for visible defects. That improvement survived a held-back test, but it did not produce reliably good poetry. In the final blind review, both systems scored 0 out of 100 on the strict-good criterion.

## How the work was shared

I conceived and directed the project, set its goals, made executive decisions, approved the research plan, reviewed outputs, and sometimes ran GPU work. Codex 5.5 and later Codex 5.6 Sol substantially assisted research design, implementation, tests, execution, and analysis.

This was therefore not an independently designed or independently implemented project. My role was to direct the research, make decisions, review the evidence, and decide what the results could support.

## Two ways to study a transformer

The compact branch made the mechanics tangible: tokenization, batching, causal attention, normalization, checkpointing, and decoding. A parameter-matched experiment with one seed compared ReLU with SwiGLU:

| Arm    | Best validation loss (nats/BPE token) | Repeated 4-gram ratio |
| ------ | ------------------------------------: | --------------------: |
| ReLU   |                                2.6720 |                0.1115 |
| SwiGLU |                                2.5935 |                0.0863 |

SwiGLU performed better on both measures, but the generated samples remained weak. This is one controlled observation rather than a general claim about the two architectures. The decoder also forced fourteen lines, so output length did not show that the model had learned sonnet form.

The larger branch began from a pinned `sapienzanlp/Minerva-7B-instruct-v1.0` model. It passed through three full-weight stages: broad historical and literary Italian, historical poetry outside the sonnet form, and focused sonnet adaptation. A small preference adapter then targeted two visible problems: meta-text and incomplete final syntax.

## Designing a test that could not move

Evaluation rules were fixed before the final results were examined. Validation gates selected checkpoints, while a sealed set of 1,244 held-back openings was reserved for the final comparison.

The preference data came from majority labels produced by three AI judges. Their decisions agreed with my separate 20-pair review only 12 times, which failed the planned calibration gate. For that reason, I describe the method as AI-judged DPO rather than human-aligned or human-calibrated training.

The final automatic test used every sealed opening, two random seeds, and both systems, producing 4,976 outputs. A separate blind review compared 100 outputs from each system and set the boundary for literary claims.

The evidence also keeps runtime and cost separate. Runtimes were measured during completed runs. Monetary costs were estimates based on qualified throughput and pricing assumptions, not measured final bills.

## A narrow automatic win

```plotly
{% include plotly/transformer-poetry/sealed-test-automatic-outcomes.json %}
```

<div class="caption">
  Automatic rates across all sealed openings, seeds, and systems. Fourteen-line output was decoder-controlled, and punctuation is not genuine closure.
</div>

DPO raised the automatic surface-screen rate from 15.07% to 17.60%. The gain was 2.53 percentage points, with a paired 95% interval from 0.52 to 4.50. Terminal punctuation also increased, while the interval for avoiding meta-text crossed zero.

That was the narrow win. The blind review told a less encouraging story. Only the historical-register interval excluded zero; differences in grammar, poetic quality, sonnet form, volta, and visible completion remained uncertain. Both systems produced 0 out of 100 strict-good outputs.

The [DPO evaluation note](/blog/2026/a-narrow-win-that-did-not-make-a-good-poet/) explains why a repeatable automatic improvement did not support a good-poet claim.

## What changed inside the model

The saved model states showed that most measured parameter and representation change happened during the first broad adaptation stage. Later poetry and sonnet stages produced smaller movements. Measures of weight drift, representation similarity, and neighbouring tokens can describe where change occurred, but they cannot explain its cause. The [model-change study](/blog/2026/how-one-7b-italian-language-model-changed-across-staged-adaptation/) presents the full analysis.

## What the experiment can support

- The compact comparison used one seed and sampled validation batches.
- Fourteen lines were enforced by the decoder.
- DPO used correlated AI judges and failed the small human/AI calibration.
- Automatic punctuation and meta-text checks are weaker than literary quality.
- Model-state comparisons are descriptive, not causal.
- Surface memorization checks cannot detect every kind of recall or unknown overlap in a pretrained corpus.
- No tested final system passed the complete quality gate.

The result is therefore useful as an evaluation lesson rather than a poetry success: a statistically supported improvement on a narrow automatic measure can coexist with complete failure on a demanding quality criterion.

## What is public

The [source repository](https://github.com/LeonardoPaccianiMori/portfolio-transformer-poetry) and [GitHub v1.0.0 release](https://github.com/LeonardoPaccianiMori/portfolio-transformer-poetry/releases/tag/v1.0.0) contain the reviewed source, public reports, aggregate evidence, and verification instructions. The [Hugging Face release](https://huggingface.co/LPM93/teaching-transformers-classical-italian-sonnets) contains the selected Stage-1, Stage-2, and Stage-3 models plus the DPO adapter under its documented layered rights scope.

The public artifacts exclude raw openings, poems, generations, preference pairs, votes, annotations, private mappings, intermediate checkpoints, raw analysis tensors, and training material without redistribution permission.

The two technical notes cover the [sealed DPO evaluation](/blog/2026/a-narrow-win-that-did-not-make-a-good-poet/) and the [staged model-change analysis](/blog/2026/how-one-7b-italian-language-model-changed-across-staged-adaptation/).
