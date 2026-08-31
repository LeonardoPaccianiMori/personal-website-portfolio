---
layout: page
title: Exploring real estate returns in Italy
description: End-to-end data pipeline from Italian property listings to rental-income estimates and an investor-facing decision-support dashboard
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

## Summary

I built an end-to-end pipeline that collected roughly one million Italian property listings, organized them for analysis, generated a synthetic study dataset, estimated rental income, and presented the results in a Tableau dashboard.

The analytical results on this page come from synthetic data designed to preserve broad distributions and correlations, not from distributable source listings. Neither the source listings nor the synthetic row-level data are published.

## From collection to decision support

<div class="row">
  <div class="col-sm mt-3 mt-md-0">
    {% include figure.liquid loading="eager" path="assets/img/projects/italian-real-estate/italian-real-estate-project-structure.png" title="Project pipeline" class="img-fluid rounded z-depth-1" %}
  </div>
</div>
<div class="caption">
  End-to-end data pipeline from collection to interactive dashboard. See the <a href="{{ '/licensing/' | relative_url }}">icon attributions</a>.
</div>

Apache Airflow orchestrated collection jobs across Italian provinces and listing types. MongoDB supported the evolving source structure; I later moved the cleaned data into a fixed PostgreSQL schema. A custom KNN-based generator created synthetic rows, and a Random Forest estimated rental income from property features. Tableau and geospatial analysis turned the output into an interface for exploring returns.

I built each stage independently, from data acquisition and schema design through modelling and presentation.

## Dashboard and exploratory findings

{% include dashboards/italian-real-estate-dashboard.html %}

The interactive view works best on a desktop or tablet. The dashboard presents patterns in the synthetic study data.

The study suggested that auction properties could outperform regular sales after assumed renovation costs, rural areas could show higher returns than urban areas, energy rating had less effect on estimated rent than expected, and no simple North–South profitability divide appeared. These are exploratory synthetic-data results. They are not property-level forecasts or investment advice.

## Limitations and public boundary

- The original study reported R² = 0.75 on `log1p(rent)` for a held-out synthetic test split. The current public release does not contain a versioned artifact that independently reproduces this exact value, and the result is not evidence of price-scale accuracy.
- The data is a snapshot from early 2025 and is now outdated.
- The synthetic generator was designed to break row-level correspondence, but it was not evaluated as a formal privacy guarantee.
- Collection availability and permissions can change. Any reuse requires current authorization and compliance with the source site's terms.
- The public repository excludes the source listings, synthetic row-level data, and code that would enable direct reuse of the original collection process.

The [technical appendix](/blog/2025/italian-real-estate-deep-dive/) documents the scraping, ETL, synthetic-data, and modelling approach. Two related notes explain [why CTGAN was rejected](/blog/2025/synthetic-data-ctgan/) and [why the storage layer moved from MongoDB to PostgreSQL](/blog/2025/mongodb-postgresql-ml/).
