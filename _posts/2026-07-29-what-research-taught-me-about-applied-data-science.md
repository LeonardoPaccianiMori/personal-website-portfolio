---
layout: post
title: "What academic research taught me about rigor, and what industry changed"
date: 2026-07-29 17:00:00 +0200
description: "Research taught me to make work defensible; industry taught me to calibrate that rigor to purpose, deadlines, and impact."
tags: data-science research career
categories: [thoughts]
featured: false
---

Academic research taught me how to work on a result until it became difficult to attack. Before I could ask other people to accept a claim, I had to anticipate criticism, investigate edge cases, and make sure that I could defend what each experiment did and did not show.

That discipline was essential. It also created a strong pull towards completeness. In my experience, another experiment often felt worthwhile if it could close a possible gap before peer review, even if it could add months to a project.

When I moved to industry, the incentives changed. Good work did not have to be as close to unassailable as I could make it. It had to be reliable enough for its purpose, delivered in time to matter, and capable of creating an impact.

I did not need to lower my standards. I needed to stop treating the maximum possible standard as the correct one for every problem. The amount of investigation that a result deserves depends on how it will be used, what can go wrong, and what those errors would cost. A model that supports a high-stakes decision demands a different level of scrutiny from a tool that helps someone sort or explore information.

The difficult lesson was not that rigor matters less in industry. It was that rigor has to be calibrated.

## Anticipating criticism still matters

One academic habit transferred almost unchanged: I still try to see my own work through the eyes of a sceptical reader.

This is especially useful when I prepare presentations for internal teams or clients. I look for claims that could be misunderstood, conclusions that need qualification, assumptions someone might challenge, and places where additional evidence may be needed. Depending on what I find, I revise the explanation, add supporting analysis, prepare backup material, or make sure I can answer the likely question.

The goal is no longer to survive peer review. It is to make the reasoning clear and credible to people who need to assess or use the work.

What changed is how far I follow every possible objection. During my academic work, even an unlikely edge case could become important during review, so investigating it in advance was often sensible. In applied work, the same investigation may consume time without making an application more dependable or an analysis more useful. I now have to ask whether an objection exposes a material weakness or only an incomplete corner of the work.

## Data is the result of an experiment

Experimental research also changed how I look at a dataset. A table did not simply appear. It was produced by a collection method, and that method determines what the observations can support.

Location data offers a simple example. A person's position may be inferred through GPS, cellular networks, or Wi-Fi, and those methods have different error characteristics. If a question requires fine spatial resolution, the observed accuracy of the source must support it. If the analysis only needs a coarser pattern, a less precise source may be adequate.

The useful question is not which source is most accurate in the abstract. It is how much accuracy the analysis requires. Ignoring the collection method risks claiming more precision than the data contains. Insisting on the most precise method regardless of the question confuses technical superiority with fitness for purpose.

That connection between measurement and interpretation now feels instinctive. Before deciding what to do with data, I want to understand how it came to exist.

## Learning enough to enter a new field

My academic work also taught me how to move beyond my original training. I studied physics, then entered biophysics and had to learn a great deal about cellular physiology, particularly bacterial physiology.

I did not become a biologist, nor did I need to. I studied books, discussed problems with colleagues and my supervisor, and gradually learned enough to navigate the field and do the research in front of me.

Data science repeatedly puts me in a similar position. I am often working in a domain where somebody else has deeper subject knowledge. My task is not to pretend that I already possess that expertise. It is to identify what I need to understand, learn it, and become sufficiently fluent to connect the domain problem with the analytical or technical work.

This is another form of calibration. I do not need to master an entire discipline before I can contribute, but I do need enough understanding to recognize when my assumptions are weak and when I should rely on a domain expert.

## Deciding when the work is ready

The phrase “good enough” can sound like an excuse for careless work. I use it to describe work that satisfies its actual purpose without also trying to eliminate every theoretically possible objection.

There is no universal threshold. I judge an application partly by whether it behaves appropriately for what it is meant to do. I judge an analysis by whether its evidence and structure support the intended conclusion. I also consider the deadline, because a more complete answer can still be less valuable if it arrives after the decision.

Applied work gives me another option that research papers rarely did: I can put something into use, observe how it behaves, and improve it. Feedback can show which weakness matters and which concern was only hypothetical. That does not justify releasing work that I know is unreliable. It means that contact with reality can be part of the investigation rather than something that happens only after it is complete.

I shed my academic reflex to pursue completeness surprisingly quickly, and doing so was liberating. I kept the parts of research that still serve me: testing a claim before presenting it, asking how the data was produced, anticipating criticism, and learning my way into unfamiliar domains.

Industry added a question that I did not ask often enough before: what would another week of work change? Sometimes the answer is that it could expose a serious weakness, and I keep investigating. Sometimes it would only make a useful result arrive later. Learning to tell those situations apart has become part of the work itself.
