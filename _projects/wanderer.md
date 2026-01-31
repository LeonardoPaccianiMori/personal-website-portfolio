---
layout: page
title: Wanderer
description: Three.js gravity sandbox with tidal interactions
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
    A screenshot from the game (<i>Shepherd Rings</i> preset)
</div>

**February 2026**

## Overview
I’ve always liked videogames, and even though I’m not a game developer, I thought for a long time that I would have loved to build one as a hobby. However, nor being familiar with game engines or with programming languages other than Python (which is not really the first choice for game development), I've always felt an obstacle and never really felt the steep learning curve required to build games was worth the effort.

Now, with the rise of coding LLMs and agents, creating software with minimal prior experience feels more possible than ever.

Therefore, I decided to try vibecoding and make a small game for fun. As a kid, I spent a lot of time on the old Ubuntu [`planets`](https://manpages.ubuntu.com/manpages/focal/man1/planets.1.html) game, so I set out to build a modern 3D version with extra features and more depth.

The result is a gravity sandbox where you can drop in planets, shape their motion and rotation, and watch tidal effects and orbital dynamics emerge in real time.

The entire game was vibecoded in a couple of afternoons.

You can <a href="/wanderer/" target="_blank" rel="noopener noreferrer">play the game in a new tab</a> or click the `wanderer (game)` tab in the navigation bar at the top.

---

## What you can do
- Add/remove planets
- Follow the system's center of mass
- Follow a specific planet
- Choose between 8 preset systems

---

## Technical highlights
- Real‑time N‑body simulation
- Tidal torques + rotational dynamics
- Deformable bodies (oblateness)
- Interactive placement workflow and camera controls

---

## Tools Used

| **Area** | **Tools** |
|----------|-----------|
| Code writing and editing | Codex 5.2 |
| Programming language | JavaScript, Three.js |
