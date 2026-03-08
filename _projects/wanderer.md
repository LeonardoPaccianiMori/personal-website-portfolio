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
Wanderer is a browser-based gravity sandbox built with JavaScript and Three.js. I made it because I wanted a small interactive world I could poke at: drop planets into a system, disturb their motion, and watch orbital and tidal behavior emerge in real time. It is closer to a physics toy than a full game, and that was part of the appeal.

---

## Why I Made This
Most of my portfolio lives in data science, which is exactly why I wanted one project that did not. I liked the idea of working on something immediate and visual, where the feedback loop was not a metric or a notebook but a moving system that either felt convincing or did not.

---

## What You Can Do
- Add and remove planets
- Follow the system center of mass
- Lock the camera to a specific planet
- Switch between eight preset systems
- Pause, speed up, or slow down time

You can <a href="/wanderer/" target="_blank" rel="noopener noreferrer">play the game in a new tab</a> or click the `wanderer (game)` tab in the navigation bar at the top.

---

## Technical Highlights
- Real-time N-body simulation
- Tidal torques and rotational dynamics
- Deformable bodies with visible oblateness
- Interactive placement workflow and camera controls
- Preset systems designed to show different orbital behaviors

---

## What the Prototype Actually Taught Me
I built Wanderer quickly, with AI helping on the prototyping side, but the interesting part was still the engineering judgment. The prototype forced me to decide which parts of the simulation had to feel physically suggestive, which parts could be simplified, and what kinds of controls made the system legible instead of chaotic.

---

## Tools Used

| **Area** | **Tools** |
|----------|-----------|
| Prototyping and editing | Codex 5.2 |
| Programming language | JavaScript |
| Rendering | Three.js |
