---
layout: page
title: projects
permalink: /projects/
description: Selected professional, personal, and experimental projects showing how I approach applied data-science problems.
eyebrow: Evidence in practice
wide: true
nav: true
nav_order: 2
display_categories: [professional, portfolio, experimental]
horizontal: false
---

<nav class="project-category-nav" aria-label="Project categories">
  <a href="#professional">
    <span>01</span>
    <strong>Professional projects</strong>
    <small>Anonymized systems and workflows developed in industry.</small>
  </a>
  <a href="#portfolio">
    <span>02</span>
    <strong>Personal projects</strong>
    <small>End-to-end investigations built independently.</small>
  </a>
  <a href="#experimental">
    <span>03</span>
    <strong>Experimental projects</strong>
    <small>Learning projects, from compact implementations to larger controlled research studies.</small>
  </a>
</nav>

<div class="projects site-project-groups">
  {% if site.enable_project_categories and page.display_categories %}
    {% for category in page.display_categories %}
      {% assign categorized_projects = site.projects | where: 'category', category %}
      {% assign sorted_projects = categorized_projects | sort: 'importance' %}
      <section class="site-project-group" aria-labelledby="{{ category }}-title">
        <header class="site-project-group__header">
          <div>
            <p class="career-eyebrow">
              {% case category %}
                {% when 'professional' %}
                  Work
                {% when 'portfolio' %}
                  Independent
                {% when 'experimental' %}
                  Learning by building
              {% endcase %}
            </p>
            <h2 id="{{ category }}-title">
              {% case category %}
                {% when 'professional' %}
                  Professional projects
                {% when 'portfolio' %}
                  Personal projects
                {% when 'experimental' %}
                  Experimental projects
              {% endcase %}
            </h2>
          </div>
          <p>
            {% case category %}
              {% when 'professional' %}
                Anonymized professional projects, described at a high level with identifying and proprietary details omitted.
              {% when 'portfolio' %}
                Personal projects developed in my own time, from data acquisition and modelling through the final interface.
              {% when 'experimental' %}
                Projects built to understand modelling systems through implementation, controlled experiments, and candid evaluation.
            {% endcase %}
          </p>
        </header>
        <div class="site-project-grid">
          {% for project in sorted_projects %}
            {% include projects.liquid %}
          {% endfor %}
        </div>
      </section>
    {% endfor %}
  {% else %}
    {% assign sorted_projects = site.projects | sort: 'importance' %}
    <div class="site-project-grid">
      {% for project in sorted_projects %}
        {% include projects.liquid %}
      {% endfor %}
    </div>
  {% endif %}
</div>
