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
Wanderer is a browser-based gravity sandbox built with JavaScript and Three.js. I made it because I wanted to learn how to vibecode a small interactive game: drop planets into a system, disturb their motion, and watch orbital and tidal behavior emerge in real time. It is closer to a physics toy than a full game, and that was part of the appeal to me.

---

## Why I Made This
I like to unwind with videogames occasionally, and with the advent of coding tools like Codex I wanted to learn how to vibecode an idea into a simple game. As a kid I used to play a lot with the two-dimensional [`planets`](https://launchpad.net/ubuntu/+source/planets) game on my Ubuntu laptop, so I wanted to recreate something like that, but with a three-dimensional twist.

---

## What You Can Do in the Game
The game allows you to do several different actions, lile:
- Adding and removing planets
- Following the system center of mass
- Locking the camera to a specific planet
- Switching between eight preset systems
- Pausing, speeding up, or slowing down time

You can <a href="/wanderer/" target="_blank" rel="noopener noreferrer">play the game in a new tab</a> or click on `more`→`wanderer (game)` tab in the navigation bar at the top.

---

## Technical Highlights
The game includes simulating several aspects of planetary physics, like:
- Real-time N-body simulation
- Tidal torques and rotational dynamics
- Deformable bodies with visible oblateness

The game also includes:
- Interactive placement workflow and camera controls
- Preset systems designed to show different orbital behaviors

---

## What this Project Actually Taught Me
I built `wanderer` quickly, over the course of a couple of afternoons, with Codex 5.2 writing the code and me directing it and supervising it. This project help me learn how to steer an AI coding agent to write something functional (but simple) in a programming language I was not familiar with.

---

## Tools Used

| **Area** | **Tools** |
|----------|-----------|
| Vibecoding | Codex 5.2 |
| Programming language | JavaScript |
| Rendering | Three.js |
