---
layout: post
title: "Where a 7B Italian language model changed during staged adaptation"
date: 2026-08-26 12:30:00 +0200
description: A descriptive study of weight, loss, embedding, and representation change across three full-weight adaptation stages.
tags: language-models transformers interpretability model-adaptation evaluation
categories: [technical-notes]
technical_kind: note
last_updated: 2026-08-31
chart:
  plotly: true
---

When a language model produces different text after fine-tuning, it is tempting to evaluate only the outputs. That is ultimately where usefulness or failure becomes visible. But output comparison alone leaves a second question unanswered: how did the model itself change on the way there?

This project gave me an unusually concrete opportunity to study that question. I retained the parent, midpoint, and validation-selected model states from a three-stage, full-weight adaptation of an existing Italian 7B model. I could therefore compare losses, parameters, selected token vectors, hidden representations, and output distributions along a sequence rather than looking only at the parent and final checkpoint.

The main pattern was consistent across those measurements. Most observed movement occurred during the broad first adaptation to historical and literary Italian. The poetry stage moved less, and the final sonnet stage less again. That is compatible with a curriculum that performs its largest domain shift early and then makes increasingly narrow refinements.

It is important to keep the claim descriptive. Parameter drift does not tell us which changed weights caused a behavior. Representation similarity does not prove that a capability was preserved. A small late-stage delta does not imply that the stage was behaviorally irrelevant. The retained states let me locate and compare change; they do not turn an observational study into a causal one.

The measurements answer different parts of that descriptive question:

- validation loss tracks predictive fit on a declared text domain;
- relative parameter distance measures how much the weights moved;
- token-neighbour overlap checks whether selected embedding neighbourhoods were reordered;
- centred kernel alignment (CKA) compares broad hidden-representation geometry;
- next-token overlap asks how much the model's most likely continuations changed.

No single measure is a complete account of the model. Their value comes from reading them together.

## Parent, stages, and retained boundaries

The model branch started from the existing `sapienzanlp/Minerva-7B-instruct-v1.0` parent at a pinned revision. This 7B model was not trained from scratch in the project. A separate, roughly 70-million-parameter transformer was implemented and trained from scratch as a learning arc, but it is not the parent of the system analyzed here.

The full-weight BF16 curriculum had three stages:

1. historical and literary Italian, spanning the broadest target domain;
2. historical non-sonnet poetry;
3. a focused classical-sonnet stage.

Each stage mixed in deterministic modern-preservation replay from PAISÀ. It supplied 5% of target-token exposure in each stage—not 5% of documents, unique examples, or corpus size. The selected endpoint was determined by frozen target and preservation gates rather than simply taking the last update.

The study retained a midpoint and selected endpoint for every stage. Analysis used 48 fixed probes spanning historical general text, historical poetry, sonnets, and modern instruction text, along with a frozen registry of selected token rows. These are deliberately bounded samples. They make repeated comparison possible, but they are not a complete map of what a seven-billion-parameter model represents.

## Training dynamics and compute categories

All three stages passed their declared adaptation and preservation gates. The historical/general stage selected update 2,065 and ran for a measured 15,495 seconds. The non-sonnet-poetry stage selected update 760 and ran for 7,547 seconds. The sonnet stage selected update 120 of 135 and ran for 3,115 seconds.

| Stage              | Selected update | Measured runtime | Selected target loss |
| ------------------ | --------------: | ---------------: | -------------------: |
| Historical/general |           2,065 |         15,495 s |               2.8466 |
| Non-sonnet poetry  |             760 |          7,547 s |               2.8475 |
| Sonnets            |      120 of 135 |          3,115 s |               3.1103 |

Update 120 was retained in the final stage because update 135 was effectively tied on sonnet loss but worse on instruction loss. This is a small example of why a curriculum needs preservation measures: the lowest or latest target checkpoint is not automatically the best overall state.

The three-stage figure of about $10.65 belongs in a different evidence category. It is a projection from a qualification-based cost rate, not the measured final bill. The runtimes are observations from completed runs; the cost is a modeled translation of qualified throughput and pricing assumptions. Reporting both is useful only if that distinction remains visible.

## Target-loss reductions narrowed by stage

The domain losses show the curriculum becoming progressively more specific. Stage 1 reduced loss on all three historical targets between its first validation and selected endpoint: 0.0762 on historical/general material, 0.1702 on historical poetry, and 0.2385 on sonnets. Stage 2 reduced poetry loss by another 0.0780 and sonnet loss by 0.0908. Stage 3 reduced sonnet loss by 0.0179 while its preservation-domain changes remained small.

| Domain             | Stage 1 reduction | Stage 2 reduction | Stage 3 reduction |
| ------------------ | ----------------: | ----------------: | ----------------: |
| Historical/general |            0.0762 |                 — |                 — |
| Historical poetry  |            0.1702 |            0.0780 |                 — |
| Sonnets            |            0.2385 |            0.0908 |            0.0179 |

```plotly
{% include plotly/transformer-poetry/stagewise-target-loss-reduction.json %}
```

<div class="caption">
    Loss reduction within each stage, measured from that stage's first validation to its selected endpoint; larger positive values mean a greater reduction. Blank cells are domains for which that later stage did not define the displayed target comparison. These are stage-local changes, not additive causal effects, and no sampling interval is shown.
</div>

The broad first stage improving sonnet loss more than the explicit sonnet stage is not paradoxical. The parent first had to move toward the historical-literary domain at large. Once it had done so, the final stage operated on a model that was already much closer to its target and had less room—and less permission under the preservation gates—to move.

Loss is still only one view. It measures next-token prediction on frozen validation material, not literary success. The later sealed evaluation showed that a lower sonnet-domain loss did not produce reliably coherent, well-formed sonnets.

## Relative parameter movement

The global relative displacement from the untouched parent to the selected Stage-3 model was 0.03302. Sequential deltas reveal where that total accumulated.

| Sequential comparison               | Global relative L2 delta |
| ----------------------------------- | -----------------------: |
| Parent → Stage-1 midpoint           |                  0.02994 |
| Stage-1 midpoint → selected         |                  0.00819 |
| Stage-1 selected → Stage-2 midpoint |                  0.00728 |
| Stage-2 midpoint → selected         |                  0.00191 |
| Stage-2 selected → Stage-3 midpoint |                 0.000533 |
| Stage-3 midpoint → selected         |                0.0000971 |

```plotly
{% include plotly/transformer-poetry/relative-parameter-movement.json %}
```

<div class="caption">
    Sequential global parameter change measured as relative L2 distance; higher values mean more movement from the immediately preceding retained state. The logarithmic axis makes the more-than-two-orders-of-magnitude late-to-early range legible. These are deterministic checkpoint comparisons without uncertainty intervals and do not assign behavioral causality.
</div>

The decline is striking. The parent-to-Stage-1-midpoint delta was more than 300 times the final Stage-3-half delta. The first half of Stage 1 dominated the observed global movement.

I interpret this as evidence of a broad early domain adjustment followed by narrower specialization. I do not interpret it as a ranking of stage importance. Neural networks can alter an output distribution through small coordinated changes, especially once the model is close to a decision boundary. A late adapter or fine-tuning step may be tiny in global norm and still change the failures that users notice.

Global norms also compress location. They tell us how much the complete parameter vector moved, not which layers, heads, or features mattered. Layerwise comparisons can refine the map, but without interventions such as restoration or ablation they still cannot establish that a changed component produced a particular behavior.

## Embeddings and the language-model head

The selected embedding rows moved measurably between the parent and final model. Their mean relative L2 change was 0.05624, while mean top-20-neighbor Jaccard remained 0.9755. The language-model head moved less: relative L2 was 0.01140 and neighbor Jaccard was 0.9876.

During the late half of Stage 3, those changes were much smaller. The corresponding embedding and LM-head relative movements were 0.0000883 and 0.0000203, and the inspected neighbor sets had Jaccard 1.0.

This combination is more informative than either measurement alone. Vector positions changed, but the local neighborhoods around the inspected tokens were largely preserved. That is consistent with adjustment inside a stable local organization rather than wholesale reordering.

The registry contains selected token rows rather than the whole vocabulary. Top-20 overlap ignores changes outside the chosen neighbourhood and does not show how the downstream network uses those vectors. Jaccard overlap also discards rank and distance, so identical members can still have changed geometry.

## Hidden representations and output geometry

The fixed probes provide another scale of comparison. From parent to final, mean hidden-state drift was 0.2394. Standard-sonnet probes drifted most, at 0.3177, while modern-instruction probes drifted least, at 0.1599. Minimum linear CKA remained 0.9219, mean top-20 next-token overlap fell to 0.4994, and mean logit entropy decreased by 0.2102.

For the late half of Stage 3, mean drift was only 0.00371, minimum CKA was 0.999997, and top-20 next-token overlap was 0.9668.

| Comparison     | Mean hidden drift | Minimum linear CKA | Top-20 next-token overlap |
| -------------- | ----------------: | -----------------: | ------------------------: |
| Parent → final |            0.2394 |             0.9219 |                    0.4994 |
| Late Stage 3   |           0.00371 |           0.999997 |                    0.9668 |

```plotly
{% include plotly/transformer-poetry/representation-change-comparison.json %}
```

<div class="caption">
    Frozen-probe comparisons for parent-to-final change and the late half of Stage 3. Higher drift means more change; higher CKA and top-20 overlap mean greater similarity. Each metric has its own native-scale panel. The 48 probes are bounded, the values have no inferential interval, and the comparison is descriptive rather than causal.
</div>

These measurements say that the parent-to-final model changed meaningfully without destroying its broad representational geometry. CKA stayed high while the top of the next-token distribution changed much more. That can happen because CKA summarizes shared structure across many dimensions, whereas top-token overlap is sensitive to smaller shifts near the output ranking boundary.

The late-stage values are close to identity. They indicate little change under these measurements, while still allowing for an affected context outside the probes or a localized behaviour hidden by the average.

## What the evidence supports

Taken together, the loss, parameter, embedding, and representation measurements support a coherent descriptive account:

- broad historical adaptation produced most measured model change;
- poetry adaptation continued improving the relevant domains with smaller movement;
- sonnet specialization was a narrow late adjustment selected under preservation constraints;
- inspected embedding neighborhoods and broad representational geometry remained substantially intact;
- output rankings could change more than global structural similarity suggested.

The study also supports a practical point about experiment design. Retaining only the final checkpoint would have hidden the scale separation between stages. Retaining only training loss would have hidden the difference between predictive fit and output quality. Retaining only generations would have made it harder to tell whether late specialization was a broad rewrite or a small adjustment.

## What drift, CKA, and neighbor overlap cannot establish

None of these measurements identifies the cause of an output improvement or failure. To make a causal claim about a layer or component, I would need an intervention: restore selected weights, ablate a pathway, patch activations, or otherwise manipulate the proposed mechanism while holding alternatives fixed.

The metrics also cannot establish preserved capability on their own. A high CKA value is compatible with a behavior degrading. Neighbor overlap does not validate syntax or factual knowledge. Low global parameter movement does not guarantee safety, and high movement does not prove forgetting.

Finally, the analysis is conditioned on one parent, one curriculum, one set of retained checkpoints, and bounded probes. It is not evidence that every language model adapts in this order, or that early stages will always dominate. The value is closer to a well-instrumented case study than a general law.

## Reproducibility and AI contribution

At publication, the public source repository includes the pinned state registry, analyzers for weights, embeddings, representations, and losses, frozen configurations, aggregate reports, tests, and a deterministic website-evidence exporter. Public Python 3.12 verification checks those software and evidence contracts. A separate [Hugging Face release](https://huggingface.co/LPM93/teaching-transformers-classical-italian-sonnets) provides the three selected stage models and DPO adapter. It does not reproduce the historical H100 run, supply every intermediate snapshot, or include the raw probe tensors needed to repeat the complete model-state analysis.

The checkpoint and data boundary is intentional. The selected full BF16 stage weights are available through that model release, but intermediate states, raw probe tensors, raw generations, poems and openings used in evaluation, private mappings, and annotations are not embedded in this note or its charts and remain unpublished.

I conceived and directed the project, chose its learning and research goals, made executive decisions, approved the plan, reviewed outputs, and sometimes ran GPU work. Codex 5.5 and later Codex 5.6 Sol helped design the research plan and substantially assisted implementation, tests, execution, and analysis. I do not describe the study as independently designed or independently implemented by me.

That disclosure is especially relevant to a study about interpreting complex artifacts. The important standard is not whether every line was typed manually. It is whether the evidence is traceable, the claims remain inside what that evidence can support, and the division of work is stated honestly.

The broader project and its final failure boundary are summarized in [Teaching Transformers to Write Classical Italian Sonnets]({% link _projects/transformer-poetry.md %}).
