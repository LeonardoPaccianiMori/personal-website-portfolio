---
layout: post
title: "A narrow win that did not make a good poet"
date: 2026-08-12 09:10:00 +0200
description: Testing whether a language model trained on AI preferences produced better Italian sonnets, and why an improved automatic score was not enough.
tags: language-models DPO evaluation preference-learning responsible-ai
categories: [technical-notes]
technical_kind: note
chart:
  plotly: true
last_updated: 2026-09-07
project_slug: transformer-poetry
toc:
  beginning: true
reading_minutes: 9
---

The [transformer-poetry project](/projects/transformer-poetry/) reached a point where an adapted language model was generating sonnet attempts with obvious defects. Some contained drafting labels or surrounding prose. Others stopped without convincing closure. The next experiment tested whether training on preferred examples could reduce those problems.

It used Direct Preference Optimization (DPO), which trains a model to favour one response over another. AI judges supplied the preferences. On the final held-back test, the pass rate for an automatic check rose from 15.07% to 17.60%. Yet neither system produced a poem that passed the strict quality criterion in a separate AI-based blind review.

I directed the project and reviewed its outputs; Codex substantially assisted the design, implementation, and analysis. This note follows the choices that made the gap between the automatic score and the poetry visible.

## The starting model and training target

The starting point was an existing Minerva 7B model adapted through historical Italian, non-sonnet poetry, and sonnet stages. Validation had selected its Stage-3 checkpoint before this experiment began. The 7B model was not trained from scratch.

Earlier generation studies showed two visible failures that were specific enough to target. Some outputs included drafting labels or prose around the poem. Others reached fourteen decoder-controlled lines but ended without terminal punctuation or convincing closure. The DPO branch was designed to reduce those failures, not to optimize a general concept of poetic quality.

That boundary matters. Fourteen lines were enforced by the decoding procedure. Punctuation is only a weak proxy for syntactic completion. Removing a label can make an output cleaner without improving its grammar, rhyme, metre, argument, or volta. A successful adapter could therefore improve exactly what it was trained to prefer and still leave the hard literary problem unsolved.

## Could the AI judges stand in for my preferences?

Three AI judges provided blind votes for the training preferences. I separately reviewed 20 calibration pairs. The AI majority agreed with my choices on 12 of them, or 60%.

This fell below the required agreement threshold. The 20 pairs stayed out of training, and the experiment continued as **AI-judged DPO**. It did not qualify as training aligned with human literary preferences.

That changed the interpretation of later scores: agreement with the training labels would show how well the model learned the AI judges' choices. It would not show that those choices matched mine or those of other human readers.

## Constructing the comparisons

The Stage-3 model generated 4,096 training-only candidates from 512 training openings and eight seeds. Screening retained structural and provenance information needed to compare candidates: exact opening preservation, fourteen-line completion, repetition, meta-text, terminal punctuation, and surface memorization risk.

A fixed procedure turned those candidates into 534 preference pairs. It included ordinary literary comparisons and pairs that specifically contrasted how outputs ended. Each pair received three blind AI votes under the same scoring rules.

<details markdown="1">
<summary>Pair construction and vote counts</summary>

The builder produced 173 ordinary literary comparisons and 361 terminal-completion contrasts. All 1,602 votes were present, every pair had a majority, and 437 of the 534 majorities were unanimous.

</details>

<details markdown="1">
<summary>Exact comparison values</summary>

| Funnel stage         | Count |
| -------------------- | ----: |
| Generated candidates | 4,096 |
| Preference pairs     |   534 |
| Training pairs       |   482 |
| Validation pairs     |    52 |

</details>

```plotly
{% include plotly/transformer-poetry/preference-data-funnel.json %}
```

<div class="caption">
    Record counts from training-only candidates to the prompt-disjoint 482/52 pair split; lower stages are subsets of the preceding process, although candidates and pairs are different units. Preferences are AI-majority decisions, and the 20 human-reviewed calibration pairs are excluded. Counts are exact, with no sampling interval.
</div>

Training and validation used different poem openings. This kept the same opening out of both fitting and model selection, although 52 validation pairs were still a small sample of literary behaviour.

## Training the preference adapter

Low-Rank Adaptation (LoRA) adds a small set of trainable weights while keeping the existing model weights fixed. This experiment used a rank-8 adapter, trained for one epoch on 482 pairs, with 52 pairs from different openings held out for validation. Preference accuracy reached 65.38%; that measures agreement with AI labels, not poetry quality.

<details markdown="1">
<summary>Implementation, run settings, and measured compute</summary>

The implementation used direct PyTorch and PEFT rather than TRL. A shared Stage-3 base computed policy scores with the rank-8 LoRA adapter enabled and reference scores with it disabled. Only response-token log likelihood contributed to the DPO objective.

| Setting                     | Value                                           |
| --------------------------- | ----------------------------------------------- |
| Adapter                     | rank 8, alpha 16; attention and MLP projections |
| DPO beta                    | 0.1                                             |
| Training / validation pairs | 482 / 52, prompt-disjoint                       |
| Epochs / optimizer updates  | 1 / 61                                          |
| Microbatch / accumulation   | 1 / 8                                           |
| Hardware                    | one H100 80 GB                                  |
| All-in runtime              | 148.6 s, measured                               |
| Peak VRAM                   | 14.81 GiB, measured                             |
| Run cost                    | about $0.093, estimated                         |

Held-out preference loss was 0.6629 and held-out preference accuracy was 65.38%. Those values support the limited statement that the adapter learned some of its AI-judge target. They are not literary-quality metrics.

</details>

## Selecting the candidate before the final test

Stage 3 and DPO generated 960 matched validation outputs from 120 held-out openings, four seeds, and two systems. Each pair used the same input, generation settings, stopping rule, and random seed. Enabling the adapter was the intended difference.

The automatic surface-screen rate rose from 13.96% to 18.96%, a paired gain of 5.00 percentage points with a 95% prompt-cluster interval from 0.63 to 9.38. A frozen blind sample of 80 outputs also found genuine terminal completion in 20/40 DPO outputs and 12/40 Stage-3 outputs. Neither system produced a strict-good output in that review.

This was enough to select DPO for the predeclared final comparison. Selection answered “which system advances under this protocol?” The final test asked whether that difference survived new data after the decisions were locked.

## Testing on openings kept out of development

The final comparison used a sealed test: poem openings that remained unavailable for model development and selection. Before opening it, the systems, generation settings, measurements, sample, and analysis procedure were fixed and their file hashes recorded. Retuning or rerunning after access was prohibited.

The one-time run evaluated all 1,244 test openings with two seeds and both systems, producing 4,976 outputs.

<details markdown="1">
<summary>Final-test runtime and estimated cost</summary>

The run took a measured 2,970.6 seconds on one H100. Its approximately $1.967 cost is estimated from runtime rather than taken from a final bill.

</details>

<details markdown="1">
<summary>Exact comparison values</summary>

| Paired automatic change     | DPO change (percentage points) |   95% interval |
| --------------------------- | -----------------------------: | -------------: |
| Validation surface screen   |                          +5.00 | +0.63 to +9.38 |
| Sealed surface screen       |                          +2.53 | +0.52 to +4.50 |
| Sealed meta-text free       |                          +1.45 | −0.28 to +3.18 |
| Sealed terminal punctuation |                          +2.85 | +0.72 to +4.86 |

</details>

```plotly
{% include plotly/transformer-poetry/validation-vs-sealed-test-gains.json %}
```

<div class="caption">
    DPO-minus-Stage-3 changes in percentage points; positive values favor DPO for these automatic checks. Error bars show the available paired 95% intervals. Validation and sealed test are different populations, fourteen-line generation is decoder-controlled, and punctuation or meta-text removal does not establish literary quality.
</div>

The sealed surface-screen and punctuation intervals excluded zero. The meta-text-free interval did not. The repeatable result was therefore limited to part of the targeted formatting and completion behaviour on the held-back openings.

The gain narrowed from validation to test. That is exactly why the sealed step mattered: without it, the validation result could become the public headline with no measure of how it transferred.

## Did the poems pass a stronger quality test?

The stronger quality test followed a review plan fixed in advance. It compared both systems on 100 matched test openings, using one fixed seed per opening. An AI analyst scored all 200 outputs before learning which system produced each one. This was an AI review, not a panel of independent human literary experts.

<details markdown="1">
<summary>Exact comparison values</summary>

| Literary dimension  | Mean DPO − Stage 3 |   95% interval |
| ------------------- | -----------------: | -------------: |
| Grammar             |              −0.01 | −0.20 to +0.18 |
| Historical register |              +0.21 | +0.04 to +0.38 |
| Poetic quality      |              +0.06 | −0.12 to +0.23 |
| Sonnet/form         |              +0.09 | −0.03 to +0.22 |
| Volta/argument      |               0.00 | −0.21 to +0.21 |

</details>

```plotly
{% include plotly/transformer-poetry/blind-literary-deltas.json %}
```

<div class="caption">
    Mean prompt-paired score changes on five 1–5 literary dimensions across the frozen 200-output blind review; positive values favor DPO. Error bars are 95% prompt-bootstrap intervals. Only historical register excludes zero, and the correlated AI analyst is not a panel of independent human literary experts.
</div>

Only historical register produced an interval excluding zero. Grammar, poetic quality, sonnet/form, and volta remained uncertain. Visible completion was 41/100 for DPO and 35/100 for Stage 3, but its interval also crossed zero. DPO produced 3/100 moderate-clean outputs versus 0/100, a descriptive signal rather than evidence of consistency.

Both systems produced 0/100 strict-good outputs. Sonnet/form was the weakest mean dimension for both. The adapter improved the automatic check, but the poems still failed the project's strict quality criterion.

## Checking for losses elsewhere

A narrow gain is less useful if it damages unrelated capability. The project therefore recomputed losses on five frozen domains with the adapter disabled and enabled.

<details markdown="1">
<summary>Exact comparison values</summary>

| Domain             | DPO − Stage-3 loss |
| ------------------ | -----------------: |
| Historical/general |           −0.00003 |
| Historical poetry  |           +0.00004 |
| V7 sonnets         |           +0.00063 |
| Modern Italian     |           +0.00014 |
| Instruction        |           +0.01334 |

</details>

```plotly
{% include plotly/transformer-poetry/preservation-loss-changes.json %}
```

<div class="caption">
    Adapter-enabled minus Stage-3 validation loss on five frozen domains; positive values are regressions and negative values are improvements. Changes are deterministic comparisons without uncertainty intervals. Instruction loss shows the largest regression, which is reported rather than rounded away.
</div>

The losses were mostly stable, with the largest increase on instruction validation. That increase was small relative to the baseline losses, but it was not zero. These checks measured five domains; they could not establish that every other capability was preserved.

## Reading the result

The evaluation answered three different questions. The adapter learned some of the AI judges' preferences. Part of its automatic-score improvement survived new test openings. The resulting poems still failed the stronger quality criterion.

The distinction was necessary because the automatic check measured drafting labels and punctuation, while fourteen-line length was enforced during generation. A better score could not establish that the model had learned sonnet form or could develop an argument to a convincing close.

The separate AI-based review was also limited, but it prevented the automatic gain from becoming a claim of reliable literary quality. That is the central result of the experiment.

## Reproducibility and AI contribution

At publication, the public source includes the DPO implementation, frozen configurations, preference-builder and validation contracts, preservation evaluator, final-test analyzer, aggregate reports, tests, and deterministic Plotly exports. The selected Stage-3 model and DPO adapter are separately public in the [Hugging Face release](https://huggingface.co/LPM93/teaching-transformers-classical-italian-sonnets). The underlying candidates, poems and openings, raw generations, preference pairs, votes, annotations, private mappings, intermediate checkpoints, and unselected tensor artifacts remain excluded.

The public checks run on a CPU and verify software behaviour and the recorded aggregate evidence. They do not repeat the historical H100 run or automatically download and run the separately hosted weights.

I conceived and directed the project, defined its goals, made executive decisions, approved the research plan, reviewed outputs, and sometimes ran GPU work. Codex 5.5 and later Codex 5.6 Sol helped design the plan and substantially assisted implementation, tests, execution, and analysis. The work is therefore not independently designed or independently implemented by me.

The complete dual-arc project is summarized in [Teaching Transformers to Write Classical Italian Sonnets]({% link _projects/transformer-poetry.md %}); the companion note examines [how the retained 7B model states changed across the three adaptation stages]({% post_url 2026-08-26-how-one-7b-italian-language-model-changed-across-staged-adaptation %}).
