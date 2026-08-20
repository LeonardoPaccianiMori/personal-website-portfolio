---
layout: post
title: "A narrow win that did not make a good poet: evaluating AI-judged DPO with a sealed test"
date: 2026-08-15 09:10:00 +0200
description: How a bounded AI-judged preference update survived a sealed test without establishing broad literary improvement.
tags: language-models DPO evaluation preference-learning responsible-ai
categories: [technical-notes]
chart:
  plotly: true
---

The most defensible result in my transformer-poetry project sounds modest: a small DPO adapter improved a narrow automatic surface screen on validation, and part of that advantage replicated on a one-time sealed test. It did not make the underlying model a reliably good poet.

That second sentence is not a disclaimer added after the result. It follows from the evaluation design. The preference labels came from AI judges that failed a small human-calibration check. The optimization target focused on meta-text and terminal completion rather than literary quality in general. The sealed automatic gains were a few percentage points. In the controlling blind review, only historical register had an interval excluding zero, and both systems produced 0/100 strict-good outputs.

The experiment is useful because the narrow gain survived a stronger test than the headline alone would suggest. It is also useful because that test prevented the gain from expanding into a much larger claim.

## The bounded DPO target

The starting point was the validation-selected Stage-3 Minerva 7B model: an existing 7B parent adapted through historical Italian, non-sonnet poetry, and sonnet stages. The final 7B model was not trained from scratch.

Earlier generation studies showed two visible failures that were specific enough to target. Some outputs included drafting labels or prose around the poem. Others reached fourteen decoder-controlled lines but ended without terminal punctuation or convincing closure. The DPO branch was designed to reduce those failures, not to optimize a general concept of poetic quality.

That boundary matters. Fourteen lines were enforced by the decoding procedure. Punctuation is only a weak proxy for syntactic completion. Removing a label can make an output cleaner without improving its grammar, rhyme, metre, argument, or volta. A successful adapter could therefore improve exactly what it was trained to prefer and still leave the hard literary problem unsolved.

## Failed human/AI calibration

Three AI judges provided blind votes for the training preferences. I separately reviewed 20 calibration pairs. The AI majority agreed with my choices on 12 of them, or 60%.

That failed the calibration threshold. The 20 reviewed pairs were kept out of training, and I did not reinterpret the mismatch as human preference learning. Throughout the project, the method is therefore called **AI-judged DPO**. It is not RLHF, human-aligned DPO, or a human-calibrated literary reward model.

The mismatch does not make the experiment meaningless. It changes what its outcome can mean. If the adapter learns the preference data, that is evidence that it learned a signal defined by the AI-majority process. Whether that signal corresponds to human literary judgment remains a separate question that the calibration did not resolve.

## Candidate and preference construction

The Stage-3 model generated 4,096 training-only candidates from 512 training openings and eight seeds. Screening retained structural and provenance information needed to compare candidates: exact opening preservation, fourteen-line completion, repetition, meta-text, terminal punctuation, and surface memorization risk.

The frozen builder produced 173 ordinary literary comparisons and 361 terminal-completion contrasts, for 534 total preference pairs. Every pair received three blind AI votes under an unchanged rubric. All 1,602 votes were present, every pair had a majority, and 437 of the 534 majorities were unanimous.

| Funnel stage         | Count |
| -------------------- | ----: |
| Generated candidates | 4,096 |
| Preference pairs     |   534 |
| Training pairs       |   482 |
| Validation pairs     |    52 |

```plotly
{% include plotly/transformer-poetry/preference-data-funnel.json %}
```

<div class="caption">
    Record counts from training-only candidates to the prompt-disjoint 482/52 pair split; lower stages are subsets of the preceding process, although candidates and pairs are different units. Preferences are AI-majority decisions, and the 20 human-reviewed calibration pairs are excluded. Counts are exact, with no sampling interval.
</div>

The training and validation pairs were prompt-disjoint. That prevents the most direct form of opening leakage between fitting and selection, but it does not make 52 validation pairs a comprehensive sample of literary behavior.

## Training design and compute

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

## Validation-based selection

Stage 3 and DPO generated 960 matched validation outputs from 120 held-out openings, four seeds, and two systems. The prompt, decoder, stopping rule, input, and RNG seed were identical; adapter activation was the intended difference.

The automatic surface-screen rate rose from 13.96% to 18.96%, a paired gain of 5.00 percentage points with a 95% prompt-cluster interval from 0.63 to 9.38. A frozen blind sample of 80 outputs also found genuine terminal completion in 20/40 DPO outputs and 12/40 Stage-3 outputs. Neither system produced a strict-good output in that review.

This was enough to select DPO for the predeclared final comparison. It was not enough to declare success. Selection answers “which system advances under this protocol?” A final test asks whether the selected difference survives new data after the decisions are locked.

## One-time sealed automatic evaluation

Before opening the test, the final system, comparator, prompt, decoder, stopping rule, metrics, sample, and analysis procedure were hash-frozen. The one-time run then evaluated all 1,244 sealed openings with two seeds and both systems: 4,976 outputs. Retuning or rerunning after test access was prohibited.

The run took a measured 2,970.6 seconds on one H100. Its approximately $1.967 cost is estimated from runtime rather than taken from a final bill.

| Paired automatic change     | DPO change (percentage points) |   95% interval |
| --------------------------- | -----------------------------: | -------------: |
| Validation surface screen   |                          +5.00 | +0.63 to +9.38 |
| Sealed surface screen       |                          +2.53 | +0.52 to +4.50 |
| Sealed meta-text free       |                          +1.45 | −0.28 to +3.18 |
| Sealed terminal punctuation |                          +2.85 | +0.72 to +4.86 |

```plotly
{% include plotly/transformer-poetry/validation-vs-sealed-test-gains.json %}
```

<div class="caption">
    DPO-minus-Stage-3 changes in percentage points; positive values favor DPO for these automatic checks. Error bars show the available paired 95% intervals. Validation and sealed test are different populations, fourteen-line generation is decoder-controlled, and punctuation or meta-text removal does not establish literary quality.
</div>

The sealed surface-screen and punctuation intervals excluded zero. The meta-text-free interval did not. This is the narrow replicated result: the adapter improved part of the targeted surface/completion behavior under a new, frozen population.

The size of the gain also narrowed from validation to test. That is not surprising, but it is exactly why the sealed step matters. Without it, the validation result could easily become the public headline with no measure of how it transferred.

## Blind literary review

The controlling quality assessment was a preregistered blind review of 100 matched test prompts, one frozen seed per prompt, and both systems. An AI qualitative analyst scored all 200 outputs before model identities were revealed.

| Literary dimension  | Mean DPO − Stage 3 |   95% interval |
| ------------------- | -----------------: | -------------: |
| Grammar             |              −0.01 | −0.20 to +0.18 |
| Historical register |              +0.21 | +0.04 to +0.38 |
| Poetic quality      |              +0.06 | −0.12 to +0.23 |
| Sonnet/form         |              +0.09 | −0.03 to +0.22 |
| Volta/argument      |               0.00 | −0.21 to +0.21 |

```plotly
{% include plotly/transformer-poetry/blind-literary-deltas.json %}
```

<div class="caption">
    Mean prompt-paired score changes on five 1–5 literary dimensions across the frozen 200-output blind review; positive values favor DPO. Error bars are 95% prompt-bootstrap intervals. Only historical register excludes zero, and the correlated AI analyst is not a panel of independent human literary experts.
</div>

Only historical register produced an interval excluding zero. Grammar, poetic quality, sonnet/form, and volta remained uncertain. Visible completion was 41/100 for DPO and 35/100 for Stage 3, but its interval also crossed zero. DPO produced 3/100 moderate-clean outputs versus 0/100, a descriptive signal rather than evidence of consistency.

Most importantly, both systems produced 0/100 strict-good outputs. Sonnet/form was the weakest mean dimension for both. The adapter had won a bounded comparison without crossing the quality bar that motivated the project.

## Preservation losses

A narrow gain is less useful if it damages unrelated capability. The project therefore recomputed losses on five frozen domains with the adapter disabled and enabled.

| Domain             | DPO − Stage-3 loss |
| ------------------ | -----------------: |
| Historical/general |           −0.00003 |
| Historical poetry  |           +0.00004 |
| V7 sonnets         |           +0.00063 |
| Modern Italian     |           +0.00014 |
| Instruction        |           +0.01334 |

```plotly
{% include plotly/transformer-poetry/preservation-loss-changes.json %}
```

<div class="caption">
    Adapter-enabled minus Stage-3 validation loss on five frozen domains; positive values are regressions and negative values are improvements. Changes are deterministic comparisons without uncertainty intervals. Instruction loss shows the largest regression, which is reported rather than rounded away.
</div>

The losses were mostly stable, with the largest increase on instruction validation. Calling that increase small is reasonable relative to the baseline losses, but calling it zero would not be. Preservation checks constrain the tradeoff; they do not prove that every unmeasured capability was preserved.

## What improved—and what did not

The evidence supports four bounded statements:

- DPO learned some of the AI-majority preference signal.
- Its validation surface-screen improvement had a positive paired interval.
- A smaller surface-screen and terminal-punctuation advantage replicated on the sealed test.
- Preservation loss changes were limited under the five measured domains.

It does not support human alignment, reliable literary quality, solved sonnet form, learned fourteen-line structure, or broad improvement in grammar, poetry, volta, and completion. It also does not show that DPO caused a general historical-language capability; the historical-register result is one dimension in a bounded blind review.

This difference between “won the comparison” and “became good” is the central lesson. Model evaluation often compresses a system into a score, and optimization encourages us to treat the higher score as the better model. Here, the evaluation hierarchy prevented that compression. Preference accuracy measured fit to AI labels. Validation selected a candidate. The sealed automatic test checked replication. Blind review controlled the literary claim. The strict-good gate supplied the final failure boundary.

The result is less exciting than announcing a good poet. It is more useful as evidence.

## Reproducibility and AI contribution

At publication, the public source includes the DPO implementation, frozen configurations, preference-builder and validation contracts, preservation evaluator, final-test analyzer, aggregate reports, tests, and deterministic Plotly exports. It excludes the underlying candidates, poems and openings, raw generations, preference pairs, votes, annotations, private mappings, and model tensors. The Stage-3 checkpoint and adapter remain local pending separate artifact-specific owner review and release decisions.

Public CPU verification checks software behavior and aggregate-evidence hashes. It does not regenerate the historical H100 run or provide generation with the withheld weights.

I conceived and directed the project, defined its goals, made executive decisions, approved the research plan, reviewed outputs, and sometimes ran GPU work. Codex 5.5 and later Codex 5.6 Sol helped design the plan and substantially assisted implementation, tests, execution, and analysis. The work is therefore not independently designed or independently implemented by me.

The complete dual-arc project is summarized in [Teaching Transformers to Write Classical Italian Sonnets]({% link _projects/transformer-poetry.md %}); the companion note examines [how the retained 7B model states changed across the three adaptation stages]({% post_url 2026-08-15-how-one-7b-italian-language-model-changed-across-staged-adaptation %}).
