---
layout: page
title: Finding Profitable Real Estate in Italy
description: AI-powered pipeline to help investors identify high-return properties
img: assets/img/projects/italian-real-estate/italian-real-estate-1.jpg
importance: 1
category: portfolio
---

<div class="row">
    <div class="col-sm mt-3 mt-md-0">
        {% include figure.liquid loading="eager" path="assets/img/projects/italian-real-estate/italian-real-estate-1.jpg" title="Italian real estate" class="img-fluid rounded z-depth-1" %}
    </div>
</div>
<div class="caption">
    <a href="https://pxhere.com/en/photo/529383">Image source</a>
</div>

**January - April 2025**

## The Big Picture

Imagine you want to invest in Italian real estate but don't know where to start. Which city? Which property type? Should you buy at auction? What rental income can you expect?

I built an end-to-end data system that answers these questions by:
1. **Collecting** 1 million+ property listings from across Italy
2. **Predicting** rental income for properties listed for sale
3. **Showing** profitable investment opportunities on an interactive dashboard

**Bottom Line**: Help real estate investors make data-driven decisions about where and what to buy.

## Why This Matters

Most real estate investors rely on gut feeling or limited local knowledge. This project uses **machine learning** to analyze the entire Italian market and surface opportunities that might otherwise be hidden.

**Real Insight**: Properties at auction can be 30%+ more profitable than regular sales, even accounting for renovation costs!

## What I Built

<div class="row">
    <div class="col-sm mt-3 mt-md-0">
        {% include figure.liquid loading="eager" path="assets/img/projects/italian-real-estate/italian-real-estate-project-structure.png" title="Project pipeline" class="img-fluid rounded z-depth-1" %}
    </div>
</div>
<div class="caption">
    End-to-end data pipeline from web scraping to interactive dashboard. <a href="https://www.flaticon.com/">Icons from Flaticon</a>
</div>

### The Pipeline (Simple Version)

**Step 1: Data Collection**
- Scraped Italy's largest real estate website (immobiliare.it)
- Collected 3 types of listings: rentals, sales, auctions
- Covered all 107 Italian provinces
- Total: **1,000,000+ properties**

**Step 2: Data Processing**
- Extracted useful information from raw HTML
- Translated Italian text to English
- Organized data into a structured database

**Step 3: Synthetic Data Generation**
- Created additional realistic data using a custom algorithm
- Preserved statistical patterns while ensuring privacy
- Used **GPU acceleration** for speed

**Step 4: Machine Learning**
- Trained a model to predict rental prices
- Applied it to sale/auction properties to estimate rental income
- Achieved **~75-78% accuracy** (R² score)

**Step 5: Interactive Dashboard**
- Built visualizations showing investment metrics:
  - **Cash-on-cash return**: Annual return on your down payment
  - **Rental yield**: Annual rent divided by purchase price
- Filter by location, property type, and more

## The Results

{% include dashboards/italian-real-estate-dashboard.html %}

<br>
💡 **Tip**: Open dashboard in <a href="https://public.tableau.com/views/Italianrealestate/Dashboard_1?:language=en-US&:sid=&:redirect=auth&:display_count=n&:origin=viz_share_link" target="_blank">full screen</a> for the best experience. Works best on desktop/tablet.

### Key Insights from the Data

✅ **Auction properties are goldmines**: Much cheaper than regular sales, leading to higher returns

✅ **Less efficient = more profitable**: Lower energy class properties cost less but rent for similar amounts

✅ **Rural beats urban**: Rural properties show higher returns even with renovation costs factored in

✅ **No clear geographic trend**: Profitable opportunities exist in both northern and southern Italy

## Technologies Used

| **Area** | **Tools** |
|----------|-----------|
| Web Scraping | Selenium, BeautifulSoup, AsyncIO |
| Workflow | Apache Airflow |
| Databases | MongoDB, PostgreSQL |
| Machine Learning | scikit-learn (Random Forest) |
| Data Processing | Pandas, NumPy |
| GPU Compute | TensorFlow |
| Visualization | Tableau, Matplotlib, Seaborn |
| Geospatial | Geopandas |
| Translation | LibreTranslate API |

## Skills Demonstrated

✅ **End-to-end data engineering**: From raw web data to production dashboard
✅ **Distributed systems**: Airflow orchestration, parallel processing, async I/O
✅ **Database design**: Multi-layer architecture (datalake → warehouse)
✅ **Algorithm development**: Custom synthetic data generation
✅ **Machine learning**: Feature engineering, model training, evaluation
✅ **Business intelligence**: Interactive dashboards for decision-making

## Project Impact

**For Investors**: Make informed decisions backed by data from 1M+ properties

**For Me**: Demonstrated ability to handle complex, real-world data projects from start to finish

---

<details>
<summary><strong>🔬 Technical Deep Dive: Data Collection</strong> (Click to expand)</summary>

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
   - Scrape RENT listings → Store in MongoDB
   - Scrape AUCTION listings → Store in MongoDB
   - Scrape SALE listings → Store in MongoDB
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
The scraping code has been **redacted** to prevent out-of-the-box reproducibility. This is shared to demonstrate technical abilities, not to enable website scraping.

</details>

---

<details>
<summary><strong>📊 Technical Deep Dive: ETL Pipeline</strong> (Click to expand)</summary>

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
    return round(P * (i * (i + 1)**n) / ((i + 1)**n - 1), 2)
```

**Output**: MongoDB warehouse with clean, structured documents

</details>

---

<details>
<summary><strong>🗄️ Technical Deep Dive: PostgreSQL Migration</strong> (Click to expand)</summary>

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

<details>
<summary><strong>🤖 Technical Deep Dive: Synthetic Data Generation</strong> (Click to expand)</summary>

## Custom K-Nearest Neighbors Algorithm

### Why Generate Synthetic Data?
- **Privacy**: Don't use exact real data
- **Augmentation**: Increase dataset size for better ML training
- **Statistical Preservation**: Maintain real-world patterns

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

<details>
<summary><strong>🎯 Technical Deep Dive: Machine Learning Model</strong> (Click to expand)</summary>

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

<details>
<summary><strong>📈 Technical Deep Dive: Dashboard Design</strong> (Click to expand)</summary>

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

✅ **Progressive Disclosure**: Start simple, add complexity as needed

✅ **Interactivity**: Users explore their own scenarios

✅ **Context**: Tooltips and legends explain metrics

✅ **Performance**: Aggregations for fast rendering

</details>

---

## View the Code

All code for this project is available on [GitHub](https://github.com/LeonardoPaccianiMori/italian-real-estate-pipeline).

**Repository Structure**:
```
italian-real-estate-pipeline/
├── dags/              # Airflow workflows
├── src/               # Shared utilities
├── notebooks/         # Analysis notebooks
├── data/              # Data files
├── models/            # Saved ML models
└── config.yaml        # Configuration
```

The code demonstrates:
- **Production-ready practices**: Error handling, logging, configuration
- **Scalable architecture**: Modular design, parallel processing
- **Code quality**: DRY principles, documentation, type hints

**Disclaimer**: Scraping code is redacted to prevent misuse. Shared for portfolio demonstration only.

---

## Related Projects

- [Image Generation with Deep Learning](/projects/image-generation/) - Neural networks for digit classification and generation

---

## Links

- 📊 [Interactive Dashboard](https://public.tableau.com/views/Italianrealestate/Dashboard_1)
- 💻 [GitHub Repository](https://github.com/LeonardoPaccianiMori/italian-real-estate-pipeline)
- 📝 [Technical Documentation](https://github.com/LeonardoPaccianiMori/italian-real-estate-pipeline/tree/main/docs)
