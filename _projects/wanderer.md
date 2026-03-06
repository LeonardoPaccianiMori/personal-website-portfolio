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
Wanderer is a browser-based gravity sandbox built with JavaScript and Three.js. The goal was to prototype an interactive physics toy rather than a full game: drop planets into a system, manipulate their motion, and watch orbital and tidal behavior emerge in real time.

---

## Why This Matters
This project sits outside my core data-science work, which is exactly why it earns a place in the portfolio. It shows that I can move into a new technical domain quickly, ship an interactive browser experience, and still care about simulation behavior, controls, and user feedback loops.

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

## Build Notes
I built Wanderer as a fast AI-assisted prototyping exercise, but the work that mattered was still engineering work: defining the simulation rules, shaping the interaction model, and deciding what needed to feel responsive and legible in the browser.

---

## Tools Used

| **Area** | **Tools** |
|----------|-----------|
| Prototyping and editing | Codex 5.2 |
| Programming language | JavaScript |
| Rendering | Three.js |
