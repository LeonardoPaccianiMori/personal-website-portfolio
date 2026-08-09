---
layout: post
title: "What I mean when I say I built something with AI"
date: 2026-08-01 16:30:00
description: "Building with AI is not the same as writing every line: it means shaping the project, understanding the system, and standing behind the result."
tags: ai coding software-development
categories: [thoughts]
featured: false
---

AI coding agents are becoming difficult to avoid, and they undoubtedly make a coder's life easier—provided one knows how to use them.

I use them routinely when I build software. Often, they do the grunt work of translating an idea I already have into code, helping me explore and integrate an unfamiliar API while I validate the result, or diagnosing a bug that has eluded me. On other projects, agents produce a substantial share of the code and also assist with the design itself.

In this environment, claiming ownership of a project that involves code is less straightforward than it used to be. Discussions about coding with LLMs tend to polarise around two extremes:

- using an LLM is merely a faster form of typing, so nothing about authorship has changed;
- if an LLM wrote the code, the person directing it did not build anything.

Both positions are reductive, and neither matches my experience. AI changes where the work happens. When I say that I built something with AI, I am not claiming to be the sole author of its code. I am claiming to be the builder of the project.

## Builder does not mean sole code author

For me, building a project means shaping it from an idea into a working system. I conceive its purpose, define or select its direction, decide what the result should look and feel like, direct the implementation, evaluate what was produced, and remain responsible for the outcome.

This does not mean every design decision must originate fully formed in my mind. An agent can propose an architecture, point out a constraint I missed, or suggest an implementation I would not have considered. I can accept those contributions without surrendering ownership, just as using a library or discussing a design with another person does not automatically make a project someone else's. What matters is whether I can understand the proposal, judge it, integrate it into the larger project, and deal with its consequences.

The opposite case is also possible. Someone can describe a vague idea, accept the first plausible result, and end up with working software they cannot explain, diagnose, or change intentionally. The fact that they initiated the process is not enough, by itself, to support the same claim.

## Understanding does not require memorising the codebase

One common objection is that you cannot claim to have built code you do not know inside and out. I agree with Sean Goedecke's argument in [“In defense of not understanding your codebase”](https://www.seangoedecke.com/in-defense-of-not-understanding-your-codebase/) that this treats complete understanding as a standard that much real software work cannot meet.

Programmers work with other people's code, libraries, frameworks, generated clients, inherited systems, and abstractions they could not reproduce from first principles. Large codebases are too extensive for any one person to understand completely. What engineers maintain instead is a theory of the system: an imperfect but useful mental model of what it does, how its important parts relate, and why it behaves as it does.

AI changes how that theory is acquired. When an agent writes much of the initial implementation, I may not develop the same line-by-line familiarity I would gain from writing it manually. But I still need a working theory of the result. I need to understand the architecture and the important code paths, follow the technical reasoning when something fails, evaluate a proposed fix, and make intentional changes. In a language I know, I can also intervene manually when needed. More often, I continue directing the agent because it is faster—but I remain responsible for judging what it changes.

This is also why basic programming competence still matters. An agent can explain its own work fluently even when its explanation is incomplete or wrong. Without enough technical knowledge to question that explanation, it becomes much harder to distinguish understanding from merely accepting a convincing account.

## You still have to work on the actual system

Partial understanding is not an excuse for detachment. For large, existing systems, Goedecke makes the complementary argument in [“You can't design software you don't work on”](https://www.seangoedecke.com/you-cant-design-software-you-dont-work-on/): useful design is constrained by the concrete details of the system, not only by an abstract understanding of the problem.

AI does not remove that constraint. Directing an agent is not a single act performed before implementation begins. It is an iterative engagement with the artifact itself: run it, inspect how it behaves, identify the mismatch between intention and result, understand what must change, and repeat. The agent may do the typing and propose the fix, but the design continues through those concrete decisions.

[Wanderer]({% link _projects/wanderer.md %}) is the clearest public example currently in my portfolio. The idea for the gravity sandbox, its aesthetic, and its interface were mine. Codex generated much of the JavaScript and Three.js implementation in a language and ecosystem that were new to me. But the project did not emerge from one prompt. After the initial game existed, I continued shaping it by introducing rotational effects, tidal forces, and preset systems. I evaluated its behaviour, directed revisions, added tests around core physical properties, and documented where its models remain deliberate approximations.

That division of labour is precisely what I mean by building with AI. I did not personally type most of Wanderer's implementation. I did determine what the project became, remain able to modify it, and stand behind the claims I make about it.

## The tradeoff I accept

There is a real cost to this way of working. Goedecke argues in [“Software engineering may no longer be a lifetime career”](https://www.seangoedecke.com/software-engineering-may-no-longer-be-a-lifetime-career/) that using AI to perform a task means learning less about performing that particular task yourself. I understand the concern.

AI allows me to build more and move faster, but I do not acquire the same detailed grasp of every implementation that I would have gained without it. I accept that as a tradeoff. Refusing to acknowledge it would be as misleading as claiming that AI users contribute nothing.

I also expect the relevant professional skill set to change. Programming knowledge does not disappear: it remains the foundation that lets us inspect, challenge, and correct generated work. But more value moves toward specifying problems precisely, maintaining a system-level theory, recognizing incorrect or incomplete results, selecting among possible implementations, and deciding what evidence is sufficient to trust the outcome. For engineers and data scientists, that is a shift in technical judgment, not the end of technical judgment.

## How to read my project claims

I intend this post to serve as a living reference for AI-assisted work in my portfolio. When AI materially shaped a project, its page should make the division of labour intelligible: what I conceived and directed, what the agent implemented or helped design, how I evaluated and changed the result, what I can explain and maintain, and which limitations remain.

That disclosure matters because “built with AI” covers an enormous range. It can describe occasional autocomplete suggestions, an agent producing most of an initial implementation, or nearly everything in between. Hiding the agent's contribution would inflate my authorship. Treating the project as though I contributed nothing would erase the decisions that turned generated code into a specific artifact.

So when I say I built something with AI, I am making a narrower and more concrete claim than “I wrote this code.” I shaped the project from intention to working system, stayed engaged with its implementation, maintained enough understanding to direct and change it, evaluated the result, and accepted responsibility for what I published.

The agent may be the principal author of the code. That does not automatically make it the builder of the project.
