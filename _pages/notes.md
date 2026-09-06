---
layout: page
title: technical notes
permalink: /notes/
description: Focused notes on technical decisions and research studies, with supporting project appendices for readers who want the complete reference.
eyebrow: Writing · Technical
wide: true
nav: false
---

{% assign project_slugs = 'italian-real-estate|italian-cuisine|image-generation|transformer-poetry' | split: '|' %}
{% for project_slug in project_slugs %}
{% assign project_url = project_slug | prepend: '/projects/' | append: '/' %}
{% assign project = site.projects | where: 'url', project_url | first %}
{% assign project_posts = site.posts | where: 'project_slug', project_slug %}
{% assign focused_notes = project_posts | where: 'technical_kind', 'note' | sort: 'date' %}
{% assign appendices = project_posts | where: 'technical_kind', 'appendix' %}

  <section class="site-index-section" aria-labelledby="{{ project_slug }}-notes-title">
    <header class="site-index-section__header">
      <div>
        <h2 id="{{ project_slug }}-notes-title">{{ project.title }}</h2>
        <a href="{{ project.url | relative_url }}">Project overview <span aria-hidden="true">→</span></a>
      </div>
    </header>
    {% if focused_notes.size > 0 %}
      {% include writing_list.liquid posts=focused_notes %}
    {% endif %}
    {% if appendices.size > 0 %}
      {% include writing_list.liquid posts=appendices %}
    {% endif %}
  </section>
{% endfor %}
