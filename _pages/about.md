---
layout: about
title: home
permalink: /
description: Senior Data Scientist building applications for analysts and researchers, with a background in experimental biophysics.
---

<section class="career-hero" aria-labelledby="career-hero-title">
  <div class="career-hero__copy">
    <p class="career-eyebrow">Senior Data Scientist · Applied AI · Analytics</p>
    <h1 id="career-hero-title">I build tools for analysts and researchers.</h1>
    <p class="career-hero__lead">
      I’m <strong>Pinco Pallino</strong>, a Senior Data Scientist at
      <a href="https://www.merkle.com/en/locations/europe/italy.html">Merkle Italy</a>. I build
      applications that help people explore interviews and survey data, and work
      with geographic and structured data. My personal projects also include
      predictive models. I develop and maintain applications, and explain the
      findings to the people who will use them.
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
            {% case project.url %}
              {% when '/projects/italian-real-estate/' %}
                <p class="career-work-card__evidence"><a href="{{ '/projects/italian-real-estate/#explore-the-study' | relative_url }}">Explore the synthetic-study dashboard</a></p>
              {% when '/projects/italian-cuisine/' %}
                <p class="career-work-card__evidence"><a href="{{ '/projects/italian-cuisine/#looking-inside-a-recipe-graph' | relative_url }}">Explore a recipe graph</a></p>
              {% else %}
                <p class="career-work-card__evidence">Internal application; code and interview material are private.</p>
            {% endcase %}
          </div>
        </article>
      {% endif %}
    {% endfor %}
  </div>
</section>

<section class="career-section career-approach" aria-labelledby="approach-title">
  <div class="career-section__heading">
    <p class="career-eyebrow">What interests me</p>
    <h2 id="approach-title">Models, analysis, and the applications around them.</h2>
    <p>
      I’m interested in predictive modelling, analysis that helps people make
      decisions, and applications built with language models. These interests
      often meet in the same project: a model estimates something, an interface
      lets someone inspect it, and the analysis explains how much to trust the result.
    </p>
  </div>
</section>

<section class="career-section career-background" aria-labelledby="background-title">
  <div class="career-background__story">
    <p class="career-eyebrow">Background</p>
    <h2 id="background-title">From experimental biophysics to data science.</h2>
    <p>
      Before moving into industry, I spent four years in experimental biophysics
      at UC San Diego, following earlier research experience at Harvard.
      Working with experiments taught me to ask how a dataset was produced,
      which alternative explanations fit the observations, and what evidence
      would distinguish them.
    </p>
    <p>
      I bring those questions to applied work: whether location data is precise
      enough for an analysis, whether a model’s score measures what matters,
      and how to explain uncertainty to someone making a decision.
      Industry also taught me to match the depth of an investigation to its purpose
      and deadline. I write about that change in
      <a href="{% post_url 2026-07-29-what-research-taught-me-about-applied-data-science %}">my note on research and rigor</a>.
    </p>
  </div>
  <aside class="career-background__aside" aria-label="Work in practice">
    <p class="career-eyebrow">Work in practice</p>
    <ul>
      <li>Interview and survey analysis</li>
      <li>Applications using language models</li>
      <li>Geographic and structured-data analysis</li>
      <li>Prototyping, deployment, and iteration</li>
      <li>Explaining findings to colleagues and clients</li>
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
