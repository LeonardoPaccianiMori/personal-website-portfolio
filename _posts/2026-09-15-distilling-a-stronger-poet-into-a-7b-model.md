---
layout: post
title: "Distilling a stronger poet into a 7B model"
date: 2026-09-15 09:30:00 +0200
description: Large models write far more coherent verse than my 7B pipeline, so I distilled their sonnets into it. Form improved; coherence did not. This is what the null result looks like, including the licence basis for the data.
tags: language-models distillation LoRA evaluation licensing
categories: [technical-notes]
technical_kind: note
last_updated: 2026-09-15
project_slug: transformer-poetry
toc:
  beginning: true
reading_minutes: 12
---

The [previous note](/blog/2026/from-zero-to-sixty-nine-percent-decomposition-fixed-the-form/) ends with a clean statement of the problem. The plan-then-poem pipeline writes a well-formed sonnet about two times in three, but the poems are not good: calibrated AI judges score them about 2.8 out of 5, citing grammar and syntax errors in an otherwise convincing archaic register.

Large models do not have that problem. A modern hosted model writes grammatical, coherent classical-style Italian — but it does not reliably hold the strict sonnet form, and it is far too large to be a satisfying answer to _can a 7B model be taught this task_. So I tried distillation: let a strong model write the poems, keep only the ones that pass the form checker, and fine-tune the 7B writer on them.

This note reports what worked, what did not, and the licence basis for the data, because a distillation experiment that skips that part is not publishable.

## Building a legal teacher corpus

The first attempt used a model gateway whose terms I could not verify for training use. I stopped it, kept its outputs local, and never trained on them. The rule I applied afterwards is simple: use only a model whose terms explicitly permit using its outputs to train other models.

The DeepSeek Open Platform qualifies, in writing. Its Terms of Service (release 2026-04-22, effective 2026-04-29), section 4.2, state that the user

> "may apply the Inputs and Outputs of the Services to a wide range of use cases, including personal use, academic research, derivative product development, training other models (such as model distillation), etc."

and section 4.2(2) assigns rights in the Outputs to the user. The repository records the provider, the exact model (`deepseek-chat`), the date, the generated volume, the filtering criteria, and the caveats: the terms are governed by PRC law, they forbid implying DeepSeek endorsement or partnership, they require disclosing AI-generated content to end users, and export-control rules apply. No synthetic text is redistributed; only the adapter and aggregate documentation are published.

Three kinds of data came out of it, all filtered by the project's checker before use:

| Data                                                    | Generated |  Kept | Role                      |
| ------------------------------------------------------- | --------: | ----: | ------------------------- |
| Planned-mode sonnets (a lexicon plan was supplied)      |     2,674 | 1,756 | form-following examples   |
| Free-mode sonnets (no plan)                             |     1,578 |   507 | autonomous-rhyme examples |
| Grammar repairs of my own valid-but-ungrammatical poems |       592 |   396 | targeted grammar examples |

The grammar-repair data deserves a note. Instead of asking the teacher for new poems, I handed it my own scheme-valid poems with their rhyme words and asked it to fix the grammar while keeping every line-ending word. 92% of repairs stayed scheme-valid and 91% preserved the endings, so the pairs isolate grammar rather than form.

## Two fine-tunes, one clear pattern

**Run 1 — teacher mix.** 2,846 cards (1,756 planned + 370 free + 396 repair + 324 of my own pipeline cards), 346 optimizer updates.

**Run 2 — grammar focus.** 1,103 cards (507 free + 396 repair + 200 pipeline), 268 updates, deliberately dropping the form-heavy planned data to give grammar the centre of the signal.

| Metric                              | Before distillation | Run 1 (teacher mix) | Run 2 (grammar focus) |
| ----------------------------------- | ------------------: | ------------------: | --------------------: |
| Composed scheme validity, no repair |              0.6250 |              0.6792 |            **0.6917** |
| Poem validity given a valid plan    |              0.6734 |              0.7318 |                0.7374 |
| Accepted lines (of 14)              |                7.33 |                7.32 |                  7.33 |
| Failed lines                        |                1.15 |                0.93 |                  0.93 |
| Judge mean (two judges)             |                2.81 |                2.95 |                  2.82 |

Form improved twice, and the distilled writer is now the best form in the project. Coherence moved once, by +0.15, and then fell back to +0.01.

## The null result, stated plainly

The pre-registered gate for the coherence line was a judge gain of +0.5 to continue, +0.3 to keep trying, and below +0.3 to stop. The two runs gave +0.145 and +0.01. The teacher sonnets themselves score **4.12** (planned mode) and **4.47** (free mode) under the same judges — so the teacher is not the problem. The 7B model cannot hold what it is shown.

Three plausible reasons, none of them yet tested:

1. **Capacity.** Grammar in this register may need more parameters than form does; form is a pattern over line endings, grammar is a constraint over every token.
2. **Distribution distance.** The teacher writes modern, fluent Italian in a classical register; the base model's weights come from a different, narrower corpus.
3. **Objective.** Imitation of ~1,000-3,000 teacher poems is a thin signal for a behavioural change of this size, whereas the form improvement rode on an existing skill (following an explicit plan).

I stopped the line there rather than keep tuning. The agreed rule was two to three coherence attempts with a pre-registered gate, and two attempts both missed it. Recording a null result is more useful than an unconstrained search for a number that passes.

## What I would try next

The honest options, each a separate decision with its own budget:

- **A larger base.** A 14B model fits one 80 GB GPU with LoRA, and the capacity hypothesis is directly testable.
- **Reinforcement learning with the checker as reward.** Form is a checkable objective; a policy gradient could optimise rhyme and metre jointly instead of imitating examples.
- **A human literary review.** The judge panels are machines; a small human-rated sample would tell us whether the coherence problem is as severe as the judges say.
- **Larger-scale, licence-cleared distillation** with a bigger and better-filtered teacher corpus.

None of these is a small change, and none is obviously going to fix coherence. That is exactly why the current stopping point is the right one to publish.

## Why the experiment is still worth reading

Two things transfer beyond this project. First, the licence discipline: the difference between "a model wrote this" and "a model's terms allow me to train on this" is the difference between a demo and a publishable result, and it is checkable in an afternoon. Second, the shape of the result: distillation reliably improved the _measurable_ objective (form, +0.067 composed validity) and failed on the objective that motivated it (coherence, +0.01). A project that reports both numbers is more useful than one that reports the first.

The teacher corpus stays private, the adapters and aggregate documentation are in the [Hugging Face release](https://huggingface.co/LPM93/teaching-transformers-classical-italian-sonnets) (the distilled adapter carries the licence disclosure), and the checker, plans, trainers, and reports are in the [source repository](https://github.com/LeonardoPaccianiMori/portfolio-transformer-poetry).
