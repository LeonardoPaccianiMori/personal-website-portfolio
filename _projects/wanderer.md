---
layout: page
title: Wanderer
description: Three.js gravity sandbox with tidal interactions
img: assets/img/projects/wanderer/wanderer-thumbnail.png
importance: 1
category: games
github: https://github.com/LeonardoPaccianiMori/portfolio-game-wanderer
play_url: /wanderer/
project_overview:
  status: Playable · Completed
  period: February 2026
  role: Defined the behaviour, tested the result, and directed revisions; Codex generated much of the implementation
  outcome: Produced a browser gravity sandbox and dependency-free tests for core physics behaviour.
  evidence: Playable demo, source code, tests, and MIT licence.
project_actions:
  - label: Play Wanderer
    url: /wanderer/
    style: primary
    external: false
  - label: View code
    url: https://github.com/LeonardoPaccianiMori/portfolio-game-wanderer
    style: secondary
    external: true
---

<div class="row">
  <div class="col-sm mt-3 mt-md-0">
    {% include figure.liquid loading="eager" path="assets/img/projects/wanderer/wanderer-thumbnail.png" title="Wanderer gameplay" class="img-fluid rounded z-depth-1" %}
  </div>
</div>
<div class="caption">
  A screenshot from the game (<i>Shepherd Rings</i> preset)
</div>

## A sandbox for disturbing orbits

Wanderer gives you a small planetary system and permission to interfere with it. You can add bodies, disturb their motion, follow the centre of mass, attach the camera to a planet, change the simulation speed, or begin from one of several prepared systems.

It is a browser-based physics toy built with JavaScript and Three.js. The interesting part is not winning. It is watching a stable-looking system change after one small intervention.

## Learning to direct AI-generated code

I developed Wanderer over a few afternoons as an experiment in directing and reviewing an interactive project in a language that was new to me. I defined the behaviour, tested what Codex produced, and directed the revisions; Codex generated much of the implementation.

The process required more than describing the desired visual result. Interaction details, physical assumptions, and failure cases all needed explicit review. I added dependency-free tests for force symmetry, centre of mass, collision conservation, and numerical integration so that the core behaviour could be checked outside the visual simulation.

## Physics that can be played with

Under the interface are N-body gravity, tidal torques, rotational dynamics, deformable bodies, collision merging, and a kick-drift-kick leapfrog integrator.

The simulation uses dimensionless units and deliberately exaggerates some visual and tidal effects. Its collision, deformation, and tidal models are approximations, and numerical accuracy depends on the timestep and selected system.

Wanderer is meant for exploration rather than scientific prediction. You can [play it in the browser](/wanderer/) or inspect the [source code and tests](https://github.com/LeonardoPaccianiMori/portfolio-game-wanderer), which are available under the MIT licence.
