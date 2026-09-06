---
layout: about
title: home
permalink: /
description: Senior Data Scientist building AI applications, with experience in predictive modelling, data analysis, and experimental research.
---

<section class="career-hero" aria-labelledby="career-hero-title">
  <div class="career-hero__copy">
    <p class="career-eyebrow">Senior Data Scientist</p>
    <h1 id="career-hero-title">I build AI applications.</h1>
    <p class="career-hero__lead">
      I’m <strong>Pinco Pallino</strong>, a Senior Data Scientist at
      <a href="https://www.merkle.com/en/locations/europe/italy.html">Merkle Italy</a>.
      When I build an application, I start with a problem someone needs to solve.
      I design, develop, and maintain the application, and work with its users
      to understand what needs to change.
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
      <h2 id="selected-work-title">Selected work</h2>
    </div>
    <a class="career-text-link" href="{{ '/projects/' | relative_url }}">View every project <span aria-hidden="true">→</span></a>
  </div>

{% assign featured_urls = "/projects/accelerating-qualitative-interview-analysis/|/projects/turning-audience-data-into-strategy/|/projects/italian-real-estate/" | split: "|" %}

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
              {% when '/projects/accelerating-qualitative-interview-analysis/' %}
                <p class="career-work-card__evidence">Internal application; code and interview material are private.</p>
              {% when '/projects/turning-audience-data-into-strategy/' %}
                <p class="career-work-card__evidence">Internal application; code and data are proprietary.</p>
            {% endcase %}
          </div>
        </article>
      {% endif %}
    {% endfor %}
  </div>
</section>

<section class="career-section career-background" aria-labelledby="background-title">
  <div class="career-background__story">
    <h2 id="background-title">How I work</h2>
    <p>
      Before moving into industry, I completed a PhD in physics at the University
      of Padua and spent four years doing experimental biophysics research at
      UC San Diego. Experiments taught me to question how data was collected and
      how much a result could actually tell me.
    </p>
    <p>
      Those questions still matter when I build an application. In one project,
      a model kept producing unsupported answers. Changing the prompts was not
      enough: I had to preserve the structure of the data it received. In another,
      working with researchers showed that the report they needed mattered more
      than adding features to the chat interface.
    </p>
    <p>
      Industry also changed how I decide when the work is ready. I still look for
      weak assumptions, but I ask what another week of investigation would change.
      Sometimes another test matters. Sometimes the useful next step is to put
      the application in front of people and learn from how they use it.
    </p>
  </div>
  <aside class="career-background__aside" aria-label="Writing about my work">
    <p class="career-eyebrow">Writing</p>
    <ul>
      <li><a href="{% post_url 2026-07-29-what-research-taught-me-about-applied-data-science %}">What research taught me, and what industry changed</a></li>
      <li><a href="{% post_url 2026-08-09-small-tools-can-create-outsized-value %}">Why small tools can be worth building</a></li>
      <li><a href="{% post_url 2026-08-01-what-i-mean-when-i-say-i-built-something-with-ai %}">What I mean when I say I built something with AI</a></li>
    </ul>
  </aside>
</section>

<section class="career-section career-approach" aria-labelledby="approach-title">
  <div class="career-section__heading">
    <h2 id="approach-title">Other questions I work on</h2>
    <p>
      AI applications are my main focus. I also work with predictive models and
      geographic data. My personal projects give me room to follow questions of
      my own: how rental estimates change a property-return calculation, or how
      much a recipe can tell us about where it comes from.
    </p>
    <p>
      In <a href="{{ '/projects/italian-cuisine/' | relative_url }}">my Italian cuisine project</a>,
      I represented recipes as networks of ingredients and preparation steps,
      then tested whether a model could recognize their regional origins.
      It found broad geographic patterns more readily than individual regions.
      The limits of that result became part of the project too.
    </p>
  </div>
</section>

<section class="career-closing" aria-labelledby="closing-title">
  <div>
    <h2 id="closing-title">Get in touch</h2>
  </div>
  <p>
    If you would like to discuss a future role or project, email me.
    I’m interested in AI application development and data science.
  </p>
  <a class="career-button career-button--secondary" href="mailto:leonardopaccianimori@gmail.com">Email me</a>
</section>
