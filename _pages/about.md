---
layout: about
title: home
permalink: /
description: Senior Data Scientist working across applied AI, analytics, and decision-support systems.
---

<section class="career-hero" aria-labelledby="career-hero-title">
  <div class="career-hero__copy">
    <p class="career-eyebrow">Senior Data Scientist · Applied AI · Analytics</p>
    <h1 id="career-hero-title">Applied AI and analysis for practical decisions.</h1>
    <p class="career-hero__lead">
      I’m <strong>Pinco Pallino</strong>, a Senior Data Scientist at
      <a href="https://www.merkle.com/en/locations/europe/italy.html">Merkle Italy</a>. I work across
      data analysis, geographic questions, and applications built around language models.
      My work ranges from preparing evidence for a decision to developing and
      maintaining the tools people use to explore it.
    </p>
    <div class="career-actions" aria-label="Primary links">
      <a class="career-button career-button--primary" href="#selected-work">
        Explore selected work <span aria-hidden="true">↓</span>
      </a>
      <a class="career-button career-button--secondary" href="mailto:leonardopaccianimori@gmail.com">Email me</a>
    </div>
    <div class="career-socials" aria-label="Professional profiles">
      <a href="https://www.linkedin.com/in/leonardo-pacciani-mori">LinkedIn <span aria-hidden="true">↗</span></a>
      <a href="https://github.com/LeonardoPaccianiMori">GitHub <span aria-hidden="true">↗</span></a>
      <a href="{{ '/writing/' | relative_url }}">Writing <span aria-hidden="true">→</span></a>
    </div>
  </div>
  <figure class="career-portrait">
    <img
      src="{{ '/assets/img/profile.png' | relative_url }}"
      alt="Portrait of Pinco Pallino"
      width="640"
      height="640"
      fetchpriority="high"
    >
    <figcaption>Based in Italy, working remotely.</figcaption>
  </figure>
</section>

<section id="selected-work" class="career-section career-selected" aria-labelledby="selected-work-title">
  <div class="career-section__heading career-section__heading--row">
    <div>
      <p class="career-eyebrow">Selected work</p>
      <h2 id="selected-work-title">A few representative projects.</h2>
    </div>
    <a class="career-text-link" href="{{ '/projects/' | relative_url }}">View every project <span aria-hidden="true">→</span></a>
  </div>

{% assign featured_urls = "/projects/accelerating-qualitative-interview-analysis/|/projects/italian-real-estate/|/projects/italian-cuisine/" | split: "|" %}

  <div class="career-work-grid">
    {% for featured_url in featured_urls %}
      {% assign project = site.projects | where: "url", featured_url | first %}
      {% if project %}
        <article class="career-work-card">
          <a class="career-work-card__image" href="{{ project.url | relative_url }}" tabindex="-1" aria-hidden="true">
            <img src="{{ project.img | relative_url }}" alt="" loading="lazy">
          </a>
          <div class="career-work-card__body">
            <p class="career-work-card__type">
              {% case project.category %}
                {% when "professional" %}Professional project
                {% when "portfolio" %}Personal project
                {% when "experimental" %}Experimental project
                {% when "games" %}Game project
                {% else %}Project
              {% endcase %}
            </p>
            <h3><a href="{{ project.url | relative_url }}">{{ project.title }}</a></h3>
            <p>{{ project.description }}</p>
            <p class="career-work-card__role">{{ project.card_role }}</p>
            <a class="career-text-link" href="{{ project.url | relative_url }}">Read the case study <span aria-hidden="true">→</span></a>
          </div>
        </article>
      {% endif %}
    {% endfor %}
  </div>
</section>

<section class="career-section career-approach" aria-labelledby="approach-title">
  <div class="career-section__heading">
    <p class="career-eyebrow">How I work</p>
    <h2 id="approach-title">The useful output shapes the work.</h2>
    <p>
      In <a href="{{ '/projects/accelerating-qualitative-interview-analysis/' | relative_url }}">interview analysis</a>,
      researchers needed a first report, so I rebuilt the application around that document.
      In <a href="{{ '/projects/italian-real-estate/' | relative_url }}">real estate</a>,
      the dashboard needed geographic relationships that plausible-looking synthetic columns did not preserve.
      Those concrete requirements guide what I build, what I test, and what I change after review.
    </p>
  </div>
</section>

<section class="career-section career-background" aria-labelledby="background-title">
  <div class="career-background__story">
    <p class="career-eyebrow">Background</p>
    <h2 id="background-title">Research discipline, industry focus.</h2>
    <p>
      Before moving into industry, I spent four years conducting experimental
      biophysics research at UC San Diego, following earlier experience at
      Harvard. That work still shapes how I approach data science: I care about
      experimental design, traceable reasoning, and whether an analysis can
      survive contact with messy real-world data.
    </p>
    <p>
      Industry changed how I decide when work is ready: the evidence has to support
      its intended use, and the answer has to arrive in time to matter.
      I explore that change in <a href="{% post_url 2026-07-29-what-research-taught-me-about-applied-data-science %}">my note on research and rigor</a>.
    </p>
  </div>
  <aside class="career-background__aside" aria-label="Current focus">
    <p class="career-eyebrow">Current focus</p>
    <ul>
      <li>Analytics and decision-support systems</li>
      <li>LLM and agentic applications</li>
      <li>Geospatial and structured-data analysis</li>
      <li>Prototyping, deployment, and iteration</li>
      <li>Technical communication with stakeholders</li>
    </ul>
  </aside>
</section>

<section class="career-closing" aria-labelledby="closing-title">
  <div>
    <p class="career-eyebrow">Contact and writing</p>
    <h2 id="closing-title">Get in touch about the work.</h2>
  </div>
  <p>
    You can <a href="mailto:leonardopaccianimori@gmail.com">email me</a> or read
    <a href="{% post_url 2025-05-15-synthetic-data-ctgan %}">why I rejected a synthetic-data model</a>
    and <a href="{% post_url 2026-08-09-small-tools-can-create-outsized-value %}">what small tools can change</a>.
  </p>
  <a class="career-button career-button--secondary" href="{{ '/writing/' | relative_url }}">Browse writing</a>
</section>
