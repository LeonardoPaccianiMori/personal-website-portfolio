---
layout: page
title: Exploring real estate returns in Italy
description: Exploring rental returns under purchase and financing assumptions, from roughly one million listings to a synthetic-study dashboard
img: assets/img/projects/italian-real-estate/italian-real-estate.jpg
importance: 1
category: portfolio
github: https://github.com/LeonardoPaccianiMori/portfolio-italian-real-estate
card_role: Independent implementation
project_overview:
  status: Completed
  period: January–April 2025
  role: Independent end-to-end implementation
  outcome: Collected roughly one million listings and turned synthetic study data into rental-income estimates and a Tableau dashboard.
  evidence: Public dashboard, code, and technical appendix; no source or synthetic row-level data are distributed.
project_actions:
  - label: Open dashboard
    url: https://public.tableau.com/views/Italianrealestate/Dashboard_1?:showVizHome=no
    style: primary
    external: true
  - label: View code
    url: https://github.com/LeonardoPaccianiMori/portfolio-italian-real-estate
    style: secondary
    external: true
  - label: Read technical appendix
    url: /blog/2025/italian-real-estate-deep-dive/
    style: secondary
    external: false
---

<div class="project-lead-image row">
  <div class="col-sm mt-3 mt-md-0">
    {% include figure.liquid loading="eager" path="assets/img/projects/italian-real-estate/italian-real-estate.jpg" title="Italian real estate" alt="" class="img-fluid rounded z-depth-1" %}
  </div>
</div>
<div class="caption">
  <a href="https://pxhere.com/en/photo/529383">Image source</a>
</div>

## Comparing rental returns

How would estimated rental returns differ between regular sales and auctions, and how much would the answer depend on financing and renovation assumptions? I built a pipeline and dashboard to explore those questions across Italy.

I implemented the project end to end, from collecting roughly one million property listings to modelling rent and presenting the results. The dashboard uses a synthetic study dataset derived from the collection. It describes patterns in that study, not forecasts for individual properties.

## Explore the study

{% include dashboards/italian-real-estate-dashboard.html %}

The dashboard works best on a desktop or tablet. You can compare sale and auction markets, filter areas and property characteristics, and change mortgage and renovation assumptions. Those choices affect the estimated returns, so they belong in the analysis rather than in a footnote.

## The choices behind the dashboard

<div class="row">
  <div class="col-sm mt-3 mt-md-0">
    {% include figure.liquid loading="eager" path="assets/img/projects/italian-real-estate/italian-real-estate-project-structure.svg" title="Project pipeline" alt="Pipeline from property listings through collection, storage, transformation, synthetic-data generation, modelling, and dashboard presentation" class="img-fluid rounded z-depth-1" %}
  </div>
</div>
<div class="caption">
  End-to-end data pipeline from collection to interactive dashboard.
</div>

Airflow coordinated collection across provinces and listing types. MongoDB stored the earlier non-relational data; I later moved the cleaned, analysis-ready data into a fixed PostgreSQL schema.

From there, a custom KNN-based generator produced the synthetic study rows. A Random Forest estimated rental income from property features, and Tableau combined the model output with geospatial analysis in an interface for exploring returns.

The storage changed as the work changed. MongoDB held the evolving source and extracted documents; PostgreSQL supported repeated transformations once the analytical schema was stable.

## What appeared in the synthetic study

Auction properties could outperform regular sales after the assumed renovation costs. Rural areas could show higher estimated returns than urban ones, while no simple North–South divide appeared. Energy rating had less effect on estimated rent than expected.

These findings depend on the synthetic data and the assumptions in the dashboard. They are exploratory results, not investment advice.

## Data and evidence

The source is an early-2025 snapshot and is now outdated. The custom generator was designed to retain broad distributions and correlations; it was not evaluated as a formal privacy guarantee. Neither source listings nor synthetic rows are distributed, and the public repository excludes the live collection implementation.

For the engineering details, read the [pipeline and modelling appendix](/blog/2025/italian-real-estate-deep-dive/). The [CTGAN note](/blog/2025/synthetic-data-ctgan/) explains the failed synthetic-data comparison, while the [database note](/blog/2025/mongodb-postgresql-ml/) explains when the cleaned data outgrew its document store.
