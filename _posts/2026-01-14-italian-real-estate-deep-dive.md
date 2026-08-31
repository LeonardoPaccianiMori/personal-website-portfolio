---
layout: post
title: "Technical appendix: real estate data pipeline and ROI modeling"
date: 2025-07-18 12:20:00
description: Technical appendix to my Italian real-estate project, covering collection, ETL, synthetic data, modeling, and dashboard design.
tags: data-engineering scraping machine-learning
categories: [technical-notes]
technical_kind: appendix
last_updated: 2026-08-31
---

## Overview

This is the technical appendix to my [Italian real-estate project](/projects/italian-real-estate/). Its central lesson is simple: a model-driven product is only as credible as the data pipeline and publication boundary behind it. Collection had to survive partial failure, a changing source had to become a stable analytical schema, the public study could not distribute row-level data, and the final dashboard had to support decisions rather than only display a model score.

The project collected roughly one million listings across rent, sale, and auction markets. The source listings, raw HTML, row-level source data, row-level synthetic data, credentials, and live collector are not public. The published metrics describe a synthetic study and are not validated production estimates for unseen source listings.

## Robust collection

The first problem was operational. I needed a nationwide research snapshot covering three listing types for 107 Italian provinces: 321 independent province-and-market tasks.

Apache Airflow separated those tasks so that one failed request group did not require the complete collection to restart. Within each task, the collector moved through price ranges, gathered listing links, requested listing pages in asynchronous batches, and retried failures. Selenium handled content that required JavaScript rendering. Raw HTML went to MongoDB so that extraction logic could change without repeating the complete collection.

<div class="row">
  <div class="col-sm mt-3 mt-md-0">
    {% include figure.liquid loading="eager" path="assets/img/projects/italian-real-estate/italian-real-estate-extraction-DAG.svg" title="Airflow collection workflow" class="img-fluid rounded z-depth-1" %}
  </div>
</div>

The public repository demonstrates orchestration and downstream engineering, but it does not provide an out-of-the-box collector. Anyone who creates a new collector must obtain current authorization and follow the source site's current terms and access controls.

## From an evolving source to a stable schema

The next problem was not only parsing more than 50 fields from HTML. It was deciding where flexibility was useful and where consistency was necessary.

BeautifulSoup extracted pricing, property characteristics, building and energy information, location fields, and listing descriptions. Three Airflow tasks processed rent, sale, and auction records in parallel. The resulting MongoDB warehouse preserved structured fields alongside text while the source and parser were still changing.

<div class="row">
  <div class="col-sm mt-3 mt-md-0">
    {% include figure.liquid loading="eager" path="assets/img/projects/italian-real-estate/italian-real-estate-ETL-DAG.svg" title="Airflow extraction and transformation workflow" class="img-fluid rounded z-depth-1" %}
  </div>
</div>

Repeated analysis and feature transformations later made a relational model more useful. I moved the stable structured fields to a normalized PostgreSQL warehouse and left listing descriptions behind. A local LibreTranslate service, an SQLite translation cache, and a custom real-estate dictionary converted recurring Italian categorical values to English without translating the same value again.

The important decision was not that one database was universally better. MongoDB absorbed source variation during collection; PostgreSQL became useful when the transformations and analytical relationships were stable. The focused note on [moving from MongoDB to PostgreSQL](/blog/2025/mongodb-postgresql-ml/) explains that transition in more detail.

## A synthetic study, not an anonymization claim

The public analysis could not distribute the source records. I first tested CTGAN, but it did not preserve several project-critical aggregate relationships. I then built a K-nearest-neighbour-based generator for the study. The focused [synthetic-data note](/blog/2025/synthetic-data-ctgan/) covers that comparison and its diagnostics.

This was a publication constraint, not a formal anonymization result. The custom generator did not receive a privacy audit, so neither the source records nor the row-level synthetic output is distributed. Public charts, code, and metrics make the method inspectable without releasing those rows.

## Rental-income model

The study trained a Random Forest regressor on synthetic rent listings and applied it to synthetic sale and auction listings. The target was monthly rent. Feature work grouped property types, separated compound heating and air-conditioning fields, encoded categorical variables, removed the first and ninety-ninth percentiles, and used `log1p(rent)` as the training target.

The original held-out synthetic split reported these values:

| Metric              | Reported value |
| ------------------- | -------------: |
| R² on `log1p(rent)` |           0.75 |

The original implementation also reported a 2.07% MAPE calculated directly on `log1p(rent)`. That is not a price-scale percentage error, so I do not present it as a performance result. The current evaluator reverses the log transform before it calculates MAPE.

The current public release retains the evaluation method, but it does not include a versioned result artifact that independently reproduces the exact reported R² value.

These results validate the historical synthetic study pipeline only. They do not establish performance on unseen source listings, and they are not investment advice.

## Dashboard as decision support

The Tableau dashboard was part of the analytical product, not a presentation layer added after modeling. It was designed for area-level exploration rather than recommendations about individual listings.

Users can compare sale and auction markets, filter by location and property characteristics, and change mortgage and renovation assumptions. The dashboard provides two views of return:

- annual cash-on-cash return: `(annual rent - annual mortgage payment) / down payment`;
- rental yield: `annual rent / purchase price`.

Maps, scatter plots, grouped summaries, and headline statistics connect the estimated rental income to the purchase and financing assumptions. This turns a model output into an exploratory decision-support tool while keeping the uncertainty and synthetic-data boundary visible.

## What held up

The strongest parts of the project were not tied to one model. They were the decisions that kept the full system coherent:

- independent collection tasks made partial failure recoverable;
- raw storage allowed extraction logic to evolve;
- the warehouse changed when repeated transformations justified a stable schema;
- the synthetic-data boundary shaped both publication and interpretation;
- the dashboard was designed as part of the analysis.

## Code and publication boundary

The reusable public code is available on [GitHub](https://github.com/LeonardoPaccianiMori/portfolio-italian-real-estate). The [public Tableau dashboard](https://public.tableau.com/views/Italianrealestate/Dashboard_1?:showVizHome=no) contains aggregate exploratory outputs.

Source and synthetic row-level data, credentials, and the live collection implementation remain excluded. The public material does not reproduce the historical metrics independently, authorize collection from the source, or provide investment advice.
