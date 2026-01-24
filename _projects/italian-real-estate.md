---
layout: page
title: Finding Profitable Real Estate in Italy
description: AI-powered pipeline to help investors identify high-return properties
img: assets/img/projects/italian-real-estate/italian-real-estate.jpg
importance: 1
category: portfolio
---

<div class="row">
    <div class="col-sm mt-3 mt-md-0">
        {% include figure.liquid loading="eager" path="assets/img/projects/italian-real-estate/italian-real-estate.jpg" title="Italian real estate" class="img-fluid rounded z-depth-1" %}
    </div>
</div>
<div class="caption">
    <a href="https://pxhere.com/en/photo/529383">Image source</a>
</div>

**January - April 2025**

## Intro

Real estate price prediction is one of those "classic" data science problems everyone tackles when learning. The issue: most people use the **same trite datasets** (Ames, Boston, California housing), so one ends up following (consciously or not) the same patterns as hundreds of existing tutorials. Hard to showcase real skills this way, or learn anything interesting and new. Besides, I am from and live in Italy so I don't really have any practical interest in analyzing US real estate data.

I therefore decided to work on an end-to-end project that proves I can go out and get the data I need to solve a problem, not just download a CSV millions of other people have access to and run the same old models. So, instead of grabbing a clean pre-packaged dataset, I scraped and created my own: over *one million* property listings from across all Italy.

The problem I want to tackle with this data is the following: using the patterns in the listings of properties put up for rent, can we understand how profitable a property on sale or auction can be? In other words, I want to use the rent listings to build a model that can predict rental income for properties on the market (either on sale or auction), and identify where the best ROIs are. The results are shown in an interactive dashboard that lets the user explore investment opportunities filtered by location, property type, and listing type (regular sale vs auction), with the possibility to include several investment costs like mortgage down payment, renovation costs etc.

The specific problem I want to tackle (predicting returns on real estate investments) is pretty standard (and I won't focus too much effort on getting a predictive model with crazy performance), but the approach I am using to tackle it, i.e. building a custom database *from scratch* and a whole data pipeline that goes *all the way* from data collection to a dashboard, is what makes this project *really* outstanding.

#### Main findings in a nutshell
Auction properties *crush* regular sales on returns, *even when accounting for **significant** renovation costs*. Rural properties also tend to have higher ROIs compared to urban ones. These findings are based on the synthetic dataset, which preserves the statistical properties and correlations of the original data.

---

## Technologies Used

| **Area** | **Tools** |
|----------|-----------|
| Web Scraping | Selenium, BeautifulSoup, AsyncIO |
| Workflow | Apache Airflow |
| Databases | MongoDB, PostgreSQL |
| Machine Learning | scikit-learn (Random Forest) |
| Data Processing | Pandas, NumPy |
| GPU Compute | TensorFlow |
| Visualization | Tableau, Matplotlib |
| Geospatial | Geopandas |
| Translation | LibreTranslate API |

---

## What I Built

Here is a simple representation of the full pipeline I built:
<div class="row">
    <div class="col-sm mt-3 mt-md-0">
        {% include figure.liquid loading="eager" path="assets/img/projects/italian-real-estate/italian-real-estate-project-structure.png" title="Project pipeline" class="img-fluid rounded z-depth-1" %}
    </div>
</div>
<div class="caption">
    End-to-end data pipeline from web scraping to interactive dashboard. Icons from <a href="https://www.flaticon.com/">Flaticon</a>.
</div>

### How it Works

**Data Collection**
Scraped the listing website (one of Italy's largest real estate websites) for all Italian provinces. Collected rentals, sales, and auction listings, and ended up with about 1 million properties in total.

**Data Processing**
Pulled out everything useful from the raw HTML (price, size, location, features, etc.), translated the Italian text to English, and organized it into a PostgreSQL database.

**Synthetic Data**
Since the data was scraped from a website, I don't want to share publicly any work done on the real listings data (also to avoid potential legal issues). So I built a custom algorithm to generate synthetic listings: it finds similar real properties and blends their features, thus preserving the statistical patterns without exposing the actual scraped data. Both the ML model training and inference were done on the synthetic data. The scraped data was deleted once the synthetic data was generated.

**Machine Learning**
Trained a **Random Forest** regressor model to predict rental prices based on property features. Then applied it to all the sale/auction listings to estimate what monthly rent they could bring in. The model gets an R² of about 0.75-0.78, so good enough to spot trends but not perfect for individual properties. I chose Random Forest because:
- It's simple and can catch well non-linear relationships
- Handles outliers well
- Is interpretable (we can evaluate feature importance)
- It gets the job done with good accuracy and training time
As said in the info, the focus of this project is *not* to build a crazy accurate model, so what I have obtained here is good enough.

**Dashboard**
Built an interactive Tableau dashboard showing two key metrics:
- Cash-on-cash return (annual return on the down payment)
- Rental yield (annual rent / purchase price)

The user can filter by location, property type, energy rating, and more to explore different scenarios. For example, the dashboard allows changing the terms (e.g., duration and interest rate) of the mortgage used to buy the property (if any), and also to include renovation costs as a percentage of the property's sales price.

---

## The Results

{% include dashboards/italian-real-estate-dashboard.html %}

<br>
(Works best on desktop/tablet - you can also <a href="https://public.tableau.com/views/Italianrealestate/Dashboard_1?:language=en-US&:sid=&:redirect=auth&:display_count=n&:origin=viz_share_link" target="_blank">open it in full screen</a>)

### What I Found

A few things that surprised me. These insights are based on the synthetic dataset, which preserves the statistical properties and correlations of the original data:

- **Auction properties are way more profitable** (this is not the surprising part), **even when accounting for significant renovation costs** (this is the surprising bit): they're often 30%+ cheaper than regular sales, which leads to significantly higher returns even after spending a significant amount of money in renovations.
- **Energy efficiency doesn't matter as much as you'd think**. Lower-rated properties cost less but rent for almost the same as high-rated ones. The market doesn't seem to value it much.
- **Rural outperforms urban**. Rural properties show higher returns even with extra maintenance factored in.
- **No clear north/south divide**. I expected southern Italy to be cheaper and northern to be more expensive, but profitable deals exist in both.

---

## What I Learned

This project taught me a lot about handling messy real-world data at scale:
- Building pipelines that don't break when websites change their HTML structure
- Orchestrating complex workflows with dependencies across 300+ tasks
- Designing database schemas that actually make sense for analytics (turns out the first attempt is never the right one)
- Training ML models on sparse, noisy data where you don't control data quality
- Making technical work useful for non-technical people

---

## Limitations

The model isn't perfect: the 0.75-0.78 R² means it's good for spotting trends and comparing properties, but you'd definitely want to verify specific listings yourself before making decisions. As already said, building a model with high accuracy was not the central focus of this project. Also, this assumes you're buying to rent out long-term: if you're planning to flip or use it yourself, the metrics don't apply.

The data is also a snapshot from early 2025, so the specific listings are now outdated.

Results are based on the synthetic dataset, which preserves the statistical properties and correlations of the original data.

---

## Technical deep dive
For the curious, here is a deeper dive into the technicalities of each part of this project:

<details markdown="1">
<summary><strong>Data Collection</strong></summary>

## Web Scraping Architecture

### Challenge
Scrape 107 provinces × 3 listing types = **321 independent scraping tasks**

### Solution: Apache Airflow Orchestration

<div class="row">
    <div class="col-sm mt-3 mt-md-0">
        {% include figure.liquid loading="eager" path="assets/img/projects/italian-real-estate/italian-real-estate-extraction-DAG.png" title="Airflow DAG" class="img-fluid rounded z-depth-1" %}
    </div>
</div>

**Workflow**:
1. For each province (e.g., Milan, Rome, Naples):
   - Scrape `rent` listings → Store in MongoDB
   - Scrape `auction` listings → Store in MongoDB
   - Scrape `sale` listings → Store in MongoDB
2. All provinces run in parallel for speed

### Technical Implementation

**Asynchronous Scraping**:
```python
# Concurrent HTTP requests with semaphore
semaphore = asyncio.Semaphore(50)  # Max 50 concurrent requests

async def get_single_url(url, session):
    async with semaphore:
        async with session.get(url, timeout=60) as response:
            return await response.text()
```

**Selenium for JavaScript-Rendered Content**:
- Some pages require browser automation
- Handles complex interactions and dynamic loading

**Data Storage**:
- MongoDB "datalake" stores raw HTML
- Includes timestamp for tracking changes over time

**Performance**:
- Batch processing with error handling
- Retry logic for failed requests
- Logging for monitoring

### Code Disclaimer
The scraping code has been **redacted** to prevent out-of-the-box reproducibility. The code is shared to demonstrate technical abilities, not to enable or encourage website scraping.

</details>

---

<details markdown="1">
<summary><strong>ETL Pipeline</strong></summary>

## MongoDB ETL: Raw HTML → Structured Data

### Challenge
Extract 50+ fields from unstructured HTML and organize them coherently.

### Solution: BeautifulSoup + Airflow

<div class="row">
    <div class="col-sm mt-3 mt-md-0">
        {% include figure.liquid loading="eager" path="assets/img/projects/italian-real-estate/italian-real-estate-ETL-DAG.png" title="ETL DAG" class="img-fluid rounded z-depth-1" %}
    </div>
</div>

**Extracted Fields** (50+ total):
- **Pricing**: price, price/m², condominium expenses, heating costs
- **Property Features**: surface, rooms, bathrooms, floor, elevator, condition
- **Building Info**: construction year, floors, residential units
- **Energy**: efficiency class, consumption, heating type, AC
- **Location**: latitude, longitude, province, city, address
- **Auction Data** (for auctions): court, minimum offer, procedure number

**Data Transformations**:
```python
def remove_non_numbers(string):
    """Convert '€300.000,00' → 300000"""
    string = string.replace(",", ".")
    return ''.join(c for c in string if c.isdigit() or c == '.')

def mortgage_monthly_payment(principal, interest, term):
    """Calculate monthly mortgage payment"""
    i = interest / 12
    n = term * 12
    return round(principal * (i * (i + 1)**n) / ((i + 1)**n - 1), 2)
```

**Output**: MongoDB warehouse with clean, structured documents

</details>

---

<details markdown="1">
<summary><strong>PostgreSQL Migration</strong></summary>

## MongoDB → PostgreSQL + Translation

### Why PostgreSQL?
- **Relational integrity**: Enforce data consistency
- **Query performance**: Better for analytical queries
- **Normalization**: Reduce redundancy with snowflake schema

### Database Schema

<div class="row">
    <div class="col-sm mt-3 mt-md-0">
        {% include figure.liquid loading="eager" path="assets/img/projects/italian-real-estate/PostgreSQL_warehouse_ERD.png" title="ERD" class="img-fluid rounded z-depth-1" %}
    </div>
</div>
<div class="caption">
    Snowflake schema with fact table and dimension tables. <a href="https://dbdiagram.io/">Created with dbdiagram.io</a>
</div>

**Design Pattern**: Snowflake Schema
- **Fact Table**: `listings` (main data)
- **Dimension Tables**: `property_types`, `conditions`, `energy_classes`, etc.
- **Benefits**: Normalized data, no redundancy, faster queries

### Translation Pipeline

**Challenge**: Translate Italian real estate jargon to English

**Solution**:
1. **LibreTranslate API**: Local instance for privacy and speed
2. **SQLite Cache**: Avoid re-translating identical text
3. **Custom Dictionary**: 100+ real estate-specific phrases

Example translations:
- "cucina abitabile" → "eat-in kitchen"
- "occupato" → "inhabited"
- "libero" → "vacant"

**Performance**:
- Batch processing: 10,000 records per batch
- Translation cache hits: ~80% (saves API calls)
- Parallel processing with ThreadPoolExecutor

</details>

---

<details markdown="1">
<summary><strong>Synthetic Data Generation</strong></summary>

## Custom K-Nearest Neighbors Algorithm

### Why Generate Synthetic Data?
- **Privacy**: Can't share scraped data publicly without legal risk
- **Demonstration**: Show the dashboard and analysis without exposing the source website's data
- **Statistical Preservation**: Maintain real-world patterns so the demo is realistic

### Algorithm Design

**Concept**: For each synthetic listing, find 5 real listings that are:
- Geographically close (similar lat/lon)
- Similar in price
- Similar in size (surface area)

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

**GPU Acceleration**:
- TensorFlow with CUDA support
- Batch processing to manage memory
- 10× speedup vs CPU

**Output**:
- **1,050,000 synthetic listings**
  - 80,000 rental
  - 120,000 auction
  - 850,000 sale

**Validation**:
- Geographic coherence: All coordinates within Italy's borders
- Statistical similarity: Distributions match real data
- Visual inspection: Property characteristics look realistic

### Why Not Use CTGAN?

I initially tried [CTGAN](https://github.com/sdv-dev/CTGAN) (a generative AI model for tabular data) but found:
- **Problem**: Could learn feature distributions but NOT correlations
- **Impact**: Lost critical relationships like location ↔ price
- **Solution**: Developed custom K-NN algorithm that preserves correlations

</details>

---

<details markdown="1">
<summary><strong>Machine Learning Model</strong></summary>

## Random Forest Rent Predictor

### Problem Statement
Predict monthly rental price for properties listed for sale/auction.

### Why Random Forest?
- **Non-linear relationships**: Property features interact in complex ways
- **Robustness**: Handles outliers well
- **Interpretability**: Can examine feature importance
- **Performance**: Good accuracy with reasonable training time

### Feature Engineering

**Simplifications**:
- **Property types**: 30+ categories → 7 main types (apartment, villa, house, etc.)
- **Heating**: Decomposed into type, delivery, power source
- **Air conditioning**: Separated into type, hot capability, cold capability
- **Windows**: Combined glass type and frame material

**One-Hot Encoding**: 14 categorical features → 70+ binary columns

**Outliers**: Removed 1st and 99th percentiles

**Target Transformation**: Log-transform rent for better predictions

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

**Train-Test Split**: 70% train / 30% test

### Performance Metrics

| Metric | Value |
|--------|-------|
| R² Score | 0.75 - 0.78 |
| RMSE (log scale) | 0.25 |
| MAE (log scale) | 0.14 |
| MAPE | 2.07% |

**Feature Importance (Top 5)**:
1. **Surface area** (m²) - most predictive
2. **Latitude** (location)
3. **Longitude** (location)
4. **Condominium expenses**
5. **Milan indicator** (premium pricing)

**Interpretation**:
- Size and location dominate
- Building maintenance costs signal rental value
- Urban centers (Milan) command premium

### Model Application

Applied to **970,000 sale/auction listings** to predict potential rental income.

**Output**: CSV with predictions for dashboard visualization.

</details>

---

<details markdown="1">
<summary><strong>Dashboard Design</strong></summary>

## Interactive Tableau Dashboard

### User Personas

**Target Audience**: Real estate investors (both novice and experienced)

**Use Cases**:
1. Explore profitable regions/cities
2. Compare auction vs sale listings
3. Assess impact of property characteristics
4. Calculate ROI with custom mortgage parameters

### Dashboard Features

**Investment Metrics**:

1. **Annual Cash-on-Cash Return**:
   ```
   (Annual Rent - Annual Mortgage Payment) / Down Payment
   ```
   - Shows return on actual cash invested
   - Useful for leveraged investments

2. **Rental Yield**:
   ```
   Annual Rent / Purchase Price
   ```
   - Shows total return potential
   - Useful for all-cash purchases

**User Controls**:
- **Mortgage Parameters**: Interest rate, down payment %, loan term
- **Renovation Costs**: Percentage of purchase price
- **Filters**: Property type, energy class, location, listing type

**Visualizations**:
- **Map**: Geographic distribution of profitable properties
- **Scatter Plot**: Price vs predicted rent
- **Bar Charts**: Metrics by province/property type
- **Summary Statistics**: Count, median values, top opportunities

### Design Principles

- **Progressive Disclosure**: Start simple, add complexity as needed
- **Interactivity**: Users explore their own scenarios
- **Context**: Tooltips and legends explain metrics
- **Performance**: Aggregations for fast rendering

</details>

---

## View the Code

All code for this project is available on GitHub [here](https://github.com/LeonardoPaccianiMori/portfolio-italian-real-estate).

**Disclaimer**: Scraping code is redacted to prevent misuse. Shared for portfolio demonstration only.

**Note**: This project's code was originally written by me and later reorganized in January 2026 using Codex 5.2, in order to make it tidier and better organized.
