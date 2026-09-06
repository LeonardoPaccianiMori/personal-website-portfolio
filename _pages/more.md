---
layout: page
title: playground
permalink: /more/
nav: true
nav_order: 4
dropdown: true
children:
  - title: wanderer
    permalink: /wanderer/
    new_tab: true
---

## Experiments you can play with

Wanderer is a browser gravity sandbox. Add a body, disturb an orbit, or start with a prepared system and see how it changes. I directed and reviewed the project; Codex generated much of its implementation.

<div class="site-project-grid">
  {% assign project = site.projects | where: 'url', '/projects/wanderer/' | first %}
  {% include projects.liquid %}
</div>

The sandbox uses keyboard and mouse controls. Its physics is approximate; the case study explains the assumptions and the tests.
