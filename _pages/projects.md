---
layout: page
title: projects
permalink: /projects/
description: Applications, analyses, and experiments, with my contribution and the available evidence stated for each.
eyebrow: Evidence in practice
wide: true
nav: true
nav_order: 2
display_categories: [professional, portfolio, experimental, games]
horizontal: false
---

<nav class="project-category-nav" aria-label="Project categories">
  <a href="#professional">
    <span>01</span>
    <strong>Professional projects</strong>
    <small>Systems and workflows developed in industry.</small>
  </a>
  <a href="#portfolio">
    <span>02</span>
    <strong>Personal projects</strong>
    <small>Independent data and modelling investigations.</small>
  </a>
  <a href="#experimental">
    <span>03</span>
    <strong>Experimental projects</strong>
    <small>Model comparisons and research studies.</small>
  </a>
  <a href="#games">
    <span>04</span>
    <strong>Games</strong>
    <small>Playable experiments, with AI contributions stated.</small>
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
                {% when 'games' %}
                  Playable systems
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
                {% when 'games' %}
                  Games
              {% endcase %}
            </h2>
          </div>
          <p>
            {% case category %}
              {% when 'professional' %}
                Public summaries of internal work. Code and client data remain private.
              {% when 'portfolio' %}
                Projects I implemented from data collection through analysis and presentation.
              {% when 'experimental' %}
                Experiments with inspectable results, including failed configurations and substantial AI assistance where stated.
              {% when 'games' %}
                Playable experiments, with AI contributions stated.
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
