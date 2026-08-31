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
  - title: technical notes
    permalink: /notes/
    category: technical-notes
  - title: thoughts
    permalink: /thoughts/
    category: thoughts
---

<div class="writing-paths">
  <a href="{{ '/notes/' | relative_url }}">
    <span class="writing-paths__number">01</span>
    <div>
      <p class="career-eyebrow">Technical notes</p>
      <h2>Decisions behind the implementation.</h2>
      <p>Focused decisions and research studies, with project appendices when the complete technical reference is useful.</p>
    </div>
    <span class="writing-paths__arrow" aria-hidden="true">→</span>
  </a>
  <a href="{{ '/thoughts/' | relative_url }}">
    <span class="writing-paths__number">02</span>
    <div>
      <p class="career-eyebrow">Thoughts</p>
      <h2>Reflections beyond the code.</h2>
      <p>Occasional essays on data science, work, evidence, and professional judgement.</p>
    </div>
    <span class="writing-paths__arrow" aria-hidden="true">→</span>
  </a>
</div>

<section class="site-index-section" aria-labelledby="recent-writing-title">
  <header class="site-index-section__header">
    <div>
      <p class="career-eyebrow">Latest</p>
      <h2 id="recent-writing-title">Recent writing</h2>
    </div>
    <a href="{{ '/notes/' | relative_url }}">Browse technical notes <span aria-hidden="true">→</span></a>
  </header>
  {% assign recent_writing = site.posts | sort: 'date' | reverse %}
  {% include writing_list.liquid posts=recent_writing limit=4 empty_message="No writing has been published yet." %}
</section>
