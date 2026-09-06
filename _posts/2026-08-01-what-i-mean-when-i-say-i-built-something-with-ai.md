---
layout: post
title: "What I mean when I say I built something with AI"
date: 2026-08-01 16:30:00
description: "Building with AI is not the same as writing every line: it means shaping the project, understanding the system, and standing behind the result."
tags: ai coding software-development
categories: [thoughts]
featured: false
last_updated: 2026-09-06
reading_minutes: 6
---

When I describe [Wanderer]({% link _projects/wanderer.md %}) as something I built, I need to add an important qualification: Codex generated much of its JavaScript and Three.js implementation.

The idea for the gravity sandbox was mine. I defined its behaviour, aesthetic, and interface; tested what the agent produced; and directed revisions as the project developed. After the first version existed, I continued shaping it through rotational effects, tidal forces, preset systems, and tests for core physical behaviour. I also documented where the physics remains an intentional approximation.

That division of work creates a question with no useful one-word answer. Did I write the code? Mostly not. Did I merely request a finished product and accept whatever appeared? No. What, then, am I claiming when I say that I built it?

## The claim is about the project, not every line

For me, building a project means taking responsibility for how an idea becomes a working artifact. I decide what it is for, shape its direction, evaluate what was produced, identify the gap between intention and behaviour, and continue working until I am prepared to stand behind the result.

None of this makes me the sole author of the code. An AI agent can contribute much more than a conventional library. It can propose an architecture, make design decisions, implement features, diagnose failures, and suggest changes I would not have considered. When it does those things, that contribution should be stated rather than hidden behind a vague claim of AI assistance.

Accepting an agent's contribution also does not make every ownership claim meaningless. The important questions are more concrete. Who selected the problem? Who decided which proposals to accept or reject? Who tested the result and directed the revisions? Who can explain its important behaviour, change it intentionally, and accept responsibility when it fails?

The answers can differ from one project to another. “Built with AI” covers everything from occasional suggestions to an agent producing most of an implementation. A useful disclosure has to describe the actual division of labour.

## Direction continues inside the implementation

Directing an agent is not one decision made before the implementation begins. The design continues through contact with the system itself.

I have to run it, inspect what it does, notice where the result differs from what I intended, and decide what should change. The agent may type the revision and may even propose it, but I still have to judge whether the change belongs in the project. A plausible implementation is not automatically the right one.

This is why I find Sean Goedecke's argument in [“You can't design software you don't work on”](https://www.seangoedecke.com/you-cant-design-software-you-dont-work-on/) useful. Design is constrained by the actual system, including details that an abstract plan cannot reveal. AI does not remove that constraint. If anything, generated code makes active inspection more important because the implementation can move faster than my understanding of it.

Wanderer took repeated observation and revision. Much of my contribution sits in that iterative work.

## Understanding has to be sufficient, not complete

I do not know every line of an AI-generated codebase as intimately as I would if I had written it manually. Complete knowledge is also an unrealistic standard for much conventional software work. Programmers rely on libraries, frameworks, generated clients, inherited systems, and code written by other people.

What I need instead is a working theory of the system: what its important parts do, how they relate, and why it behaves as it does. I need to follow the technical reasoning when something fails, question an agent's explanation, evaluate a proposed fix, and make intentional changes. In a language I know, I can intervene manually. In a less familiar ecosystem, I have to be especially careful about the limits of my understanding.

This is where basic programming knowledge still matters. An agent can explain its work fluently even when the explanation is incomplete or wrong. Without enough technical knowledge to test that account, it is easy to confuse a convincing explanation with understanding.

There is also a limit to this argument. A person who gives a vague instruction, accepts the first plausible result, and cannot explain or change it has participated in creating the artifact, but not in the same way as someone who has repeatedly shaped and evaluated it. Initiating the process is not sufficient evidence of technical ownership.

## The tradeoff is real

AI lets me build more and move faster. It also means that I do not acquire the same detailed implementation knowledge that I would gain by doing every task myself.

I accept that tradeoff, but I do not want to disguise it. It matters more when the purpose is to learn an implementation technique in depth. In other cases, the priority may be to test an idea, produce a useful artifact, or explore a system that would otherwise remain outside my current reach.

The professional skills involved also shift. Programming knowledge remains the foundation for inspecting and correcting generated work. Alongside it, more weight falls on specifying a problem, maintaining a system-level model, recognizing incomplete results, selecting among possible implementations, and deciding what evidence is sufficient to trust the outcome.

## How I disclose AI-assisted work

When AI materially shapes a portfolio project, I want its page to make the division of labour intelligible: what I conceived and directed, what the agent implemented or helped design, how I evaluated the result, and which limitations remain.

In Wanderer's case, the disclosure is direct: I defined and shaped the project, while Codex generated much of the code. “Built with AI” is the beginning of that attribution, not a substitute for it.

The boundary will not always be obvious, even to me. As agents take on more of the design and implementation, I will have to keep asking whether my understanding, decisions, and responsibility still justify the word “built.” A clear disclosure lets the reader judge that claim too.
