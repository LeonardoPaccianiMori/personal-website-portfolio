---
layout: post
title: "Moving the real estate pipeline from MongoDB to PostgreSQL"
date: 2025-06-20 10:30:00
description: How the storage layer changed as the project moved from messy scraping to analytics-ready modeling.
tags: data-engineering databases architecture
categories: [technical-notes]
featured: false
---

One of the more useful design decisions in my [Italian real estate project](/projects/italian-real-estate/) was accepting that the "right" database changed over the life of the project.

I resisted that shift longer than I should have, mostly because once a pipeline is working you start wanting the current tool to remain the right one. At the beginning I had messy HTML, half-understood fields, and a schema that changed whenever I found a new edge case. By the end I had an ML pipeline, a translation layer, and a normalized dataset that needed joins, constraints, and analytical queries.

Those are not the same storage problem.

## MongoDB was right first

The raw scraping stage was exactly the kind of data I would not want to force into a rigid relational schema too early:

- raw HTML
- inconsistent listing structures
- fields discovered incrementally
- nested or optional fragments everywhere

MongoDB was a good fit because it let me capture the source material quickly and iterate on extraction without paying a migration tax every time I learned something new.

In practice, I ended up with two MongoDB layers:

1. a datalake for raw HTML
2. a warehouse-like document layer for extracted but still evolving listing data

That bought me speed while the project was still exploratory.

## PostgreSQL became right later

Once the extraction work settled down, the costs of staying in MongoDB became more obvious.

I needed:

- consistent types
- relational integrity
- dimension tables
- easier feature engineering
- faster analytical queries

That is the point where PostgreSQL stopped being a "nice to have" and became the natural home for the ML-ready layer.

<div class="row">
    <div class="col-sm mt-3 mt-md-0">
        {% include figure.liquid loading="eager" path="assets/img/projects/italian-real-estate/italian-real-estate-project-structure.svg" title="Data pipeline architecture" alt="Pipeline from property listings through MongoDB and PostgreSQL to synthetic data, modelling, and dashboard presentation" class="img-fluid rounded z-depth-1" %}
    </div>
</div>
<div class="caption">
    The project evolved from raw collection in MongoDB toward an analytics-ready layer in PostgreSQL.
</div>

The interesting part here is not "SQL is better than NoSQL." It is more specific:

- MongoDB was better while the data model was still unstable
- PostgreSQL was better once the data model was stable enough to deserve constraints and structure

## The transition point

The transition happened when I noticed I was doing the same kinds of cleanup repeatedly:

- flattening nested records for analysis
- rebuilding categorical mappings
- writing increasingly awkward aggregation logic
- needing more reliable joins between entities

That was the signal that I was no longer storing exploratory data. I was storing production-ish analytical data in the wrong place.

Once I migrated the cleaned layer into PostgreSQL, a lot of later work got easier:

- schema normalization
- translation handling
- feature engineering
- model training inputs
- dashboard-ready extracts

## What I took from it

I came away from this project less interested in database ideology than before. The more practical lesson was simpler: storage decisions should match the maturity of the data, not your loyalty to one tool.

If I were doing the project again, I would make the same high-level move:

- start flexible while the extraction logic is still moving
- switch to stricter relational storage once the schema starts to settle

That sequence gave me speed early and reliability later, which is exactly what the project needed.

For the broader project context, see the [project page](/projects/italian-real-estate/). The [technical deep dive](/blog/2025/italian-real-estate-deep-dive/) covers the full ETL and modeling pipeline.
