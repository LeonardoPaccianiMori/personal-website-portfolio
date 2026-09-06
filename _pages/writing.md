---
layout: page
title: writing
permalink: /writing/
description: Focused technical decisions, research studies, supporting project references, and reflections on evidence, uncertainty, and useful data science.
eyebrow: Notes from the work
wide: true
nav: true
nav_order: 3
dropdown: true
children:
  - title: all writing
    permalink: /writing/
  - title: technical notes
    permalink: /notes/
    category: technical-notes
  - title: thoughts
    permalink: /thoughts/
    category: thoughts
---

<section class="site-index-section" aria-labelledby="start-writing-title">
  <header class="site-index-section__header">
    <div>
      <p class="career-eyebrow">Start here</p>
      <h2 id="start-writing-title">Three ways into the work.</h2>
    </div>
  </header>
  {% assign selected_slugs = 'synthetic-data-ctgan|a-narrow-win-that-did-not-make-a-good-poet|small-tools-can-create-outsized-value' | split: '|' %}
  {% for selected_slug in selected_slugs %}
    {% assign selected_posts = site.posts | where: 'slug', selected_slug %}
    {% include writing_list.liquid posts=selected_posts %}
  {% endfor %}
</section>

<div class="writing-paths">
  <a href="{{ '/notes/' | relative_url }}">
    <span class="writing-paths__number">01</span>
    <div>
      <p class="career-eyebrow">Technical notes</p>
      <h2>Choices, experiments, and results.</h2>
      <p>Browse by project, from a focused decision to its full technical reference.</p>
    </div>
    <span class="writing-paths__arrow" aria-hidden="true">→</span>
  </a>
  <a href="{{ '/thoughts/' | relative_url }}">
    <span class="writing-paths__number">02</span>
    <div>
      <p class="career-eyebrow">Thoughts</p>
      <h2>What the work has changed for me.</h2>
      <p>Research and industry, small tools, and responsibility for AI-assisted work.</p>
    </div>
    <span class="writing-paths__arrow" aria-hidden="true">→</span>
  </a>
</div>
