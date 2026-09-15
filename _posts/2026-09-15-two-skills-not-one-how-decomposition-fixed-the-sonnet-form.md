---
layout: post
title: "Two skills, not one: how decomposition fixed the sonnet form"
date: 2026-09-15 09:00:00 +0200
description: A small open model could not hold a rhyme scheme; splitting the task into rhyme planning and poem writing took repair-free scheme validity from 0 of 4,976 to about two in three.
tags: language-models LoRA planning evaluation open-weights
categories: [technical-notes]
technical_kind: note
last_updated: 2026-09-15
project_slug: transformer-poetry
toc:
  beginning: true
reading_minutes: 11
---

The [transformer-poetry project](/projects/transformer-poetry/) began with an uncomfortable measurement. Across 4,976 sealed outputs from the August 2026 system, **zero** held a valid rhyme scheme, metre, and fourteen-line structure at once. The poems looked like verse. The rhymes did not connect.

This note is about the follow-up: what failed, what the failure implied, and how a plan-then-poem decomposition raised repair-free scheme validity to roughly two in three outputs on a frozen evaluation grid.

## The instrument came first

Changing a model without a measuring device is guesswork, so the follow-up started with the checker: deterministic functions for syllable count and stress (metre), rhyme keys, scheme extraction, and stanza structure. It was validated against public-domain sonnets and reviewed by hand. On definite ground-truth lines the metre accuracy is 100% with 87% coverage, and all ambiguous flags are conservative. A rhyme lexicon of 1,220 keys was built from 228,164 line endings of the training corpus so that rhyme could be planned and verified rather than assumed.

Every experiment below has a pre-registered gate, and every claim is either a checker measurement or a calibrated judge measurement. The checker says nothing about whether a poem is good; it says whether the form holds.

## What failed, and what it told us

**More full-weight training did not move form.** The corrected V8 corpus retrain passed its retention gate and changed nothing measurable: accepted hendecasyllables differed by −0.225 (95% CI −0.578 to +0.128).

**Preference training gave a partial signal.** Verifier-labelled DPO raised accepted lines by 0.767 (95% CI 0.458 to 1.075), but failed lines rose by 1.904. The adapter sharpened outcomes rather than reducing errors, and no output was fully valid. The [DPO note](/writing/2026/a-narrow-win-that-did-not-make-a-good-poet/) covers that experiment.

**Prompting the model to commit to rhymes failed.** Given a list of ending words, adherence was 3.4% key match against 1.4% for a control, and the list itself degraded metre by about 1.2 accepted lines.

**Training plan following produced a copier.** On 15,476 plan-plus-sonnet examples the model reached 0.858 key match against a format control, 0.734 against a _mismatched_ plan, and 0.711 against the intended plan. It was copying whichever list was in context. Line 1 adherence was 0.017, because the opening prefill fixes that line before the model writes anything.

**Self-imitation taught structure, not rhyme.** Fine-tuning on the model's own scheme-valid outputs improved accepted lines (+1.24), cut failed lines (−4.06), restored the 4+4+3+3 stanza pattern in 0.98 of outputs, and reduced final-word repetition to 0.035 — but 57% of quatrains had eight distinct ending sounds. The model learned shape, not rhyme.

**Examples in context changed nothing.** A zero/one/three-shot A/B gave a judge gain of 0.116 against a 0.3 gate, with no measurable memorization. Prompt context was closed as a coherence fix.

## The decomposition

The pattern across those failures is that writing a sonnet is two skills, not one: _choosing_ a rhyme plan, and _writing_ to it. Under one pass the model does neither reliably. Split in two, each half is learnable.

**Step one: plan only.** The plan is text — a canonical fourteen-letter scheme plus one ending word for lines 2–14, for example:

```
Schema: ABBAABBACDECDE
Rime:
2. salita
3. ferita
...
14. bella
```

The plan generator was trained on 22,522 cards: 11,264 traces derived from real sonnets (the scheme and endings come from the poem itself) and 11,258 plans built deterministically from the rhyme lexicon. The target stops after the plan.

| Plan validity                        |       Valid plans |
| ------------------------------------ | ----------------: |
| Unadapted merged model               |           0 / 240 |
| Plan generator                       | 221 / 240 (0.921) |
| Plan generator, frozen 960-plan grid | 891 / 960 (0.928) |

**Step two: write to the plan.** A poem writer receives the plan and the opening line and writes the fourteen lines, with no repair. Fine-tuning it on the project's _own_ valid plan-plus-poem outputs was important: it learns the distribution of model-written plans, not only corpus plans. Poem validity given a valid plan rose from 0.518 to 0.793, and the composed rate on the 960-plan grid — plan valid **and** poem scheme-valid without repair — rose from 0.365 to 0.625.

## The temperature surprise

The most practical finding of the whole line was sampling temperature. At 0.85 the plan model was extremely seed-sensitive: on the same 120 openings, one seed produced plans that were valid 35% of the time and another only 26%, while other seeds sat above 90%. At temperature 0.4 the two unlucky seeds recovered to 92.1%, and good seeds reached 92.9%. Plan generation is a short, structured output; sampling noise buys nothing and costs a lot. The frozen plan recipe now uses 0.4.

## Can one model do both?

For deployment, a single model is nicer than two. Two attempts trained the plan-writer to continue with the poem in one generation.

- Attempt 1 (11,264 corpus cards + 600 pipeline pairs): 0.2604 composed validity — below the 0.50 bar.
- Attempt 2, after rebalancing the mix to include 6,426 pipeline pairs repeated six times: **0.5719** composed validity, 0.854 valid plans, 7.7 accepted lines, rhyme score 0.9924, above the 0.50 bar.

The single model works and is published as a compact alternative, but the two-model pipeline is still stronger: a dedicated poem writer beats one model that must plan and write in the same pass.

## Where the pipeline stands

| System                               | Composed scheme validity, no repair | Accepted lines | Failed lines |
| ------------------------------------ | ----------------------------------: | -------------: | -----------: |
| August 2026 published model          |                           0 / 4,976 |              — |            — |
| Plan generator + first writer        |                              0.5583 |           7.48 |         1.19 |
| Plan generator + tuned writer        |                              0.6250 |           7.33 |         1.15 |
| Plan generator + distilled writer    |                          **0.6917** |           7.33 |         0.93 |
| Single model, plan and poem together |                              0.5719 |           7.70 |         1.48 |

Two checks keep the numbers honest. The memorization screen compares every output against the 16,298 training sonnets at the line and five-word-shingle level: **zero copied lines** and a mean five-gram overlap below 0.007 in all conditions. And the checker never gets to grade itself: the same outputs are scored by calibrated AI judges, which is how the coherence limit in the companion note becomes visible.

## What is still missing

Form is measured and now largely solved: about two in three sonnets hold their scheme with no repair, and the remaining failures are mostly metre or rhyme uncertainty rather than broken structure. Coherence is not solved. The judges put the output at roughly 2.7–2.9 of 5 — readable archaic pastiche with recurring grammar errors — and the next note describes an attempt to fix that with a stronger teacher model, which improved form further but not coherence. That limit, and the decision to stop rather than keep tuning, is the honest end of this line for a 7B model.

The checker, lexicon, plans, trainers, and reports are in the [source repository](https://github.com/LeonardoPaccianiMori/portfolio-transformer-poetry), and the adapters are in the [Hugging Face release](https://huggingface.co/LPM93/teaching-transformers-classical-italian-sonnets).

---

_AI contribution and provenance: I conceived and directed the project, set its goals and
gates, reviewed the outputs, and made every publication decision. Codex 5.5/5.6 Sol and a
Codex harness using DeepSeek and other models assisted design, implementation, execution,
and analysis under my direction. The detailed task-level record is in `AI_CONTRIBUTIONS.md`
in the project repository._
