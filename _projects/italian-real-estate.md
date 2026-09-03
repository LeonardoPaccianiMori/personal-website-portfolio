---
layout: page
title: Exploring real estate returns in Italy
description: End-to-end data pipeline from Italian property listings to rental-income estimates and decision-support dashboard for investment opportunities
img: assets/img/projects/italian-real-estate/italian-real-estate.jpg
importance: 1
category: portfolio
github: https://github.com/LeonardoPaccianiMori/portfolio-italian-real-estate
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

<div class="row">
  <div class="col-sm mt-3 mt-md-0">
    {% include figure.liquid loading="eager" path="assets/img/projects/italian-real-estate/italian-real-estate.jpg" title="Italian real estate" class="img-fluid rounded z-depth-1" %}
  </div>
</div>
<div class="caption">
  <a href="https://pxhere.com/en/photo/529383">Image source</a>
</div>

## From listings to rental-return estimates

I built a complete path from data collection to presentation. The pipeline collected roughly one million Italian property listings, organized them for analysis, generated a synthetic study dataset, estimated rental income, and presented the results in a Tableau dashboard.

The findings on this page come from that synthetic dataset. It was designed to retain broad distributions and correlations without distributing the source listings themselves. Neither the original listings nor the synthetic row-level data are public.

## Building the path to the dashboard

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

I implemented every stage, including acquisition, storage, transformation, modelling, and presentation. Together, those stages turned source listings into structured analytical data, model estimates, and an interactive view.

## What the synthetic study suggested

{% include dashboards/italian-real-estate-dashboard.html %}

The interactive view works best on a desktop or tablet. It presents patterns in the synthetic study data.

The study suggested that auction properties could outperform regular sales after assumed renovation costs, rural areas could show higher returns than urban areas, energy rating had less effect on estimated rent than expected, and no simple North–South profitability divide appeared. These are of course the results of the analysis of the synthetic data, and **not** property-level forecasts or _actual_ investment advice.

## Final notes
- The data is a snapshot from early 2025 and is now outdated.
- The synthetic generator was designed to create fully synthetic data with the same statistical properties of the original data.
- The public repository excludes the source listings, synthetic row-level data, and code that would enable direct reuse of the original collection process.

The [technical appendix](/blog/2025/italian-real-estate-deep-dive/) documents the collection, ETL, synthetic-data, and modelling approach. Two related notes explain [why CTGAN was rejected](/blog/2025/synthetic-data-ctgan/) when building the synthetic dataset and [why the storage layer moved from MongoDB to PostgreSQL](/blog/2025/mongodb-postgresql-ml/).
