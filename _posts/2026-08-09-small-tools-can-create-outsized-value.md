---
layout: post
title: "Small tools can create outsized value"
date: 2026-08-09 00:01:00 +0200
description: "A narrowly scoped tool can create substantial value when it removes a repetitive bottleneck without trying to replace the judgment around it."
tags: data-science automation product-thinking
categories: [thoughts]
featured: false
---

Some of the most useful tools I have worked on have had modest ambitions. They did not try to transform an entire profession or anticipate every need their users might ever have. Each did one specific thing that had previously consumed far too much time.

That narrowness was not a limitation to overcome. It was one of the reasons the tools could create value.

A technically impressive system can still be useless if nobody can say precisely what it is for. By contrast, an existing workflow with a repetitive bottleneck often provides a user, a problem, and a way to recognize improvement. The tool may be small in scope, but the time it returns can be substantial.

## Small does not mean technically trivial

I use “small” to describe the boundary of the problem, not the difficulty of the implementation.

A tool that performs one task may still need careful engineering. It must handle imperfect inputs, make its behaviour understandable, expose uncertain cases, and produce outputs that fit the next step in the workflow. A narrow scope does not remove these requirements. It makes them easier to state.

The distinction matters because technical ambition and practical value are not the same measure. More features, a broader interface, or a more sophisticated architecture may make a project look substantial. They do not establish that it solves a problem someone actually has.

Two work projects made this especially clear to me.

## Removing hours from data preparation

Some geographic analyses depend on store coordinates that may be inaccurate or inconsistent. Preparing those locations for analysis involved slow lookups and manual correction—a conceptually understandable task that could nevertheless take hours.

I identified the recurring problem and designed and implemented a reusable workflow to address it. The tool matched noisy coordinates to more appropriate geographic features, made its match categories interpretable, and flagged ambiguous cases for review. What had taken hours could then be completed in minutes, and the workflow could be reused when the same problem appeared again.

The value did not come from automating an entire geographic analysis. It came from removing one expensive preparatory step that stood in the way of that analysis.

Its narrow scope also made the limits clearer. A larger search area could find more possible matches while increasing the risk of choosing the wrong one. The workflow therefore used conservative defaults and preserved a path for manual review. Automation accelerated the repeated work without pretending that every location could be resolved mechanically.

## Removing days from survey cleaning

[Cleaning Open-Ended Survey Responses at Scale]({% link _projects/cleaning-open-ended-brand-responses-at-scale.md %}) addressed a different but structurally similar bottleneck.

Brand-awareness surveys contain free-text answers with misspellings, abbreviations, partial names, and multiple variants of the same brand. Before analysts could use those responses, they had to build correction dictionaries and standardize the text manually. That mechanical preparation could take several days for a survey wave.

I helped define the scope, translate the existing manual process into product requirements, and supervise the development of an LLM-assisted cleaning workflow. I was not its primary developer. Users reported that the resulting application reduced the multi-day process to minutes; it then entered active use by the team whose workflow it supported.

Here too, the goal was not to eliminate judgment. Unknown or ambiguous mappings still needed review. The tool automated the repetitive part of the process and made its outputs inspectable, freeing the analysts from much of the mechanical cleaning so they could spend their time on higher-value work.

## Existing bottlenecks make value visible

These examples share more than a small scope. In both cases, the users and the workflow already existed. The bottleneck was demonstrated rather than hypothetical.

That makes several important questions easier to answer. Who will use the tool? Which step should become faster? What behaviour counts as correct? Where must a person remain involved? What would improve if the tool worked?

When those answers are unclear, it is possible to build something sophisticated, polished, and ultimately useless. There is no stable definition of success because the project has not established which problem it is trying to solve.

A well-defined bottleneck provides a much stronger starting point. It does not guarantee adoption or quality, but it connects implementation choices to an observable need. Features can be evaluated by whether they help remove the constraint rather than by whether they make the tool appear more complete.

## This is not an argument against ambition

Not every valuable project begins as a narrow automation, and this is not the only way I approach building tools. Broader applications can create substantial value, while exploratory prototypes can help discover whether an idea is technically or practically viable.

An exploratory prototype can have an open-ended implementation while still possessing a clear scope: its purpose may be to answer “Can this approach work?” or “Would this interaction be useful?” Exploration becomes a problem only when a project moves toward delivery without ever deciding what the actual tool is supposed to do.

At that point, ambition needs boundaries. The intended users, workflow, behaviour, and purpose must become concrete enough to guide the work. Otherwise, adding capabilities only increases the number of things the project can do without clarifying why anyone needs it.

## Start by looking for the bottleneck

When considering where automation might help, one productive place to look is an existing workflow that people already understand. Which step is repetitive? Which part consumes disproportionate time? Which activity is necessary but does not require the full judgment of the person performing it?

Sometimes the answer calls for an ambitious system. Sometimes it calls for one carefully bounded tool that does one job well, preserves human review where it matters, and gives people their time back.

The size of the solution is not the size of its value.
