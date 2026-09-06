---
layout: post
title: "Moving the real estate pipeline from MongoDB to PostgreSQL"
date: 2025-06-20 10:30:00
description: How the storage layer changed as the project moved from messy scraping to analytics-ready modeling.
tags: data-engineering databases architecture
categories: [technical-notes]
technical_kind: note
featured: false
last_updated: 2026-09-06
project_slug: italian-real-estate
reading_minutes: 2
---

In the [real-estate pipeline](/projects/italian-real-estate/), I kept flattening the same records, rebuilding categorical mappings, and writing awkward aggregation queries. Those repeated tasks were the signal to move the cleaned layer from MongoDB to PostgreSQL.

## Keeping the source flexible

At the start, I had raw HTML, inconsistent listing structures, and fields that changed as the parser encountered new cases. MongoDB let me store that material while extraction was still evolving.

I used two document layers: a data lake for raw HTML and a warehouse-like layer for extracted listing fields. Keeping the HTML meant I could change the parser without collecting everything again. Keeping the extracted fields flexible avoided forcing an unstable source into a fixed schema.

## Recognizing a stable analytical layer

Repeated analysis made a different set of requirements clear: consistent types, joins, dimension tables, and reliable model inputs. By then, much of the cleanup was no longer exploratory. I was repeating known transformations before each analysis.

I moved those stable fields to a normalized PostgreSQL warehouse. MongoDB remained useful for collection and the evolving extracted documents; the relational layer served feature engineering, translation handling, model inputs, and dashboard extracts.

<div class="row">
    <div class="col-sm mt-3 mt-md-0">
        {% include figure.liquid loading="eager" path="assets/img/projects/italian-real-estate/italian-real-estate-project-structure.svg" title="Data pipeline architecture" alt="Pipeline from property listings through MongoDB and PostgreSQL to synthetic data, modelling, and dashboard presentation" class="img-fluid rounded z-depth-1" %}
    </div>
</div>
<div class="caption">
    The project evolved from raw collection in MongoDB toward an analytics-ready layer in PostgreSQL.
</div>

## Where I would make the same choice

I would keep the flexible start and the later relational layer. The transition point was the repeated work required to prepare already-understood data for analysis. A stable schema removed that work from the analytical workflow.

The [technical appendix](/blog/2025/italian-real-estate-deep-dive/) follows the full collection, extraction, and modelling process. The [synthetic-data note](/blog/2025/synthetic-data-ctgan/) covers the next decision: preserving useful relationships in the study dataset.
