---
layout: about
title: home
permalink: /
description: Senior Data Scientist working across applied AI, analytics, and decision-support systems.
---

<section class="career-hero" aria-labelledby="career-hero-title">
  <div class="career-hero__copy">
    <p class="career-eyebrow">Senior Data Scientist · Applied AI · Analytics</p>
    <h1 id="career-hero-title">Complex data. Clear decisions. Useful systems.</h1>
    <p class="career-hero__lead">
      I’m <strong>Pinco Pallino</strong>, a Senior Data Scientist at
      <a href="https://www.merkle.com/en/locations/europe/italy.html">Merkle Italy</a>. I work across
      analytics, geospatial analysis, LLM/RAG applications, solution
      prototyping, and the communication that turns technical work into
      decisions.
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
    <figcaption>Based in Padova, working remotely with teams in Italy and abroad.</figcaption>
  </figure>
</section>

<section class="career-section career-approach" aria-labelledby="approach-title">
  <div class="career-section__heading">
    <p class="career-eyebrow">How I work</p>
    <h2 id="approach-title">From an unclear question to something people can use.</h2>
    <p>
      My academic background taught me to be careful with evidence and
      uncertainty. Industry taught me that rigorous work matters most when it
      reaches the people making the decision.
    </p>
  </div>
  <div class="career-principles">
    <article>
      <span class="career-principle__number">01</span>
      <h3>Frame the problem</h3>
      <p>Clarify the decision, the available evidence, and what a useful result would actually change.</p>
    </article>
    <article>
      <span class="career-principle__number">02</span>
      <h3>Build the evidence</h3>
      <p>Combine data, models, retrieval, and custom methods without hiding uncertainty or inconvenient details.</p>
    </article>
    <article>
      <span class="career-principle__number">03</span>
      <h3>Deliver for use</h3>
      <p>Turn the analysis into an application, workflow, dashboard, or explanation that can survive real use.</p>
    </article>
  </div>
</section>

<section id="selected-work" class="career-section career-selected" aria-labelledby="selected-work-title">
  <div class="career-section__heading career-section__heading--row">
    <div>
      <p class="career-eyebrow">Selected work</p>
      <h2 id="selected-work-title">A few representative projects.</h2>
    </div>
    <a class="career-text-link" href="{{ '/projects/' | relative_url }}">View every project <span aria-hidden="true">→</span></a>
  </div>

{% assign featured_titles = "Accelerating Qualitative Interview Analysis|Finding Profitable Real Estate in Italy|A Look Into Italian Cuisine" | split: "|" %}

  <div class="career-work-grid">
    {% for featured_title in featured_titles %}
      {% assign project = site.projects | where: "title", featured_title | first %}
      {% if project %}
        <article class="career-work-card">
          <a class="career-work-card__image" href="{{ project.url | relative_url }}" tabindex="-1" aria-hidden="true">
            <img src="{{ project.img | relative_url }}" alt="" loading="lazy">
          </a>
          <div class="career-work-card__body">
            <p class="career-work-card__type">
              {% if project.category == "professional" %}Professional project{% else %}Personal project{% endif %}
            </p>
            <h3><a href="{{ project.url | relative_url }}">{{ project.title }}</a></h3>
            <p>{{ project.description }}</p>
            <a class="career-text-link" href="{{ project.url | relative_url }}">Read the case study <span aria-hidden="true">→</span></a>
          </div>
        </article>
      {% endif %}
    {% endfor %}
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
      Today, I apply that mindset to data products and analytical systems:
      sometimes the answer is a model, sometimes a custom algorithm, a better
      dataset, a clearer interface, or a more reliable way to connect technical
      findings to a decision.
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
    <p class="career-eyebrow">Notes from the work</p>
    <h2 id="closing-title">I write about the decisions behind technical projects.</h2>
  </div>
  <p>
    Implementation choices, modelling tradeoffs, and occasional reflections on
    evidence, uncertainty, and useful data science.
  </p>
  <a class="career-button career-button--secondary" href="{{ '/writing/' | relative_url }}">Browse writing</a>
</section>
