---
layout: page
title: Teaching Transformers to Write Classical Italian Sonnets
description: Building and adapting language models for Italian sonnets, then testing whether better model scores meant better poetry
img: assets/img/projects/transformer-poetry/transformer-poetry-thumbnail.webp
importance: 0
category: experimental
github: https://github.com/LeonardoPaccianiMori/portfolio-transformer-poetry
chart:
  plotly: true
card_role: Research direction; substantial Codex assistance
project_overview:
  status: Completed
  period: May–August 2026
  role: I conceived and directed the project; Codex substantially assisted design and implementation
  outcome: Adapted and evaluated an Italian language model; an automatic check improved, but both final systems scored 0/100 on the strict poetry-quality criterion in an AI-based blind review.
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

<div class="project-lead-image row justify-content-sm-center">
  <div class="col-sm-8 mt-3 mt-md-0">
    {% include figure.liquid loading="eager" path="assets/img/projects/transformer-poetry/transformer-poetry-thumbnail.webp" title="Historical manuscript detail" alt="" class="img-fluid rounded z-depth-1" %}
  </div>
</div>
<div class="caption">
  Manuscript photograph from <a href="https://pxhere.com/en/photo/795701">PxHere</a>, where it is marked CC0. Cropped and converted to WebP for this page; used as a thematic image, not as a claim about the project's textual sources.
</div>

## Can a language model learn to write a sonnet?

I directed this project to explore language-model training and adaptation through classical Italian poetry. It followed two paths: building a compact transformer from scratch, and adapting an existing Italian model through historical prose, poetry, and sonnets.

The final test exposed a gap between the numbers and the poems. An additional training step improved an automatic check for visible defects, but neither final system produced a poem that passed the strict quality criterion in a separate AI-based blind review. That result shaped what the project could claim.

## My role and the AI contribution

I conceived and directed the project, set its goals, approved the research plan, reviewed outputs, made decisions, and sometimes ran GPU work. Codex 5.5 and later Codex 5.6 Sol substantially assisted research design, implementation, tests, execution, and analysis.

My contribution was research direction and review; this was not independently designed or implemented by me.

## Two branches, different questions

The compact model had roughly 70 million parameters and was trained from scratch. It made tokenization, attention, training, checkpointing, and decoding available for inspection. A parameter-matched, one-seed comparison favoured SwiGLU over ReLU on validation loss and repetition, but its generated samples remained weak. The full comparison is retained in the public project reports.

The other branch started from the existing Minerva 7B model, with seven billion parameters. It was adapted rather than pretrained from scratch. This branch asked whether staged adaptation and a small preference update could improve sonnets. Direct Preference Optimization (DPO) trains a model to favour one response over another. Here, three AI judges supplied those preferences. Their majority agreed with my separate 20-pair review only 12 times, failing the planned calibration gate. I therefore call the method AI-judged DPO, not human-aligned training.

## An improvement with a clear limit

```plotly
{% include plotly/transformer-poetry/sealed-test-automatic-outcomes.json %}
```

<div class="caption">
  Automatic rates across all sealed openings, seeds, and systems. Fourteen-line output was decoder-controlled, and punctuation is not genuine closure.
</div>

The automatic surface screen checked for meta-text and terminal punctuation. DPO raised its pass rate from 15.07% to 17.60%. The gain was 2.53 percentage points, with a paired 95% interval from 0.52 to 4.50. Terminal punctuation also increased, while the interval for avoiding meta-text crossed zero.

That was the narrow win. The separate AI-based blind review told a less encouraging story. Only the historical-register interval excluded zero; differences in grammar, poetic quality, sonnet form, volta, and visible completion remained uncertain. Both systems produced 0 out of 100 strict-good outputs.

The [DPO evaluation note](/blog/2026/a-narrow-win-that-did-not-make-a-good-poet/) explains why a repeatable automatic improvement did not support a good-poet claim.

## Looking inside the adapted model

The saved model states showed that most measured parameter and representation change happened during the first broad adaptation stage. Later poetry and sonnet stages produced smaller movements. Measures of weight drift, representation similarity, and neighbouring tokens can describe where change occurred, but they cannot explain its cause. The [model-change study](/blog/2026/how-one-7b-italian-language-model-changed-across-staged-adaptation/) presents the full analysis.

## What the experiment can support

Validation selected the candidate before a one-time sealed comparison used 1,244 held-back openings, two seeds, and both systems. Fourteen lines were enforced by the decoder; punctuation was only a proxy for completion. The separate AI blind review covered 100 outputs per system and was not an independent human literary panel.

The result is useful as an evaluation study: a repeatable gain on an automatic check can coexist with failure on the quality criterion that motivated the work. The small-model comparison used one seed, model-state analysis was descriptive, and surface memorization checks cannot detect all recall or unknown overlap in a pretrained corpus.

## Public code, models, and studies

The [source repository](https://github.com/LeonardoPaccianiMori/portfolio-transformer-poetry) and [GitHub v1.0.0 release](https://github.com/LeonardoPaccianiMori/portfolio-transformer-poetry/releases/tag/v1.0.0) contain the reviewed source, public reports, aggregate evidence, and verification instructions. The [Hugging Face release](https://huggingface.co/LPM93/teaching-transformers-classical-italian-sonnets) contains the selected Stage-1, Stage-2, and Stage-3 models plus the DPO adapter under its documented layered rights scope.

The public artifacts exclude raw openings, poems, generations, preference pairs, votes, annotations, private mappings, intermediate checkpoints, raw analysis tensors, and training material without redistribution permission.
