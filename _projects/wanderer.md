---
layout: page
title: Wanderer
description: Three.js gravity sandbox with tidal interactions
img: assets/img/projects/wanderer/wanderer-thumbnail.png
importance: 3
category: portfolio
---

<div class="row">
    <div class="col-sm mt-3 mt-md-0">
        {% include figure.liquid loading="eager" path="assets/img/projects/wanderer/wanderer-thumbnail.png" title="Wanderer gameplay" class="img-fluid rounded z-depth-1" %}
    </div>
</div>
<div class="caption">
    A screenshot from the game (<i>Shepherd Rings</i> preset)
</div>

**February 2026**

## Summary

Wanderer is a browser-based gravity sandbox built with JavaScript and Three.js. I made it to learn how to direct and review an AI-assisted interactive project: drop planets into a system, disturb their motion, and watch orbital and tidal behaviour emerge in real time. It is closer to a physics toy than a full game, and that was part of the appeal to me.

---

## Why I Made This

I like to unwind with videogames occasionally, and I wanted to learn how far I could take a small idea using an AI coding agent in a language that was new to me. As a child I played the two-dimensional [`planets`](https://launchpad.net/ubuntu/+source/planets) game on Ubuntu, so I wanted to revisit that idea with a three-dimensional twist.

---

## What You Can Do in the Game

The game lets you:

- Add and remove planets
- Follow the system center of mass
- Lock the camera to a specific planet
- Switch between eight preset systems
- Pause, speed up, or slow down time

You can <a href="/wanderer/" target="_blank" rel="noopener noreferrer">play the game in a new tab</a> or open `playground` → `wanderer` in the navigation bar at the top.

---

## Technical Highlights

The physics module includes:

- Real-time N-body simulation
- Tidal torques and rotational dynamics
- Deformable bodies with visible oblateness
- Collision merging with mass and linear-momentum conservation
- A kick-drift-kick leapfrog integrator

The game also includes:

- Interactive placement workflow and camera controls
- Preset systems designed to show different orbital behaviors

---

## What this Project Actually Taught Me

I built Wanderer over a couple of afternoons, with Codex generating much of the implementation while I defined the behaviour, tested the result, and directed revisions. The useful lesson was not that AI could produce code quickly; it was how much explicit supervision was still needed around interaction design, physical assumptions, and failure cases. I later added dependency-free tests for force symmetry, centre of mass, collision conservation, and numerical integration.

---

## Tools Used

| **Area**             | **Tools**  |
| -------------------- | ---------- |
| Vibecoding           | Codex 5.2  |
| Programming language | JavaScript |
| Rendering            | Three.js   |

---

## Limitations

Wanderer uses dimensionless units and deliberately exaggerated visual and tidal effects. Its collision, deformation, and tidal models are approximations, and numerical accuracy depends on the timestep and time scale. It is an educational physics toy, not a validated astronomical simulator.

---

## View the Code

The source code and tests are available on [GitHub](https://github.com/LeonardoPaccianiMori/portfolio-game-wanderer) under the MIT License. Commercial and non-commercial reuse are allowed with the required copyright and license notice.
