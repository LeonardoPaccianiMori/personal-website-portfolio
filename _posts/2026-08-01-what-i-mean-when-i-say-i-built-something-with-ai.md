---
layout: post
title: "What I mean when I say I built something with AI"
date: 2026-08-01 16:30:00
description: "AI can write much of the code without assuming responsibility for the problem, the verification, or the result."
tags: ai coding software-development
categories: [thoughts]
featured: false
---

{% comment %}
FIRST-DRAFT NOTE: This draft can be anchored more strongly in Wanderer because that project
already describes its AI-assisted development publicly.
{% endcomment %}

We are in an era now where AI coding agents are inevitable, and they undoubtedly make the life of a coder much easier, provided one knows how to use these tools.

I use AI coding agents as part of how I routinely build software. On most projects they just do the grunt work of putting into code an idea I already have clearly defined in my mind, or retrieveing data with an unfamiliar API (in a fraction of the time it would take me to actually learn the API and use it), or diagnosing a bug that's been eluding me for a while. On others projects these agents produce a substantial share of the code and also assist in the design of the project itself.

In this era, therefore, claiming ownership of a project that involves writing code is less straightforward than it used to be.

The strong polarizing effect that the use of AI causes does not elude software engineers and people who code, with the critiques often arguing that you cannot really claim ownership of your code if you don't know it inside and out, almost like if you could recite every single line of code by heart.

I tend to agree with [this very interesting blog article](https://www.seangoedecke.com/in-defense-of-not-understanding-your-codebase/) by Sean Goedecke, in the sense that knowing the _theory_ of your codebase (and therefore being able, technically, to rewrite the entire codebase from scratch if necessary) is just _one_ way to approach coding, which in some cases is just straight up unreasonable (like in huge projects managed by teams with high turnover rate, as mentioned in the article).

I've seen people generally fall into one of these two extremes, when discussing coding with LLMs:

- using an LLM is merely a faster form of typing, so nothing about authorship has changed
- if an LLM wrote the code, the person directing it did not build _anything_

I think both are reductive, and neither matches my experience: AI changes _where_ the work happens, and this makes it even more important to acknowledge what kind of work we humans actually do.

## Typing was never the whole job

Writing code matters, but software development has never been reducible to producing syntax.

Someone still has to decide:

- what problem the software should solve;
- what behavior counts as correct;
- which constraints matter;
- how the parts should fit together;
- what evidence is sufficient to trust the result;
- which failures are acceptable;
- and when the work is finished.

An AI agent can participate in all of those activities. It does not independently assume responsibility for any of them.

When I say I built something with AI, I mean that I directed a process that included generated code and that I remain accountable for the resulting artifact. That claim is only credible to the extent that I can explain, test, change, and maintain what was produced.

{% comment %}
REVISION SUGGESTION: Decide whether "accountable" captures your actual standard.
If your standard is narrower or stronger, rewrite this paragraph in your own
terms.
{% endcomment %}

## The work moves toward specification

Coding agents are unusually responsive to the quality of the problem definition.

A vague request may produce an impressive-looking result that solves the wrong problem. A detailed request can still fail if the constraints are incomplete or contradictory. The work becomes iterative: describe the behavior, inspect what was produced, identify the mismatch, refine the constraints, and repeat.

This resembles delegation, but with an important difference. A human collaborator brings durable context, professional judgment, and the ability to recognize unstated consequences. An agent often needs those elements to be made explicit, and it can lose them across a long task.

The better the agent becomes at producing code, the more the bottleneck shifts toward deciding what the code should do and recognizing when it only appears to do it.

That is real work. It is not the same work as implementing every component manually.

## Verification becomes the center

Generated code can be plausible, internally consistent, and wrong.

The danger is not limited to obvious bugs. An agent may quietly change an assumption, handle an edge case inconsistently, select a convenient abstraction, or satisfy a test that does not represent the real requirement. Fluency makes these failures easier to miss because the result often looks deliberate.

Using AI responsibly therefore requires more than reading a diff and deciding that it seems reasonable. Verification may include:

- translating the intended behavior into tests;
- checking boundary cases and failure modes;
- comparing outputs with known examples;
- inspecting dependencies and security implications;
- tracing unexpected behavior through unfamiliar code;
- and confirming that apparent improvements did not break something elsewhere.

I do not always perform every one of these steps. The appropriate level depends on the stakes. A small browser experiment and a production application should not be held to identical standards. But the difference in standards should be a conscious decision, not an accidental consequence of how quickly the code appeared.

{% comment %}
REVISION SUGGESTION: Add a concrete verification story. Wanderer could provide
a low-stakes example; a generalized application example could show how your
standard changes when users depend on the result.
{% endcomment %}

## Understanding is not binary

There is a common test for AI-assisted work: "Could you have written it yourself?"

The question points toward something important, but it is too blunt. Developers routinely use libraries, frameworks, examples, generated clients, and abstractions they could not reproduce from first principles. Complete independent reimplementation has never been the threshold for legitimate engineering.

A more useful set of questions is:

- Can I explain the architecture and the important tradeoffs?
- Can I identify the assumptions on which the result depends?
- Can I diagnose a failure without simply asking the agent to try again?
- Can I modify the behavior intentionally?
- Do I know which parts I have not adequately verified?

AI can help me work in languages or areas where my knowledge is incomplete. That is one of its strengths. The honest claim is not that the tool instantly gives me the experience of a specialist. It is that I can use it to produce something functional while being explicit about the limits of my understanding and the level of verification I performed.

## What should be disclosed

I do not think every autocomplete suggestion requires a declaration. I do think AI use should be disclosed when it materially shaped how a project was produced or when that context changes how the work should be evaluated.

The disclosure should be specific enough to be useful. "Built with AI" can mean anything from occasional suggestions to an agent producing nearly all of the initial implementation.

For example:

- What role did the agent play?
- What did I specify or design?
- What did I verify?
- Which parts can I maintain?
- Was the purpose to learn, prototype, or produce a dependable system?

These details avoid both false modesty and inflated ownership.

{% comment %}
REVISION SUGGESTION: Consider replacing the generic disclosure list with the
exact disclosure language you want to use consistently across this website.
That would turn the essay into a standard readers can apply to your projects.
{% endcomment %}

## Responsibility does not transfer

AI makes implementation faster and gives individuals access to capabilities they may not yet possess deeply. That can be productive, educational, and genuinely creative. It can also create the illusion that producing code and understanding a system are the same achievement.

When I say I built something with AI, I am not claiming that the agent was merely a passive tool or that I personally authored every implementation detail. I am claiming responsibility for defining the goal, directing the work, evaluating the result, and being honest about what I do and do not understand.

The code may be generated. The responsibility for deciding whether it is fit for purpose is not.

{% comment %}
FINAL REVISION QUESTIONS:

- Is the distinction between a toy, prototype, and production system strong
  enough?
- Does this accurately describe how you verify agent-written code today, or
  does it describe an aspirational standard?
- Add a direct link to Wanderer if you want the essay grounded in a visible
  example.
- Remove any sentence that sounds like a defense of AI use rather than a candid
  account of your practice.
  {% endcomment %}
