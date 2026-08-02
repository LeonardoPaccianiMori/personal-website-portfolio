---
layout: post
title: "What academic research taught me about applied data science—and what I had to unlearn"
date: 2026-07-29 00:02:00 +0200
description: "Some research habits transferred directly into applied data science; others had to be reshaped around decisions, users, and constraints."
tags: data-science research career
categories: [thoughts]
featured: false
---

{% comment %}
FIRST-DRAFT NOTE: Reconsider the publication date when this essay is ready.
The current version uses only the confirmed outline of your academic background.
Add details about your actual research questions or working environment only
when you are comfortable publishing them.
{% endcomment %}

Before moving into industry, I worked in academic biophysics research. I expected the technical knowledge to transfer into data science, and some of it did. The more important transfer, however, was a collection of habits: how to treat evidence, how to live with uncertainty, and how to distrust a result that only works under clean assumptions.

Not every research habit transferred equally well. Some had to be adapted, and a few had to be actively unlearned.

The contrast is easy to exaggerate. Academia is not a world of perfect rigor, and industry is not a world of impatient shortcuts. Both contain careful and careless work. What changed for me was the purpose surrounding the analysis. Research tries to produce knowledge that can survive scrutiny. Applied data science must do that while also helping someone decide, build, or act.

## What I kept

### Evidence before elegance

Research made me wary of explanations that are more attractive than the evidence supporting them.

In data science, it is easy to become attached to a method because it is sophisticated, current, or enjoyable to implement. The data may not support the story we want the model to tell. A simple diagnostic can be more decisive than an elaborate architecture.

I kept the habit of asking what observation would make me change my mind. If no possible result could do that, I am probably defending a preference rather than testing an idea.

### Uncertainty is part of the result

Uncertainty is not an embarrassing remainder to hide after producing an estimate. It is part of what the analysis says.

That does not mean surrounding every conclusion with so many caveats that it becomes unusable. It means distinguishing what is known, what is inferred, which assumptions matter, and where the result is fragile. A decision-maker may still choose to act under substantial uncertainty. The analysis should help make that choice consciously.

### Messy data is not an interruption

Real data rarely arrives as a neutral representation of the world. It reflects collection processes, definitions, incentives, missingness, measurement choices, and previous technical decisions.

My research background made it natural to treat those conditions as part of the problem rather than as preliminary cleaning to get through before the "real" analysis begins. A model can only be as meaningful as the process that produced its inputs.

{% comment %}
REVISION SUGGESTION: Add a concrete public-safe example of a data issue that
changed the interpretation, not merely the cleanliness, of an analysis. A
personal portfolio project may provide the safest example.
{% endcomment %}

## What I had to unlearn

### Completeness is not always the goal

Research rewards following uncertainty into new questions. Applied work often requires deciding which uncertainty matters now.

My instinct is to explore: test another possibility, understand another edge case, or make the explanation more complete. That instinct can improve the work, but it can also delay the point at which the work becomes useful. I had to learn that a bounded answer delivered in time can be more rigorous in practice than a richer answer delivered after the decision.

This is not an excuse to ignore inconvenient evidence. It is an argument for matching the depth of analysis to the stakes and reversibility of the choice.

### A detailed explanation is not necessarily a clear one

Academic communication often demonstrates credibility by exposing method, context, and qualification. In applied settings, those details still matter, but they do not all belong in the foreground.

An audience usually needs a path through the analysis:

- What question are we answering?
- What did we find?
- How confident should we be?
- What should happen next?

Providing every technical detail before establishing that path can make a careful analysis feel less trustworthy, not more. The audience has to work too hard to discover which part matters.

I had to stop treating compression as a loss of seriousness. A short explanation can be the result of more thought, not less.

{% comment %}
REVISION SUGGESTION: Replace the general communication discussion with a
specific before-and-after example if you have one: an explanation or slide
that became stronger after removing technically correct material.
{% endcomment %}

### The question is part of the work

In research, the question may be the central intellectual contribution. In organizations, the initial question is often provisional: a request shaped by incomplete information, existing processes, or an assumed solution.

Applied data science therefore begins before the dataset and the model. It includes clarifying what decision is being made, what success would look like, what constraints are real, and whether the requested analysis addresses the underlying problem.

Answering the stated question perfectly is not useful if it is the wrong question.

## Adaptation, not rejection

"Unlearn" may be too strong a word. I did not need to abandon skepticism, depth, or curiosity. I needed to make them responsive to a different environment.

The habits I kept help me resist false certainty and technically convenient stories. The habits I changed help me deliver something that can survive contact with deadlines, users, and decisions.

The combination matters. Applied data science without research discipline can become overconfident. Research discipline without practical judgment can become detached from the reason the work exists.

I do not see the transition as moving from rigor to pragmatism. I see it as learning that rigor includes choosing the right question, the right depth, and the right form for the situation.

{% comment %}
FINAL REVISION QUESTIONS:

- Which of these lessons did you truly have to "unlearn," and which did you
  merely adapt?
- Add one detail that makes the academic background unmistakably yours without
  exposing anything you do not want public.
- Check whether the essay underplays technical knowledge in favor of habits.
- Consider linking to "When More Analysis Makes the Answer Worse" after both
  drafts are final.
  {% endcomment %}
