---
layout: page
title: technical notes
permalink: /notes/
description: Focused notes on technical decisions and research studies, with supporting project appendices for readers who want the complete reference.
eyebrow: Writing · Technical
wide: true
nav: false
---

<section class="site-index-section" aria-labelledby="focused-technical-notes-title">
  <header class="site-index-section__header">
    <div>
      <p class="career-eyebrow">Decisions and studies</p>
      <h2 id="focused-technical-notes-title">Focused technical notes</h2>
    </div>
  </header>
  {% assign focused_notes = site.posts | where: 'technical_kind', 'note' %}
  {% include writing_list.liquid posts=focused_notes empty_message="No focused technical notes yet." %}
</section>

<section class="site-index-section" aria-labelledby="project-appendices-title">
  <header class="site-index-section__header">
    <div>
      <p class="career-eyebrow">Supporting references</p>
      <h2 id="project-appendices-title">Project appendices</h2>
    </div>
  </header>
  {% assign project_appendices = site.posts | where: 'technical_kind', 'appendix' %}
  {% include writing_list.liquid posts=project_appendices empty_message="No project appendices yet." %}
</section>
