---
layout: page
title: Wanderer
description: Vibecoded Three.js gravity sandbox where you spawn planets, bend orbits, and drift through a living system
img: assets/img/projects/wanderer/wanderer-thumbnail.png
importance: 2
category: portfolio
---

<div class="row">
    <div class="col-sm mt-3 mt-md-0">
        {% include figure.liquid loading="eager" path="assets/img/projects/wanderer/wanderer-thumbnail.png" title="Wanderer gameplay" class="img-fluid rounded z-depth-1" %}
    </div>
</div>
<div class="caption">
    A snapshot from the Wanderer gravity sandbox.
</div>

**November 2025**

## Overview
Wanderer is a vibecoding experiment that turned into a playable 3D gravity sandbox. Spawn planets, adjust their mass and velocity, and watch orbits emerge, destabilize, and reorganize in real time. The focus is on feel, experimentation, and visual feedback instead of strict realism.

<a href="/wanderer/" target="_blank" rel="noopener noreferrer">Play the game in a new tab</a>.

---

## Controls (Quick)
- E to add a planet, Q for a random planet.
- Click to delete, Alt+Click to follow a planet.
- WASD to move the camera, Alt+WASD to rotate, Scroll to zoom or resize.
- Space to pause, C/V to slow or speed time, T to toggle trails.

---

## Tech Stack
- Three.js (module build via CDN)
- Custom N-body physics loop
- Trail rendering and camera controls
- Lightweight UI overlay with live stats

---

## What I Learned
- Small tweaks to time scale and damping can change the whole feel of a physics sandbox.
- Camera controls and visual cues make complex motion understandable.
- Vibecoding works best when the feedback loop is immediate and visual.
