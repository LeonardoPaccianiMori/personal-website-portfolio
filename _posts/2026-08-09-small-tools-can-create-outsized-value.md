---
layout: post
title: "Small tools can create outsized value"
date: 2026-08-09 10:00:00 +0200
description: "A demonstrated bottleneck can provide a better product brief than an ambitious but hypothetical opportunity."
tags: data-science automation product-thinking
categories: [thoughts]
featured: false
---

Some geographic analyses depend on store coordinates that are inaccurate or inconsistent. Correcting them is not conceptually difficult, but repeated lookups and manual decisions can consume hours before the analysis itself begins.

That kind of problem is easy to underestimate. It is not an ambitious product idea, and solving it does not transform the entire workflow. It is simply a recurring step that takes far more time than it should.

I have learned to take these bottlenecks seriously. When a workflow, its users, and its most expensive repetitive step already exist, much of the product brief is already visible. I know who has the problem, what the tool should improve, and how I might recognize whether it helped.

I identified the recurring coordinate problem and designed and implemented a reusable workflow for it. The tool matched noisy coordinates to more appropriate geographic features, gave each match an interpretable category, and flagged ambiguous cases for review. Work that had taken hours could then be completed in minutes, and the same process could be reused when the problem appeared again.

The narrow scope did not make the implementation trivial. A larger search area could find more possible matches, but it also increased the risk of selecting the wrong one. The workflow therefore used conservative defaults and preserved a manual-review path.

Its value came from removing one expensive preparatory step without pretending to automate the judgment around the complete analysis.

[Cleaning Open-Ended Survey Responses at Scale]({% link _projects/cleaning-open-ended-survey-responses-at-scale.md %}) addressed a different kind of repetitive work.

Brand-awareness surveys contain misspellings, abbreviations, partial names, and several versions of the same brand. Analysts had to build correction dictionaries and standardize those responses before they could use them. For one survey wave, that preparation could take several days.

My role was different here. I helped define the scope, translated the manual process into product requirements, and supervised the development of an LLM-assisted cleaning workflow. A colleague was the primary developer.

Users reported that the resulting application reduced the multi-day process to minutes, and the team began using it for recurring work. Unknown or ambiguous mappings still required review. The application accelerated the mechanical part of the process while keeping uncertain decisions visible to the analyst.

The two tools used different methods, and I had different responsibilities in their development. What they shared was a demonstrated bottleneck. Neither began with a search for something impressive to build. Each began with work that people were already doing and a specific reason that work was taking too long.

An existing bottleneck answers questions that speculative product ideas often leave open:

- Who will use the tool?
- Which step should become faster or more dependable?
- What behaviour counts as correct?
- Where must a person remain involved?
- What will improve if the tool works?

These answers do not guarantee adoption or quality. They do, however, give the project a concrete basis for defining success. A proposed feature can be judged by whether it removes the constraint rather than by whether it makes the system appear more complete.

This is why I now see a demonstrated bottleneck as more than an inconvenience. It can be a better starting point than a broad opportunity whose users, workflow, and practical value are still hypothetical.

Broader applications can create substantial value, and exploratory prototypes can be useful even before their final users are known. A prototype may exist to answer whether an approach can work or whether an interaction is worth developing.

The problem begins when exploration moves towards delivery without ever making its purpose concrete. Adding capabilities then increases what the system can do without clarifying why anybody needs it.

When I consider where automation might help, I now start with the work rather than the technology. Where does time disappear? Which part is repetitive? Which decisions require real judgment, and which steps merely stand in their way?

Sometimes those questions lead to an ambitious system. Sometimes they lead to one carefully bounded tool that returns hours or days to the people already doing the work. That is often enough to make the tool worth building.
