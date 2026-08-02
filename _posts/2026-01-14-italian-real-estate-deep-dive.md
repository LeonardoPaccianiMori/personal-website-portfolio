---
layout: post
title: "Technical Appendix: Real Estate Data Pipeline and ROI Modeling"
date: 2025-07-18 12:20:00
description: Technical appendix to my Italian real-estate project, covering scraping, ETL, synthetic data, modeling, and dashboard design.
tags: data-engineering scraping machine-learning
categories: [technical-notes]
---

## Overview
This post is the technical appendix to my [Italian real-estate project](/projects/italian-real-estate/). I wanted this project to feel like *real* data work from beginning to end: messy data collection, shifting schemas, publication constraints, and a public-facing output that had to be *actually* useful rather than merely decorative. The project page focuses on the portfolio story; this page keeps the collection architecture, ETL choices, synthetic-data method, modeling setup, and dashboard design in one place.

---

## Data Collection
The original source was an Italian property-listing portal. The first hard problem was *operational* rather than *statistical*: collecting a nationwide research snapshot reliably enough that the later modeling work was worth doing.

### Challenge
I had to scrape three listing types (`rent`, `auction`, and `sale`) for 107 Italian provinces. This meant **321 independent scraping tasks**.

### Solution: Apache Airflow Orchestration
I used Apache Airflow to orchestrate each of these 321 tasks. Here is a representation of the workflow I used:
<div class="row">
    <div class="col-sm mt-3 mt-md-0">
        {% include figure.liquid loading="eager" path="assets/img/projects/italian-real-estate/italian-real-estate-extraction-DAG.png" title="Airflow DAG" class="img-fluid rounded z-depth-1" %}
    </div>
</div>

In particular, for each province (e.g., Milan, Rome, Naples) I:
1. scraped `rent` listings and stored the raw data in MongoDB
2. scraped `auction` listings and stored the raw data in MongoDB
3. scraped `sale` listings and stored the raw data in MongoDB

Airflow represented these as independent tasks so failures could be retried without restarting the whole collection.

### Technical Implementation

Technically, each listing scrape worked as follows:
1. For a given province and listing type, I selected a price range
2. I extracted the links to all listings in that price range
3. I scraped those listings
4. I moved on to the next price range

Other details:
- Each listing was scraped with an asynchronous HTTP request
- Requests were processed in batches with error handling and retry logic for failed requests
- `Selenium` was used for JavaScript-rendered content, as some pages required browser automation and dynamic loading
- Raw HTML data was stored in a MongoDB datalake

**Publication boundary:** the source listings, raw HTML, and code that performs the live collection are not published. The public repository demonstrates orchestration and downstream engineering without providing an out-of-the-box collector. Anyone implementing a new collector must obtain current authorization and follow the source site's current terms and access controls.

---

## ETL Pipeline
Once the raw data collection was working, the next problem was turning HTML fragments into something I could actually analyze.

### Challenge
I wanted to extract 50+ fields from raw HTML and organize them coherently.

### Solution: BeautifulSoup + Airflow
The workflow I used for this step was simple, and again orchestrated with Airflow:
<div class="row">
    <div class="col-sm mt-3 mt-md-0">
        {% include figure.liquid loading="eager" path="assets/img/projects/italian-real-estate/italian-real-estate-ETL-DAG.png" title="ETL DAG" class="img-fluid rounded z-depth-1" %}
    </div>
</div>

The ETL pipeline had three tasks that processed the three listing types in parallel.

Some of the fields I extracted in the MongoDB warehouse are:
- **Pricing**: price, price/m<sup>2</sup>, condominium expenses, heating costs
- **Property features**: surface, number of rooms, bathrooms, floors, presence of elevators, conditions
- **Building info**: construction year, total floors in the building, number of residential units
- **Energy**: efficiency class, consumption, heating type, presence of AC
- **Location**: latitude, longitude, province, city, address
- **Description**: text of the actual listing's description

The output of this step is a MongoDB warehouse with clean, structured documents. At this point the data still contains non-relational data (e.g., the listing's textual descriptions).

---

## PostgreSQL Migration
At this point I needed to organize my data in a relational database to be able to do standard analyses and train my rental income prediction model. Therefore, I decided to migrate all the structured data into a PostgreSQL database. At this step, I kept *only* the structured data and discarded the unstructured fields (e.g., the text of each listing's description).

### Database Schema
To enforce data consistency and reduce redundancy, I decided to create a database using a *snowflake* schema with full data normalization:
<div class="row">
    <div class="col-sm mt-3 mt-md-0">
        {% include figure.liquid loading="eager" path="assets/img/projects/italian-real-estate/PostgreSQL_warehouse_ERD.png" title="ERD" class="img-fluid rounded z-depth-1" %}
    </div>
</div>
<div class="caption">
    Snowflake schema with fact table and dimension tables. <a href="https://dbdiagram.io/">Created with dbdiagram.io</a>
</div>

### Translation Pipeline
At this stage, one challenge remained: many categorical features had values written in Italian. These included the listing's property type (e.g., house, apartment, townhouse) and listing features (e.g., whether a listing has a balcony, which type of heating it has, or whether it is already furnished).

To make these variables understandable, I needed to translate all of them into English. I used a local [LibreTranslate](https://libretranslate.com/) instance, with a custom SQLite cache to avoid re-translating identical text and a custom dictionary for real estate-specific jargon.

---

## Synthetic Data Generation
As explained in the [other post](/blog/2025/synthetic-data-ctgan/) relating to this project, I used a custom synthetic data generator to create new rows that preserved project-critical aggregate relationships without copying source listings.

I first tried using CTGAN (the "classical" solution for this type of problem), but it failed to recreate the complex relationships between the dataset's features. I therefore built my own KNN-based algorithm. More details can be found in the [dedicated post](/blog/2025/synthetic-data-ctgan/).

Because the KNN construction was not subjected to a formal privacy audit, I do not distribute either the source records or the row-level synthetic output. This also shapes how I interpret the later modeling metrics: the evaluation below validates the synthetic study pipeline; it is not a claim about production performance on unseen source listings.

---

## Machine Learning Model
For this step, I was not interested in using a "fashionable" model, but rather something that gives stable, interpretable predictions with reasonable effort. My final choice was a simple Random Forest predictor:
- it can capture complex non-linear relationships
- it is robust to outliers
- its results can be interpreted using feature importance
- it is easy and fast to train

### Random Forest Rent Predictor
The model's aim was to predict the monthly rental price for properties listed for sale or auction. In other words, I used the `rent` listings to train the model, and then applied it to `sale` and `auction` listings to predict what rent could be obtained from a given listing after buying it.


### Feature Engineering
Before training the model, I did some feature engineering:
- **Property types**: this feature had 30+ categories, many of which were similar (e.g., "apartment" and "condo") -> they were grouped into 7 broader values
- **Heating**: decomposed into `type`, `delivery`, `power source` (originally it was a unique string with all possible combinations of these features)
- **Air conditioning**: separated into `type`, `hot_capability`, `cold_capability`
- **Windows**: combined glass type and frame material
- **One-hot encoding**: 14 categorical features -> 70+ binary columns
- **Outliers**: removed 1st and 99th percentiles
- **Target**: log-transform rent for better predictions

### Model Architecture
The architecture of the model used for training was the following:
```python
RandomForestRegressor(
    n_estimators=100,
    max_depth=None,  # Full tree depth
    min_samples_leaf=1,
    random_state=2025,
    n_jobs=-1  # Use all CPU cores
)
```

### Performance Metrics
The original study reported the following held-out metrics on a synthetic
rent-listing split. The current public release retains the evaluation method
but not a versioned result artifact that independently reproduces these exact
values:

| Metric | Value |
|--------|-------|
| R² on `log1p(rent)` | 0.75 |
| RMSE (log scale) | 0.25 |
| MAE (log scale) | 0.14 |

<br>
The original implementation also reported a 2.07% MAPE calculated directly on
`log1p(rent)`. I have removed that value from the performance table because
it is not a price-scale percentage error. The current evaluator reverses the
log transform before calculating MAPE.

The top 5 most important features are:
1. **Surface area**
2. **Latitude**
3. **Longitude**
4. **Condominium expenses**
5. **Milan indicator** (premium pricing)

The importance of these features is straightforward:
- surface and location are *naturally* relevant to determine a property's rent
- the more luxurious and pricier properties will also generally have higher maintenance costs and therefore higher condominium expenses
- Milan is notoriously the hottest real estate market in Italy, so it makes sense that any given property in Milan will be priced higher

### Model Application
The original study reported applying the model to approximately **970,000
sale/auction synthetic rows** to build dashboard-ready rental-income
predictions. That count is historical and is not independently reproduced by a
row-level artifact in the current public release.

---

## Dashboard Design
I treated the dashboard as part of the model output itself, and not as a presentation layer. The project was only useful if a non-technical user could move from *prediction* to *decision*.

### Target Audience
The dashboard is designed for real estate investors who want to explore profitable areas (*not* single listings).

### Dashboard Features

The dashboard allows users to:
- use two different investment metrics:
    1. **Annual cash-on-cash return:** `(Annual Rent - Annual Mortgage Payment) / Down Payment`
    2. **Rental yield:** `Annual Rent / Purchase Price`
- compare `auction` vs `sale` listings
- assess the impact of property characteristics (energy class, property type, conditions)
- calculate ROI with custom mortgage parameters and include renovation costs

**User controls**:
- Mortgage parameters (interest rate, down payment %, loan term)
- Renovation costs (% of purchase price)
- Filters (property type, energy class, location, listing type)

**Visualizations**:
- Map: geographic distribution of profitable properties
- Scatter plot: price vs predicted rent
- Bar charts: metrics by province/property type
- Summary stats: counts, medians, top opportunities

---

## Closing Reflection
What I learned from this project is not just to "scrape real-estate listings". It is a more practical lesson: if you want a model-driven product to be credible, the upstream engineering and the publication constraints *have to* be part of the design *from the start*. The parts that held up best here were the pipeline decisions, the synthetic-data requirement, and the fact that the dashboard was treated as part of the project rather than as an afterthought.

---

## Look at the Code
The reusable, public parts of the code are available on [GitHub](https://github.com/LeonardoPaccianiMori/portfolio-italian-real-estate). Source and synthetic row-level data, credentials, and the live collection implementation are excluded.
