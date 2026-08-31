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

## Summary

This project studied language models at two scales: a roughly 70-million-parameter GPT-style transformer implemented and trained from scratch, and controlled adaptation of an existing Minerva 7B model. The final 7B model was not built or pretrained from scratch.

The project is complete. AI-judged DPO produced a narrow sealed gain on an automatic surface screen, but neither final system became a reliably good poet. Both scored 0/100 strict-good outputs in the frozen blind review.

## Ownership and AI contribution

I conceived and directed the project, set its goals, made executive decisions, approved the research plan, reviewed outputs, and sometimes ran GPU work. Codex 5.5 and later Codex 5.6 Sol substantially assisted research design, implementation, tests, execution, and analysis. I do not describe the project as independently designed or independently implemented by me.

## What was tested

The compact branch made tokenization, batching, causal attention, normalization, checkpointing, and decoding concrete. A one-seed, parameter-matched comparison tested ReLU against SwiGLU:

| Arm    | Best validation loss (nats/BPE token) | Repeated 4-gram ratio |
| ------ | ------------------------------------: | --------------------: |
| ReLU   |                                2.6720 |                0.1115 |
| SwiGLU |                                2.5935 |                0.0863 |

SwiGLU performed better on these two measures, but the samples remained weak. The result is a controlled observation, not a general architecture claim. The decoder forced fourteen lines, so output length did not prove learned sonnet form.

The 7B branch started from a pinned `sapienzanlp/Minerva-7B-instruct-v1.0` parent. It used three full-weight stages: broad historical and literary Italian, historical non-sonnet poetry, and focused sonnet adaptation. A rank-8 preference adapter then targeted meta-text and incomplete terminal syntax.

## How it was evaluated

Frozen validation gates selected checkpoints and protected measured preservation domains. The preference data used majority labels from three AI judges. Their labels agreed with my separate 20-pair review on only 12 pairs, so the method is described as AI-judged DPO, not human-aligned or human-calibrated DPO.

The final test used every one of 1,244 sealed openings with two seeds and both systems, for 4,976 outputs. A separate frozen 200-output blind review controlled the literary claims.

Measured runtime and estimated cost remain separate evidence categories. The stage and test runtimes were observed. The reported monetary costs were estimates based on qualified throughput and pricing assumptions, not final measured bills.

## What happened

```plotly
{% include plotly/transformer-poetry/sealed-test-automatic-outcomes.json %}
```

<div class="caption">
  Automatic rates across all sealed openings, seeds, and systems. Fourteen-line output was decoder-controlled, and punctuation is not genuine closure.
</div>

DPO raised the automatic surface-screen rate from 15.07% to 17.60%, a gain of 2.53 percentage points with a paired 95% interval from 0.52 to 4.50. Terminal punctuation also increased. The meta-text-free interval crossed zero.

In the blind literary review, only the historical-register interval excluded zero. Grammar, poetic quality, sonnet form, volta, and visible completion remained uncertain. Both systems produced 0/100 strict-good outputs.

The retained model states also showed that most measured parameter and representation movement occurred during the first broad adaptation, with smaller changes during poetry and sonnet specialization. Weight drift, CKA, and neighbor overlap describe change; they do not identify a causal mechanism. The [model-change study](/blog/2026/how-one-7b-italian-language-model-changed-across-staged-adaptation/) presents that evidence.

The [DPO evaluation note](/blog/2026/a-narrow-win-that-did-not-make-a-good-poet/) explains why a replicated automatic win did not justify a good-poet claim.

## Limitations

- The compact comparison used one seed and sampled validation batches.
- Fourteen lines were enforced by the decoder.
- DPO used correlated AI judges and failed the small human/AI calibration.
- Automatic punctuation and meta-text checks are weaker than literary quality.
- Model-state comparisons are descriptive, not causal.
- Surface memorization checks cannot detect every kind of recall or unknown overlap in a pretrained corpus.
- No tested final system passed the complete quality gate.

## Artifacts and redistribution boundary

The [source repository](https://github.com/LeonardoPaccianiMori/portfolio-transformer-poetry) and [GitHub v1.0.0 release](https://github.com/LeonardoPaccianiMori/portfolio-transformer-poetry/releases/tag/v1.0.0) contain the reviewed source, public reports, aggregate evidence, and verification instructions. The [Hugging Face release](https://huggingface.co/LPM93/teaching-transformers-classical-italian-sonnets) contains the selected Stage-1, Stage-2, and Stage-3 models plus the DPO adapter under its documented layered rights scope.

The public artifacts exclude raw openings, poems, generations, preference pairs, votes, annotations, private mappings, intermediate checkpoints, raw analysis tensors, and training material without redistribution permission.

The two technical notes cover the [sealed DPO evaluation](/blog/2026/a-narrow-win-that-did-not-make-a-good-poet/) and the [staged model-change analysis](/blog/2026/how-one-7b-italian-language-model-changed-across-staged-adaptation/).
