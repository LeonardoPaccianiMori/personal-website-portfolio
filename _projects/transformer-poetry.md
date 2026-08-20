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
---

<div class="row justify-content-sm-center">
    <div class="col-sm-8 mt-3 mt-md-0">
        {% include figure.liquid loading="eager" path="assets/img/projects/transformer-poetry/transformer-poetry-thumbnail.webp" title="Historical manuscript detail" class="img-fluid rounded z-depth-1" %}
    </div>
</div>
<div class="caption">
    Manuscript photograph from <a href="https://pxhere.com/en/photo/795701">PxHere</a>, where it is marked CC0. Cropped and converted to WebP for this page; used as a thematic image, not as a claim about the project's textual sources.
</div>

**May–August 2026**

## Summary

This was an Experimental project, but a conceptually foundational one for me. I wanted to understand language models at two very different scales: first by implementing the mechanisms of a compact transformer directly, and then by treating an existing 7B Italian model as a research object whose training, adaptation, and evaluation could be controlled carefully.

Those became two distinct arcs. In the first, under my direction, the project implemented and trained a roughly 70-million-parameter GPT-style causal transformer from scratch in PyTorch. In the second, the project started from an existing Minerva 7B parent, adapted all of its weights through three curriculum stages, and then trained a small preference adapter. Codex substantially assisted implementation across both arcs. The final 7B model was not built or pretrained from scratch.

The project is complete, and the most important result is a negative one: neither final system became a reliably good poet. The DPO adapter produced narrow, reproducible improvements in surface cleanliness and terminal punctuation, but both it and the Stage-3 model produced 0/100 strict-good outputs in the sealed blind literary review. I see the project as evidence of model engineering, controlled evaluation, and learning from failure—not as a solved-sonnet claim.

## Why work at both scales?

Building the compact model made the abstractions concrete. Under my direction, the project implemented tokenization, batching, causal masking, multi-head attention, residual blocks, normalization, checkpointing, and autoregressive decoding rather than treating them as opaque library calls. This gave me a small enough system to change architectural choices and watch their consequences.

The 7B branch asked a different question. Once a pretrained model already contains broad linguistic capability, what changes during staged specialization, and how strong must the evaluation be before a behavioral improvement deserves a public claim? That branch moved beyond implementation into curriculum design, frozen protocols, model-state comparison, preference optimization, and a one-time sealed test.

## Controlled architectural learning

One compact-model experiment compared parameter-matched ReLU and SwiGLU feed-forward blocks while holding the tokenizer, data, optimizer initialization, seed, and schedule fixed. SwiGLU reached a lower best validation loss and a lower repeated 4-gram ratio, but the qualitative samples remained weak. The result is therefore descriptive evidence from one seed, not a general architecture claim.

| Arm    | Best validation loss (nats/BPE token) | Repeated 4-gram ratio |
| ------ | ------------------------------------: | --------------------: |
| ReLU   |                                2.6720 |                0.1115 |
| SwiGLU |                                2.5935 |                0.0863 |

```plotly
{% include plotly/transformer-poetry/controlled-architecture-tradeoffs.json %}
```

<div class="caption">
    Best sampled validation loss (lower is better) and mean repeated 4-gram ratio (lower indicates less local repetition) for the two controlled arms. Each evaluation used five sampled validation batches in one seeded experiment; the panels use different units, and no uncertainty interval or multi-seed replication is available.
</div>

The decoder forced fourteen output lines in both arms. That control verifies generation length, not learned metre, rhyme, stanza structure, or literary quality.

## Corpus and redistribution boundaries

The data work combined classical sonnets, broader historical and literary Italian, non-sonnet poetry, and modern-preservation material. Sources were tracked through manifests with revisions, attribution records, inclusion decisions, and cleaning notes. The completed Minerva curriculum also replayed PAISÀ material deterministically: it supplied 5% of target-token exposure in every stage. That number does not mean 5% of unique documents, examples, or corpus size.

The public boundary is deliberately narrower than the research workspace. The GitHub release includes aggregate evidence, source metadata, and processed material only where the file-by-file current-tree and history manifests affirmatively approve publication. Raw evaluation openings, poems, generations, preference pairs, votes, annotations, mappings, tensors, checkpoints, and adapters are excluded. Model weights remain local pending a separate artifact-specific owner review and release decision.

## Three-stage full-weight adaptation

The second arc began from the existing `sapienzanlp/Minerva-7B-instruct-v1.0` parent at a pinned source revision. It used three full-weight BF16 stages on one H100 80 GB:

1. broad historical and literary Italian;
2. historical non-sonnet poetry;
3. focused sonnet specialization.

| Stage              | Target tokens | Training windows | Selected update | Measured runtime |
| ------------------ | ------------: | ---------------: | --------------: | ---------------: |
| Historical/general |    67,665,920 |           33,040 |           2,065 |         15,495 s |
| Non-sonnet poetry  |    24,903,680 |           12,160 |             760 |          7,547 s |
| Sonnets            |     4,423,680 |            2,160 |             120 |          3,115 s |

```plotly
{% include plotly/transformer-poetry/curriculum-stage-exposure.json %}
```

<div class="caption">
    Target-token exposure (bars), available windows, and validation-selected optimizer updates across the three stages. Exposure narrows from broad historical Italian to sonnets. PAISÀ replay supplied 5% of target tokens in every stage; the chart does not represent unique-document or corpus-size shares, and the axes use different units.
</div>

The three selected runtimes are measured. The often-quoted total of about $10.65 is instead a qualification-based projection, not the final measured bill. Keeping those categories separate matters: a precise-looking estimate should not be rewritten as an observed cost.

## What changed inside the model

The retained parent, midpoint, and selected stage states made it possible to compare parameter movement, embedding neighborhoods, frozen-probe representations, and domain losses. Most measured weight and representation change occurred during the broad first stage. The poetry and sonnet stages were progressively narrower, although a small late parameter movement can still matter behaviorally.

I discuss that evidence in [How one 7B Italian language model changed across staged adaptation]({% post_url 2026-08-15-how-one-7b-italian-language-model-changed-across-staged-adaptation %}). The central boundary is that weight drift, CKA, and neighbor overlap describe change; they do not identify a causal layer or mechanism.

## DPO and the sealed test

The final preference branch targeted two bounded failures: meta-text around a poem and incomplete terminal syntax. It used AI-majority labels, not human preference labels. Three AI judges supplied the training decisions, and their majority agreed with my separate 20-pair review on only 12 pairs. Because that calibration failed, I describe the method as AI-judged DPO—not human-aligned or human-calibrated DPO.

The selected rank-8 adapter trained for 61 optimizer updates. Its all-in runtime was 148.6 seconds and peak memory was 14.81 GiB; its approximately $0.093 cost is estimated. Validation justified taking the frozen comparison to a one-time sealed test, not claiming that the model had learned good poetry.

The test evaluated every one of 1,244 sealed openings with two seeds and both systems, for 4,976 outputs. The run took a measured 2,970.6 seconds; the approximately $1.967 cost is estimated.

| Sealed automatic outcome | Stage 3 |    DPO |
| ------------------------ | ------: | -----: |
| Fourteen lines           |  99.96% | 99.92% |
| Meta-text free           |  86.33% | 87.78% |
| Terminal punctuation     |  17.60% | 20.46% |
| Automatic surface screen |  15.07% | 17.60% |

```plotly
{% include plotly/transformer-poetry/sealed-test-automatic-outcomes.json %}
```

<div class="caption">
    Automatic rates across all 1,244 sealed openings, two seeds, and both systems. Higher is better for the displayed surface checks, but fourteen-line output is decoder-controlled and punctuation is not genuine closure. Paired uncertainty is analyzed in the DPO note; these grouped rates alone do not establish literary improvement.
</div>

DPO raised the surface screen by 2.53 percentage points, with a paired 95% interval from 0.52 to 4.50, and raised terminal punctuation by 2.85 points. The meta-text-free interval crossed zero. In the frozen 200-output blind literary review, only the historical-register interval excluded zero; grammar, poetic quality, sonnet/form, volta, and visible completion remained uncertain. Both systems produced 0/100 strict-good outputs.

The full evaluation design and its limits are in [A narrow win that did not make a good poet]({% post_url 2026-08-15-a-narrow-win-that-did-not-make-a-good-poet %}).

## Failures and limitations

- Fourteen lines were enforced by the decoder, not learned as a complete sonnet form.
- The compact architecture comparison used one seed and five sampled validation batches per evaluation.
- The DPO labels came from correlated AI judges and failed the small human/AI calibration check.
- Automatic punctuation and meta-text measures are weaker than syntax, argument, metre, rhyme, or literary quality.
- Drift, CKA, embedding neighborhoods, and parameter deltas are descriptive rather than causal.
- Surface memorization checks cannot detect every type of recall or unknown overlap in a pretrained parent's corpus.
- No tested final system passed the complete quality gate.

## Ownership and AI contribution

I conceived and directed the project, set its learning and research goals, made the executive decisions, approved the research plan, reviewed outputs, and sometimes ran the GPU work. Codex 5.5 and later Codex 5.6 Sol helped design the research plan and substantially assisted implementation, tests, execution, and analysis. I therefore do not describe this project as independently designed or independently implemented by me.

My contribution was to decide what the project should test, accept or reject proposed methods, keep the protocols and public claims bounded, inspect the resulting evidence, and take responsibility for what is published. The substantial AI contribution is part of the project record rather than a footnote hidden behind a general statement about tooling.

## Technical stack and artifacts

The implementation uses Python, PyTorch, Hugging Face Transformers, PEFT, NumPy, pandas, pytest, Plotly, and shell-based experiment orchestration. Public CPU verification targets Python 3.12; the historical V7 runs used PyTorch 2.12.0 with CUDA 12.6 and NCCL 2.29.3 on one H100 80 GB.

The reviewed [source repository](https://github.com/LeonardoPaccianiMori/portfolio-transformer-poetry) and [v1.0.0 release](https://github.com/LeonardoPaccianiMori/portfolio-transformer-poetry/releases/tag/v1.0.0) contain the public reports, aggregate evidence, and verification instructions. The release passed the repository's rights, privacy, security, and history gates and has no manually uploaded assets or model weights. The Stage-3 checkpoint and DPO adapter remain local pending separate artifact-specific owner review and release decisions, so there are no provisional Hugging Face links.
