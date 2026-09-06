---
layout: post
title: "Where a 7B Italian language model changed during staged adaptation"
date: 2026-08-26 12:30:00 +0200
description: Comparing saved language-model states to see where training changed the model, and why the size of a change does not establish its effect.
tags: language-models transformers interpretability model-adaptation evaluation
categories: [technical-notes]
technical_kind: note
chart:
  plotly: true
last_updated: 2026-09-07
project_slug: transformer-poetry
toc:
  beginning: true
reading_minutes: 10
---

The [transformer-poetry project](/projects/transformer-poetry/) retained model states throughout three stages of adaptation. That made it possible to ask where the model changed, rather than comparing only its first and last outputs.

Most measured movement happened during the first, broad adaptation to historical and literary Italian. Later poetry and sonnet stages moved less. To examine that pattern, the study compared prediction errors, model weights, and internal representations of text.

I directed the project and reviewed the evidence; Codex substantially assisted the research design, implementation, and analysis. The study describes one training sequence and a limited set of text probes. It does not identify which changes caused a particular behaviour.

## What was saved during training

The starting point was a fixed version of `sapienzanlp/Minerva-7B-instruct-v1.0`, an existing model with seven billion parameters. This study concerns its adaptation; the separate compact model trained from scratch in the project is not part of this comparison.

Training updated the full model through three stages:

1. historical and literary Italian, spanning the broadest target domain;
2. historical non-sonnet poetry;
3. a focused classical-sonnet stage.

Each stage also replayed modern Italian text from PAISÀ to help retain earlier capabilities. This material supplied 5% of target-token exposure in each stage, rather than 5% of documents or unique examples. Selection rules fixed in advance considered both the target material and the material used to check for regression.

<details markdown="1">
<summary>Training precision and replay</summary>

The full-weight updates used BF16, a 16-bit floating-point format. The modern-preservation replay was deterministic.

</details>

The study saved a midpoint and selected endpoint for every stage. These saved model states are called checkpoints. To compare them, the analysis used 48 fixed text probes spanning historical general text, historical poetry, sonnets, and modern instructions, along with a fixed selection of token vectors. The samples made repeated comparison possible but covered only a small part of the model's behaviour.

## Following the selected checkpoints

All three stages passed their declared adaptation and preservation gates. The historical/general stage selected update 2,065 and ran for a measured 15,495 seconds. The non-sonnet-poetry stage selected update 760 and ran for 7,547 seconds. The sonnet stage selected update 120 of 135 and ran for 3,115 seconds.

<details markdown="1">
<summary>Exact checkpoint comparison</summary>

| Stage              | Selected update | Measured runtime | Selected target loss |
| ------------------ | --------------: | ---------------: | -------------------: |
| Historical/general |           2,065 |         15,495 s |               2.8466 |
| Non-sonnet poetry  |             760 |          7,547 s |               2.8475 |
| Sonnets            |      120 of 135 |          3,115 s |               3.1103 |

</details>

Update 120 was retained in the final stage because update 135 was effectively tied on sonnet loss but worse on instruction loss. This is a small example of why a curriculum needs preservation measures: the lowest or latest target checkpoint is not automatically the best overall state.

<details markdown="1">
<summary>Runtime and estimated cost</summary>

The three-stage cost of about $10.65 was projected from an earlier qualification run and pricing assumptions. It is not a measured final bill. The runtimes above were measured during the completed runs.

</details>

## How prediction improved during training

Loss measures next-token prediction error on validation text; lower values indicate better prediction on that material. The domain losses show the training becoming progressively more specific. Stage 1 reduced loss on all three historical targets between its first validation and selected endpoint: 0.0762 on historical/general material, 0.1702 on historical poetry, and 0.2385 on sonnets. Stage 2 reduced poetry loss by another 0.0780 and sonnet loss by 0.0908. Stage 3 reduced sonnet loss by 0.0179 while its preservation-domain changes remained small.

<details markdown="1">
<summary>Exact checkpoint comparison</summary>

| Domain             | Stage 1 reduction | Stage 2 reduction | Stage 3 reduction |
| ------------------ | ----------------: | ----------------: | ----------------: |
| Historical/general |            0.0762 |                 — |                 — |
| Historical poetry  |            0.1702 |            0.0780 |                 — |
| Sonnets            |            0.2385 |            0.0908 |            0.0179 |

</details>

```plotly
{% include plotly/transformer-poetry/stagewise-target-loss-reduction.json %}
```

<div class="caption">
    Loss reduction within each stage, measured from that stage's first validation to its selected endpoint; larger positive values mean a greater reduction. Blank cells are domains for which that later stage did not define the displayed target comparison. These are stage-local changes, not additive causal effects, and no sampling interval is shown.
</div>

One possible explanation is that broad historical adaptation brought the model closer to the sonnet domain before explicit sonnet training began. This sequence cannot establish that explanation: stages differed in data, duration, and starting state, and there was no intervention isolating their effects.

Loss is still only one view. It measures next-token prediction on frozen validation material, not literary success. The later sealed evaluation showed that a lower sonnet-domain loss did not produce reliably coherent, well-formed sonnets.

## How far the weights moved

The model's weights are the numerical parameters updated during training. Relative L2 distance measures the size of a weight change against the reference weights. The global relative displacement from the untouched parent to the selected Stage-3 model was 0.03302. Sequential deltas reveal where that total accumulated.

<details markdown="1">
<summary>Exact checkpoint comparison</summary>

| Sequential comparison               | Global relative L2 delta |
| ----------------------------------- | -----------------------: |
| Parent → Stage-1 midpoint           |                  0.02994 |
| Stage-1 midpoint → selected         |                  0.00819 |
| Stage-1 selected → Stage-2 midpoint |                  0.00728 |
| Stage-2 midpoint → selected         |                  0.00191 |
| Stage-2 selected → Stage-3 midpoint |                 0.000533 |
| Stage-3 midpoint → selected         |                0.0000971 |

</details>

```plotly
{% include plotly/transformer-poetry/relative-parameter-movement.json %}
```

<div class="caption">
    Sequential global parameter change measured as relative L2 distance; higher values mean more movement from the immediately preceding retained state. The logarithmic axis makes the more-than-two-orders-of-magnitude late-to-early range legible. These are deterministic checkpoint comparisons without uncertainty intervals and do not assign behavioral causality.
</div>

The decline is striking. The parent-to-Stage-1-midpoint delta was more than 300 times the final Stage-3-half delta. The first half of Stage 1 dominated the observed global movement.

I interpret this as evidence of a broad early adjustment followed by narrower specialization. It does not rank the importance of the stages. Small coordinated weight changes can still alter an output, so a late training step can matter even when the overall distance is small.

A single distance also hides where change occurred. Comparing individual layers can give more detail, but assigning an output change to a particular component would require a separate experiment that changes that component while controlling the others.

## Did neighbouring tokens remain neighbours?

An embedding represents a token, a piece of text processed by the model, as a vector of numbers. I compared selected vectors' movement and the overlap between their twenty nearest neighbours. Jaccard overlap is the fraction of shared members in the combined sets. The selected rows moved measurably between the parent and final model. Their mean relative L2 change was 0.05624, while mean top-20-neighbor Jaccard remained 0.9755. The language-model head, the output layer that scores possible next tokens, moved less: relative L2 was 0.01140 and neighbor Jaccard was 0.9876.

During the late half of Stage 3, those changes were much smaller. The corresponding embedding and LM-head relative movements were 0.0000883 and 0.0000203, and the inspected neighbor sets had Jaccard 1.0.

This combination is more informative than either measurement alone. Vector positions changed, but the local neighborhoods around the inspected tokens were largely preserved. That is consistent with adjustment inside a stable local organization rather than wholesale reordering.

The registry contains selected token rows rather than the whole vocabulary. Top-20 overlap ignores changes outside the chosen neighbourhood and does not show how the downstream network uses those vectors. Jaccard overlap also discards rank and distance, so identical members can still have changed geometry.

## Comparing internal similarity with output changes

The 48 fixed text probes allowed comparison of internal representations as well as outputs. Centred kernel alignment (CKA) measures similarity between patterns in the internal representations; top-20 next-token overlap compares the tokens ranked most likely at the output. These measures answer different questions. From parent to final, mean hidden-state drift was 0.2394. Standard-sonnet probes drifted most, at 0.3177, while modern-instruction probes drifted least, at 0.1599. Minimum linear CKA remained 0.9219, mean top-20 next-token overlap fell to 0.4994, and mean logit entropy decreased by 0.2102.

For the late half of Stage 3, mean drift was only 0.00371, minimum CKA was 0.999997, and top-20 next-token overlap was 0.9668.

<details markdown="1">
<summary>Exact checkpoint comparison</summary>

| Comparison     | Mean hidden drift | Minimum linear CKA | Top-20 next-token overlap |
| -------------- | ----------------: | -----------------: | ------------------------: |
| Parent → final |            0.2394 |             0.9219 |                    0.4994 |
| Late Stage 3   |           0.00371 |           0.999997 |                    0.9668 |

</details>

```plotly
{% include plotly/transformer-poetry/representation-change-comparison.json %}
```

<div class="caption">
    Frozen-probe comparisons for parent-to-final change and the late half of Stage 3. Higher drift means more change; higher CKA and top-20 overlap mean greater similarity. Each metric has its own native-scale panel. The 48 probes are bounded, the values have no inferential interval, and the comparison is descriptive rather than causal.
</div>

On these probes, the parent-to-final model changed while retaining high broad representation similarity. That does not establish preserved capability. CKA stayed high while the top of the next-token distribution changed much more. That can happen because CKA summarizes shared structure across many dimensions, whereas top-token overlap is sensitive to smaller shifts near the output ranking boundary.

The late-stage values are close to identity. They indicate little change under these measurements, while still allowing for an affected context outside the probes or a localized behaviour hidden by the average.

## What keeping the checkpoints added

The saved states show the large early movement and the smaller later changes. Predictive loss, weight distance, and representation similarity each expose a different part of that sequence. None replaces evaluation of the generated text: the final poetry review remained poor despite improved target losses.

Keeping only the last checkpoint would have hidden the differences between stages. Keeping only training loss would have hidden the gap between prediction and literary quality.

## Which questions still need an experiment?

The comparisons locate change but do not identify the cause of an output improvement or failure. Testing such an explanation would require an intervention, such as restoring selected weights or disabling a component while holding the rest fixed.

Internal similarity also cannot establish that a capability was preserved. A model can retain similar representations while its outputs become worse. Tests of the generated text remain necessary.

This was one model, one training sequence, and a limited set of probes. The saved checkpoints made its development visible, but the early-dominant pattern should not be treated as a general rule for language-model adaptation.

## Reproducibility and AI contribution

At publication, the public source repository includes the pinned state registry, analyzers for weights, embeddings, representations, and losses, frozen configurations, aggregate reports, tests, and a deterministic website-evidence exporter. Public Python 3.12 verification checks those software and evidence contracts. A separate [Hugging Face release](https://huggingface.co/LPM93/teaching-transformers-classical-italian-sonnets) provides the three selected stage models and DPO adapter. It does not reproduce the historical H100 run, supply every intermediate snapshot, or include the raw probe tensors needed to repeat the complete model-state analysis.

The checkpoint and data boundary is intentional. The selected full BF16 stage weights are available through that model release, but intermediate states, raw probe tensors, raw generations, poems and openings used in evaluation, private mappings, and annotations are not embedded in this note or its charts and remain unpublished.

I conceived and directed the project, chose its learning and research goals, made executive decisions, approved the plan, reviewed outputs, and sometimes ran GPU work. Codex 5.5 and later Codex 5.6 Sol helped design the research plan and substantially assisted implementation, tests, execution, and analysis. I do not describe the study as independently designed or independently implemented by me.

The broader project and its final failure boundary are summarized in [Teaching Transformers to Write Classical Italian Sonnets]({% link _projects/transformer-poetry.md %}).
