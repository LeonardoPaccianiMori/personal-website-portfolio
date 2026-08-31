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

## Summary

Wanderer is a playable browser gravity sandbox built with JavaScript and Three.js. You can add planets, disturb their motion, follow the centre of mass, lock the camera to a body, switch between preset systems, and change simulation speed.

It is an educational physics toy, not a complete game or a scientific simulator.

## AI-assisted development

I built Wanderer over a few afternoons to learn how to direct and review an AI-assisted interactive project in a language that was new to me. I defined the behaviour, tested the result, and directed revisions. Codex generated much of the implementation.

The useful lesson was the amount of explicit supervision needed around interaction design, physical assumptions, and failure cases. I added dependency-free tests for force symmetry, centre of mass, collision conservation, and numerical integration.

## Physics and limitations

The simulation includes N-body gravity, tidal torques, rotational dynamics, deformable bodies, collision merging, and a kick-drift-kick leapfrog integrator.

Wanderer uses dimensionless units and deliberately exaggerated visual and tidal effects. Its collision, deformation, and tidal models are approximations. Numerical accuracy depends on the timestep and system configuration. The result is designed for exploration and play, not scientific prediction.

The [source code and tests](https://github.com/LeonardoPaccianiMori/portfolio-game-wanderer) are available under the MIT licence.
