---
layout: post
title: "Italian Real Estate Deep Dive: Pipeline, Synthetic Data, and ROI Dashboard"
date: 2025-04-14 10:00:00
description: Full technical details for the Italian real estate project, from scraping and ETL to modeling and dashboard design.
tags: data-engineering scraping machine-learning
categories: [data-science, projects]
---

## Overview
This post is the technical deep dive for my [Italian Real Estate project](/projects/italian-real-estate-v2/). It covers the scraping architecture, ETL, synthetic data generation, modeling choices, and dashboard design.

---

## Data Collection

### Challenge
Scrape 107 provinces x 3 listing types = **321 independent scraping tasks**.

### Solution: Apache Airflow Orchestration

<div class="row">
    <div class="col-sm mt-3 mt-md-0">
        {% include figure.liquid loading="eager" path="assets/img/projects/italian-real-estate/italian-real-estate-extraction-DAG.png" title="Airflow DAG" class="img-fluid rounded z-depth-1" %}
    </div>
</div>

**Workflow**:
1. For each province (e.g., Milan, Rome, Naples):
   - Scrape `rent` listings -> store in MongoDB
   - Scrape `auction` listings -> store in MongoDB
   - Scrape `sale` listings -> store in MongoDB
2. All provinces run in parallel for speed

### Technical Implementation

**Asynchronous scraping**:
```python
# Concurrent HTTP requests with semaphore
semaphore = asyncio.Semaphore(50)  # Max 50 concurrent requests

async def get_single_url(url, session):
    async with semaphore:
        async with session.get(url, timeout=60) as response:
            return await response.text()
```

**Selenium for JavaScript-rendered content**:
- Some pages require browser automation
- Handles complex interactions and dynamic loading

**Data storage**:
- MongoDB "datalake" stores raw HTML
- Includes timestamp for tracking changes over time

**Performance**:
- Batch processing with error handling
- Retry logic for failed requests
- Logging for monitoring

**Code disclaimer**: Scraping code has been **redacted** to prevent out-of-the-box reproducibility. Shared for portfolio demonstration only.

---

## ETL Pipeline

### Challenge
Extract 50+ fields from unstructured HTML and organize them coherently.

### Solution: BeautifulSoup + Airflow

<div class="row">
    <div class="col-sm mt-3 mt-md-0">
        {% include figure.liquid loading="eager" path="assets/img/projects/italian-real-estate/italian-real-estate-ETL-DAG.png" title="ETL DAG" class="img-fluid rounded z-depth-1" %}
    </div>
</div>

**Extracted fields** (50+ total):
- **Pricing**: price, price/m<sup>2</sup>, condominium expenses, heating costs
- **Property features**: surface, rooms, bathrooms, floor, elevator, condition
- **Building info**: construction year, floors, residential units
- **Energy**: efficiency class, consumption, heating type, AC
- **Location**: latitude, longitude, province, city, address
- **Auction data**: court, minimum offer, procedure number

**Data transformations**:
```python
def remove_non_numbers(string):
    """Convert 'EUR300.000,00' -> 300000"""
    string = string.replace(",", ".")
    return ''.join(c for c in string if c.isdigit() or c == '.')

def mortgage_monthly_payment(principal, interest, term):
    """Calculate monthly mortgage payment"""
    i = interest / 12
    n = term * 12
    return round(principal * (i * (i + 1)**n) / ((i + 1)**n - 1), 2)
```

**Output**: MongoDB warehouse with clean, structured documents.

---

## PostgreSQL Migration

### Why PostgreSQL?
- **Relational integrity**: enforce data consistency
- **Query performance**: better for analytical queries
- **Normalization**: reduce redundancy with a snowflake schema

### Database Schema

<div class="row">
    <div class="col-sm mt-3 mt-md-0">
        {% include figure.liquid loading="eager" path="assets/img/projects/italian-real-estate/PostgreSQL_warehouse_ERD.png" title="ERD" class="img-fluid rounded z-depth-1" %}
    </div>
</div>
<div class="caption">
    Snowflake schema with fact table and dimension tables. <a href="https://dbdiagram.io/">Created with dbdiagram.io</a>
</div>

**Design pattern**: Snowflake schema
- **Fact table**: `listings`
- **Dimension tables**: `property_types`, `conditions`, `energy_classes`, etc.
- **Benefits**: normalized data, no redundancy, faster queries

### Translation Pipeline

**Challenge**: Translate Italian real estate jargon to English.

**Solution**:
1. **LibreTranslate API**: local instance for privacy and speed
2. **SQLite cache**: avoid re-translating identical text
3. **Custom dictionary**: 100+ real estate-specific phrases

Example translations:
- "cucina abitabile" -> "eat-in kitchen"
- "occupato" -> "inhabited"
- "libero" -> "vacant"

**Performance**:
- Batch processing: 10,000 records per batch
- Translation cache hits: ~80% (saves API calls)
- Parallel processing with ThreadPoolExecutor

---

## Synthetic Data Generation

### Why Generate Synthetic Data?
- **Privacy**: cannot share scraped data publicly
- **Demonstration**: show the dashboard without exposing source listings
- **Statistical preservation**: keep real-world correlations

### Custom K-Nearest Neighbors Algorithm

**Concept**: For each synthetic listing, find 5 real listings that are:
- geographically close (similar lat/lon)
- similar in price
- similar in size (surface area)

Then create a synthetic listing by blending their features.

**Implementation**:
```python
# Distance metric (weighted)
weights = {
    'price': 0.25,
    'surface': 0.25,
    'latitude': 0.25,
    'longitude': 0.25
}

# For numerical features: weighted average
synthetic_price = sum(neighbor_prices * inverse_distance_weights)

# For categorical features: weighted voting
synthetic_property_type = most_common(neighbor_types, weights=inverse_distance)
```

**GPU acceleration**:
- TensorFlow with CUDA support
- Batch processing to manage memory
- 10x speedup vs CPU

**Output**:
- **1,050,000 synthetic listings**
  - 80,000 rental
  - 120,000 auction
  - 850,000 sale

**Validation**:
- Geographic coherence: coordinates within Italy
- Statistical similarity: distributions match real data
- Visual inspection: property characteristics look realistic

### Why Not Use CTGAN?
I tried [CTGAN](https://github.com/sdv-dev/CTGAN) first but found:
- It learned feature distributions but not correlations
- Key relationships like *location <-> price* were lost

The custom KNN approach preserved correlations better.

---

## Machine Learning Model

### Random Forest Rent Predictor

**Problem statement**: Predict monthly rental price for properties listed for sale/auction.

**Why Random Forest?**
- Non-linear relationships
- Robust to outliers
- Interpretable feature importance
- Good accuracy with reasonable training time

### Feature Engineering
- **Property types**: 30+ categories -> 7 main types
- **Heating**: decomposed into type, delivery, power source
- **Air conditioning**: separated into type, hot capability, cold capability
- **Windows**: combined glass type and frame material
- **One-hot encoding**: 14 categorical features -> 70+ binary columns
- **Outliers**: removed 1st and 99th percentiles
- **Target**: log-transform rent for better predictions

### Model Architecture
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

| Metric | Value |
|--------|-------|
| R2 Score | 0.75 - 0.78 |
| RMSE (log scale) | 0.25 |
| MAE (log scale) | 0.14 |
| MAPE | 2.07% |

**Feature importance (top 5)**:
1. **Surface area** (m2)
2. **Latitude** (location)
3. **Longitude** (location)
4. **Condominium expenses**
5. **Milan indicator** (premium pricing)

### Model Application
Applied to **970,000 sale/auction listings** to predict rental income and build dashboard-ready outputs.

---

## Dashboard Design

### User Personas
**Target audience**: real estate investors (novice and experienced).

**Use cases**:
1. Explore profitable regions/cities
2. Compare auction vs sale listings
3. Assess impact of property characteristics
4. Calculate ROI with custom mortgage parameters

### Dashboard Features

**Investment metrics**:
1. **Annual cash-on-cash return**
   ```
   (Annual Rent - Annual Mortgage Payment) / Down Payment
   ```
2. **Rental yield**
   ```
   Annual Rent / Purchase Price
   ```

**User controls**:
- Mortgage parameters (interest rate, down payment %, loan term)
- Renovation costs (% of purchase price)
- Filters (property type, energy class, location, listing type)

**Visualizations**:
- Map: geographic distribution of profitable properties
- Scatter plot: price vs predicted rent
- Bar charts: metrics by province/property type
- Summary stats: counts, medians, top opportunities

**Design principles**:
- Progressive disclosure
- Interactivity
- Context through tooltips and legends
- Performance via aggregation

---

## Look at the Code
All code for this project is available on GitHub [here](https://github.com/LeonardoPaccianiMori/portfolio-italian-real-estate).

---

## Disclaimer

The content of this page was originally written by me. I used AI tools for editing and clarity only; the ideas, analysis, and conclusions are mine.
