---
layout: post
title: "When More Analysis Makes the Answer Worse"
date: 2026-07-29 00:01:00 +0200
description: "Rigor is not the same as exhaustiveness: analysis should reduce the uncertainty that matters to a decision."
tags: data-science decision-making uncertainty
categories: [thoughts]
featured: false
---

{% comment %}
FIRST-DRAFT NOTE: Reconsider the publication date when this essay is ready.
The argument would become more personal with one public-safe example of an
analysis you deliberately stopped, simplified, or narrowed.
{% endcomment %}

One of the hardest habits to develop in applied data science is knowing when to stop.

There is almost always another useful analysis available. I can test another assumption, segment the data one more way, compare another model, investigate one more anomaly, or add another caveat to the presentation. Each step can be defended on technical grounds. Taken together, however, they can make the work less useful.

This sounds like an argument for lowering standards. I mean the opposite. Stopping well requires more judgment than continuing automatically.

## Rigor and Exhaustiveness Are Different

My academic background trained me to be suspicious of easy conclusions. That instinct remains valuable. I want to understand where the data came from, which assumptions are doing the work, what uncertainty remains, and whether a result survives reasonable attempts to challenge it.

But a habit that protects research can become counterproductive when it is applied without regard for the decision around it.

In research, an unresolved question can become the next question. In applied work, the analysis usually sits inside a process that has a deadline, an audience, and a choice that someone needs to make. The relevant standard is not whether every interesting uncertainty has been removed. It is whether the remaining uncertainty could reasonably change the decision.

An analysis can therefore become more comprehensive while becoming less useful. The extra work may arrive too late, bury the main result, or make the recommendation harder to understand without changing what anyone should do.

{% comment %}
REVISION SUGGESTION: Add a short example here. It could come from a personal
portfolio project if a work example would be confidential. Focus on what you
chose not to analyse and why the decision did not need it.
{% endcomment %}

## Decisions Have Their Own Resolution

Not every decision requires the same level of analytical resolution.

A reversible exploratory choice does not need the same evidence as a large, irreversible investment. A directional estimate may be enough to decide whether a question deserves further investigation. A production system needs stronger checks than a prototype whose purpose is to expose whether an idea is worth pursuing.

Problems arise when the sophistication of the analysis is disconnected from the stakes of the decision. Sometimes we under-analyse a consequential choice. But we can also over-analyse a modest one because the additional work is intellectually satisfying or technically impressive.

This is especially tempting in data science because complexity is visible. More features, more models, more charts, and more methodological detail all look like evidence of effort. Restraint is harder to display. A well-judged omission leaves no artifact behind.

Yet every additional layer has a cost:

- time before the result can be used;
- more assumptions to validate;
- more material for an audience to interpret;
- more components to maintain;
- more opportunities for the central message to disappear.

Those costs may be justified. They should not be treated as free.

## Focus on Material Uncertainty

The question I find most helpful is not, "What else could I analyse?" It is, "What could I learn that would change the action?"

That shifts attention from uncertainty in general to **material uncertainty**.

Suppose two plausible methods produce slightly different estimates but lead to the same ranking, recommendation, or operational choice. Understanding the difference may still be worthwhile, particularly if the method will be reused. But for the immediate decision, the disagreement may not be material.

By contrast, a simple data-quality issue that could reverse the ranking deserves immediate attention, even if investigating it is less intellectually attractive than trying a more advanced model.

This distinction is not always obvious in advance. Analysis is partly how we discover what matters. The point is not to demand certainty about the value of every task before doing it. The point is to reassess as evidence accumulates instead of allowing the work to expand by inertia.

{% comment %}
REVISION SUGGESTION: Decide whether "material uncertainty" is the phrase you
would naturally use. If it feels too formal, replace it with plainer language
and keep the underlying distinction.
{% endcomment %}

## A Practical Stopping Rule

Before extending an analysis, I try to ask four questions:

1. **Could the result change the decision?** If every plausible outcome implies the same action, the extension may not be urgent.

2. **Are the stakes high enough to require greater confidence?** Irreversible or expensive decisions justify more scrutiny than reversible experiments.

3. **Will this work improve future decisions as well as the current one?** An investigation may be worthwhile because it validates a reusable method, even when it does not alter today's recommendation.

4. **Can the intended audience understand and use the additional result?** Information that cannot be connected to an action may belong in an appendix, a later phase, or nowhere.

These questions do not produce a mechanical answer. They make the tradeoff explicit. They also expose a common failure mode: continuing because no one has taken responsibility for deciding that the evidence is sufficient.

## Knowing What to Leave Out

Good applied analysis is not shallow analysis. It still requires checking assumptions, finding failure modes, and communicating uncertainty honestly. The difference is that rigor is directed toward the decision rather than toward completeness for its own sake.

I still feel the pull to keep investigating. Often that instinct catches something important. But professional judgment also means recognizing when another technically valid step would only make the answer later, longer, and harder to use.

The ability to analyse more is a technical skill. Knowing what can responsibly be left out is part of the craft.

{% comment %}
FINAL REVISION QUESTIONS:

- Does the essay sound too prescriptive, or does it reflect how you work?
- Add one example and one counterexample so the argument does not read as a
  universal preference for speed.
- Consider whether the four-question stopping rule is genuinely yours. Rewrite
  or remove any question you would not use in practice.
  {% endcomment %}
