---
layout: post
title: "Technical appendix: real estate data pipeline and ROI modeling"
date: 2025-05-03 12:20:00
description: Technical appendix to my Italian real-estate project, covering collection, ETL, synthetic data, modeling, and dashboard design.
tags: data-engineering scraping machine-learning
categories: [technical-notes]
technical_kind: appendix
last_updated: 2026-09-07
project_slug: italian-real-estate
toc:
  beginning: true
---

## Overview

This appendix follows the [real-estate project](/projects/italian-real-estate/) from recoverable collection tasks to a dashboard of estimated rental returns. It documents the pipeline and the limits of the historical synthetic study.

The project collected roughly one million listings across rent, sale, and auction markets. Its published results use synthetic data generated from that collection; they are not validated estimates for unseen source listings. The source and generated rows are not public. The final section explains what the public repository contains.

## Robust collection

The first problem was operational. I needed a nationwide research snapshot covering three listing types for 107 Italian provinces: 321 independent province-and-market tasks.

I used Apache Airflow to separate those tasks so that one failed request group did not require the complete collection to restart. Within each task, the collector moved through price ranges, gathered listing links, requested listing pages in asynchronous batches, and retried failures. Selenium handled content that required JavaScript rendering. Raw HTML went to MongoDB so that extraction logic could change without repeating the complete collection.

<div class="row">
  <div class="col-sm mt-3 mt-md-0">
    {% include figure.liquid loading="eager" path="assets/img/projects/italian-real-estate/italian-real-estate-extraction-DAG.svg" title="Airflow collection workflow" alt="Sale, rent, and auction collection each run as 107 independent province tasks, followed by data-lake statistics" class="img-fluid rounded z-depth-1" %}
  </div>
</div>

The public repository demonstrates orchestration and downstream engineering, but it does not provide an out-of-the-box collector.

## From an evolving source to a stable schema

The next problem was not only parsing more than 50 fields from HTML. It was deciding where flexibility was useful and where consistency was necessary.

BeautifulSoup extracted pricing, property characteristics, building and energy information, location fields, and listing descriptions. Three Airflow tasks processed rent, sale, and auction records in parallel. The resulting MongoDB warehouse preserved structured fields alongside text while the source and parser were still changing.

<div class="row">
  <div class="col-sm mt-3 mt-md-0">
    {% include figure.liquid loading="eager" path="assets/img/projects/italian-real-estate/italian-real-estate-ETL-DAG.svg" title="Airflow extraction and transformation workflow" alt="Parallel ETL tasks for sale, rent, and auction listings feed data-warehouse statistics" class="img-fluid rounded z-depth-1" %}
  </div>
</div>

Repeated analysis and feature transformations later made a relational model more useful. I moved the stable structured fields to a normalized PostgreSQL warehouse and left listing descriptions behind. A local LibreTranslate service, an SQLite translation cache, and a custom real-estate dictionary converted recurring Italian categorical values to English without translating the same value again.

The [database note](/blog/2025/mongodb-postgresql-ml/) explains the repeated preparation work that prompted this change.

## Synthetic data

I generated a synthetic dataset from the collected listings for the study. CTGAN did not preserve several aggregate relationships needed by the downstream analysis, so I used a custom K-nearest-neighbour method. It was designed to retain broad distributions and correlations; it was not evaluated as a formal privacy guarantee.

## Rental-income model

I then moved on to train a Random Forest regressor on the synthetic _rent_ listings to predict monthly rent from a listing's properties (e.g., surface, number of rooms, position, heating type, balcony, etc.), and applied it to synthetic _sale_ and _auction_ listings. The target was predicting how much money a property on sale (either regularly or through auction) would yield as a rental.

The reported held-out R² was approximately 0.75 on `log1p(rent)` in the synthetic split. This is a historical result: the public repository does not retain a versioned artifact reproducing that exact value. It does not establish performance on unseen source listings.

## Dashboard as decision support

The Tableau dashboard connects estimated rent to the assumptions needed to calculate returns. It supports area-level exploration rather than recommendations about individual listings.

Users can compare sale and auction markets, filter by location and property characteristics, and change mortgage and renovation assumptions. The dashboard provides two views of return:

- annual cash-on-cash return: `(annual rent - annual mortgage payment) / down payment`;
- rental yield: `annual rent / purchase price`.

Maps, scatter plots, grouped summaries, and headline statistics let a reader inspect how location, purchase price, and financing affect those calculations.

## Code and publication boundary

The reusable public code is available on [GitHub](https://github.com/LeonardoPaccianiMori/portfolio-italian-real-estate). The [public Tableau dashboard](https://public.tableau.com/views/Italianrealestate/Dashboard_1?:showVizHome=no) contains aggregate exploratory outputs.

Source and synthetic row-level data, credentials, and the live collection implementation remain excluded. The public material does not independently reproduce the historical metrics, authorize collection from the source, or provide investment advice.

For the decisions behind two stages, read [why CTGAN was rejected](/blog/2025/synthetic-data-ctgan/) and [when the cleaned data moved to PostgreSQL](/blog/2025/mongodb-postgresql-ml/).
