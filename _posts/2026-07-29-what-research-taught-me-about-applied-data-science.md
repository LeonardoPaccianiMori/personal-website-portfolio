---
layout: post
title: "What academic research taught me about rigor, and what industry changed"
date: 2026-07-29 17:00:00 +0200
description: "Research taught me to make work defensible; industry taught me to calibrate that rigor to purpose, deadlines, and impact."
tags: data-science research career
categories: [thoughts]
featured: false
---

My career as an academic has taught me how to work on a result to make it as difficult to attack as possible. That's one of the most important skills of an academic, given how one's success in academia is largely dictated by the ability to show other people (e.g., through publications in scientific journals) that their work is rigorous and correct: before being able to publish a result, one needs to learn how to anticipate criticism, investigate edge cases, and keep working until every single line can be defended through peer review.

This means that academia poses large incentives to publish a result only when it is as close as possible to perfect and unassailable (things have changed in the past decade, but I believe this is still true), even if this means taking another six months to do additional experiments to verify the soundness of your claims.

When moving to industry (as anyone who made the jump from academia knows), the incentives change dramatically: good work does _not_ have to be absolutely perfect. It needs t be good enough to create impact.

This of course doesn't mean that I had to "lower my standards" when I left academia. I simply learned that a standard only makes sense in relation to a purpose: does it make sense to spend one additional week to improve a model's metric by a few percentage points? That of course depends on what the purpose of the model is: if we are trying to detect financial fraud, then it'll be definitely worth to spend more time to improve the model, since even a few more percentage points in performance can mean significant amount of money saved. If, on the other hand, we are building a model for lower-stake applications (e.g., a recommendation engine, a classification of customer feedback etc.), then the additional week might bring very little value.

Therefore, after moving to industry I learned how to calibrate the rigour learned in academia to the problems to be solved, the deadline, and the results being produced.

## Anticipating criticism still matters

One of the academic habits I use most often is trying to see my own work through the eyes of a sceptical reader.

This is especially useful when I prepare presentations for internal teams or clients. I look for claims that could be misunderstood, conclusions that need qualification, assumptions someone might challenge, and places where additional evidence may be needed. Depending on what I find, I revise the explanation, add supporting analysis, prepare backup material, or make sure I can answer the likely question.

The goal is no longer to survive peer review. It is to make the reasoning clear and credible to people who need to assess or use the work. The setting has changed, but the ability to anticipate criticism has transferred almost directly.

What has changed is how far I follow every possible objection. In my academic work, I often treated even an unlikely edge case as a potential problem during review, so investigating it in advance was worth the effort. In applied work, investigating every edge case can consume time without making an application work better or an analysis more useful.

## Data is the result of an experiment

Experimental thinking also affects how I approach data. A dataset is not simply a table that appeared fully formed: it is the product of a collection method, and that method determines what the observations can support.

Location data offers a simple example. A person's position may be inferred through GPS, cellular networks, or Wi-Fi, and those methods have different error characteristics. If a question requires fine spatial resolution, the observed accuracy of the source must support it. If the analysis only needs a coarser pattern, a less precise source may be entirely adequate.

The interesting decision is therefore not which source is most accurate in the abstract. It is how much accuracy the analysis actually requires. Ignoring the collection method risks claiming more precision than the data contains. Insisting on the most precise method regardless of the question confuses technical superiority with fitness for purpose.

That connection between measurement and interpretation feels natural after experimental research. Before deciding what to do with data, I want to understand how it came to exist.

## Learning enough to enter a new field

My academic work also taught me how to operate outside my original training. I studied physics, then moved into biophysics and had to learn a great deal about cellular physiology, particularly bacterial physiology.

I did not become a biologist, nor did I need to. I learned by studying books and discussing problems with colleagues and my supervisor until I had enough knowledge to navigate the research field confidently and do the work in front of me.

That experience still shapes how I approach unfamiliar domains. Data science repeatedly places me in areas where I am not the subject-matter expert. My task is not to pretend that I already possess the expertise. It is to identify what I need to understand, acquire that knowledge, and become sufficiently fluent to connect the domain problem with the analytical or technical work.

## Good enough is not a percentage

The phrase “good enough” can sound like an excuse for careless work. I use it differently. It describes work that satisfies its actual purpose without also trying to eliminate every theoretically possible objection.

There is no universal threshold. I judge an application partly by whether it behaves appropriately for what it is meant to do. I judge an analysis by whether it is structured well enough to support its conclusions and intended use. Deadlines matter too, because work that arrives after it can have an impact may be less valuable despite being more complete.

Applied work can also be iterative. An application can be revised after observing how it behaves; an analysis can be refined after feedback reveals which uncertainty matters. In my research, a paper had to present a self-contained claim ready for concentrated scrutiny. Many industry outputs instead become useful by entering the world, being tested against reality, and improving.

This does not make rigor optional. It changes where rigor belongs. Sometimes another investigation is essential because it could expose a real weakness. Sometimes it would only make the answer later without making it better for its purpose. The difficult part is knowing which situation I am in.

## Rigor without perfectionism

I shed my academic reflex to pursue completeness surprisingly quickly, and doing so was liberating. I could focus on the quality and impact of the work rather than treating every unanswered question as a threat to it.

What I kept was more valuable than perfectionism: the instinct to test a claim before presenting it, to ask how the data was produced, and to learn my way into an unfamiliar domain. Industry added the discipline of deciding how much investigation the problem actually deserves and when the result is ready to be used.

That combination describes the data scientist I want to be: rigorous without being paralysed by completeness, comfortable learning beyond my original expertise, and focused on producing work that can do something useful.
