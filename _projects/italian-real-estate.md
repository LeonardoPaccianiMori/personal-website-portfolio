---
layout: page
title: Finding Profitable Real Estate in Italy
description: AI-powered pipeline to help investors identify high-return properties
img: assets/img/projects/italian-real-estate/italian-real-estate-1.jpg
importance: 1
category: portfolio
d3_diagram: true
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

Real estate price prediction is one of those "classic" data science problems everyone tackles when learning. The issue: most people use the **same tired datasets**: Ames, Boston, California housing. You end up following (consciously or not) the same patterns as hundreds of existing tutorials. Hard to showcase real skills that way, or learn anything interesting and new. Besides, I live in Italy so I don't really have any practical interest in studying US real estate.

I wanted to work on an end-to-end project that proves I can go out and get the data I need to solve a problem, not just download a CSV and run models. So instead of grabbing a pre-made dataset, I scraped my own: over a million property listings from across Italy. The specific problem (predicting returns on real estate investments) is standard, but the approach (building everything from data collection to dashboard) is what makes it interesting.

The goal: scrape rental and sale listings across all of Italy, build a model to predict rental income for properties on the market, and identify where the best returns are. I ended up with an interactive dashboard that lets you explore investment opportunities filtered by location, property type, and listing type (regular sale vs auction).

Biggest surprise: auction properties crush regular sales on returns **even accounting for significant renovation costs**. They're often 30%+ cheaper!

## What I Built

<div class="row">
    <div class="col-sm mt-3 mt-md-0">
        {% include figure.liquid loading="eager" path="assets/img/projects/italian-real-estate/italian-real-estate-project-structure.png" title="Project pipeline" class="img-fluid rounded z-depth-1" %}
    </div>
</div>
<div class="caption">
    End-to-end data pipeline from web scraping to interactive dashboard. Icons from <a href="https://www.flaticon.com/">Flaticon</a>
</div>

<div id="project-structure-d3" style="width: 100%; margin: 2rem auto; background-color: #f8f9fa; padding: 1rem; border-radius: 0.25rem;"></div>

<script>
// D3.js diagram - Italian Real Estate Project Structure
// You can easily modify node positions, icons, and connections here

// Wait for both DOM and D3 to be ready
(function() {
  function initDiagram() {
    // Check if D3 is loaded and function exists
    if (typeof d3 === 'undefined' || typeof renderD3Diagram !== 'function') {
      console.log('Waiting for D3 and renderD3Diagram to load...');
      setTimeout(initDiagram, 100);
      return;
    }

    renderD3Diagram('#project-structure-d3', {
      width: 600,
      height: 1600,
      nodes: [
        // Row 1: immobiliare.it logo + Airflow logo
        {id: 'immobiliare', x: 300, y: 60, icon: 'assets/img/projects/italian-real-estate/immobiliare-logo.png', width: 120, height: 40},
        {id: 'airflow1', x: 450, y: 60, icon: 'assets/img/projects/italian-real-estate/airflow-logo.png', width: 80, height: 40},

        // Row 2: MongoDB logo + datalake icon
        {id: 'mongodb1', x: 300, y: 180, icon: 'assets/img/projects/italian-real-estate/mongodb-logo', width: 120, height: 40},
        {id: 'datalake', x: 300, y: 250, icon: 'assets/img/projects/italian-real-estate/data-lake-icon.png', width: 60, height: 50},

        // Row 3: Airflow logo
        {id: 'airflow2', x: 450, y: 380, icon: 'assets/img/projects/italian-real-estate/airflow-logo.png', width: 80, height: 40},

        // Row 4: MongoDB logo + warehouse icon
        {id: 'mongodb2', x: 300, y: 510, icon: 'assets/img/projects/italian-real-estate/mongodb-logo', width: 120, height: 40},
        {id: 'warehouse_nonrel', x: 300, y: 590, icon: 'assets/img/projects/italian-real-estate/data-warehouse-icon.png', width: 60, height: 50},

        // Row 5: Airflow logo
        {id: 'airflow3', x: 450, y: 720, icon: 'assets/img/projects/italian-real-estate/airflow-logo.png', width: 80, height: 40},

        // Row 6: PostgreSQL logo + warehouse icon
        {id: 'postgresql', x: 300, y: 850, icon: 'assets/img/projects/italian-real-estate/postgresql-logo.png', width: 120, height: 40},
        {id: 'warehouse_rel', x: 300, y: 930, icon: 'assets/img/projects/italian-real-estate/data-warehouse-icon.png', width: 60, height: 50},

        // Row 7: scikit-learn logo
        {id: 'sklearn1', x: 400, y: 1060, icon: 'assets/img/projects/italian-real-estate/scikit-learn-logo.png', width: 80, height: 60},

        // Row 8: Document/data icon
        {id: 'synthetic_data', x: 300, y: 1180, icon: 'assets/img/projects/italian-real-estate/synthetic-data-icon.png', width: 60, height: 50},

        // Row 9: scikit-learn logo (left) + Tableau logo (right)
        {id: 'sklearn2', x: 100, y: 1310, icon: 'assets/img/projects/italian-real-estate/scikit-learn-logo.png', width: 80, height: 60},
        {id: 'tableau', x: 420, y: 1310, icon: 'assets/img/projects/italian-real-estate/tableau-logo.png', width: 100, height: 40},

        // Row 10: ML models icon (left) + Dashboards icon (right)
        {id: 'ml_models', x: 100, y: 1480, icon: 'assets/img/projects/italian-real-estate/ML-icon.png', width: 60, height: 60},
        {id: 'dashboards', x: 420, y: 1480, icon: 'assets/img/projects/italian-real-estate/dashboard-icon.png', width: 60, height: 60}
      ],
      edges: [
        // Top to MongoDB datalake
        {from: 'immobiliare', to: 'mongodb1', label: 'Web scraping', labelSide: 'left'},

        // MongoDB to datalake icon
        {from: 'mongodb1', to: 'datalake', label: 'Data lake'},

        // Datalake to MongoDB warehouse
        {from: 'datalake', to: 'mongodb2', label: 'ETL pipeline', labelSide: 'left'},

        // MongoDB warehouse to warehouse icon
        {from: 'mongodb2', to: 'warehouse_nonrel', label: 'Data warehouse\n(non-relational)'},

        // Warehouse to PostgreSQL
        {from: 'warehouse_nonrel', to: 'postgresql', label: 'ETL pipeline', labelSide: 'left'},

        // PostgreSQL to warehouse icon
        {from: 'postgresql', to: 'warehouse_rel', label: 'Data warehouse\n(relational)'},

        // Warehouse to sklearn (synthetic generation)
        {from: 'warehouse_rel', to: 'sklearn1', label: 'Synthetic data\ngeneration with\ncustom algorithm\n(KNN-based)', labelSide: 'left'},

        // sklearn to synthetic data
        {from: 'sklearn1', to: 'synthetic_data', label: 'Synthetic data'},

        // Synthetic data splits to sklearn and tableau
        {from: 'synthetic_data', to: 'sklearn2', label: ''},
        {from: 'synthetic_data', to: 'tableau', label: ''},

        // sklearn to ML models
        {from: 'sklearn2', to: 'ml_models', label: 'ML models'},

        // Tableau to dashboards
        {from: 'tableau', to: 'dashboards', label: 'Dashboards'},

        // ML models to dashboards (horizontal arrow)
        {from: 'ml_models', to: 'dashboards', label: '', isHorizontal: true}
      ]
    });
  }

  // Start trying to initialize when DOM is ready
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initDiagram);
  } else {
    initDiagram();
  }
})();
</script>

### How it Works

**Data Collection**
Scraped <a href="https://www.immobiliare.it/en/">immobiliare.it</a> (Italy's largest real estate site) for all 107 provinces. Collected rentals, sales, and auction listings, and ended up with about 1 million properties total.

**Data Processing**
Pulled out everything useful from the raw HTML (price, size, location, features, etc.), translated the Italian text to English, and organized it into a PostgreSQL database.

**Synthetic Data**
Since the data was scraped from a website, I didn't want to share publicly work done on the real listings data (also to avoid potential legal issues). So I built a custom algorithm to generate synthetic listings: it finds similar real properties and blends their features, this preserving the statistical patterns without exposing the actual scraped data. Both the ML model training and inference was done on the synthetic data.

**Machine Learning**
Trained a **Random Forest** regressor model to predict rental prices based on property features. Then applied it to all the sale/auction listings to estimate what monthly rent they could bring in. The model gets about 75-78% accuracy (R² score), so good enough to spot trends but not perfect for individual properties. I chose Random Forest because:
- It's simple and can catch well non-linear relationships
- Handles outliers well
- Is interpretable (we can evaluate feature importance)
- It gets the job done with good accuracy and training time.

**Dashboard**
Built an interactive Tableau dashboard showing two key metrics:
- Cash-on-cash return (annual return on the down payment)
- Rental yield (annual rent / purchase price)

You can filter by location, property type, energy rating, and more to explore different scenarios. For example, the dashboard allows to change the terms (e.g., duration and interest rate) of the mortgage used to buy the property (if any), and also to include renovation costs as a precentage of the property's sales price.

## The Results

{% include dashboards/italian-real-estate-dashboard.html %}

<br>
(Works best on desktop/tablet - you can also <a href="https://public.tableau.com/views/Italianrealestate/Dashboard_1?:language=en-US&:sid=&:redirect=auth&:display_count=n&:origin=viz_share_link" target="_blank">open it in full screen</a>)

### What I Found

A few things that surprised me:

- **Auction properties are way more profitable** (this is not the surprising part)**, even when accounting for significant renovation costs** (this is the surprising bit): they're often 30%+ cheaper than regular sales, which leads to significantly higher returns.
- **Energy efficiency doesn't matter as much as you'd think**. Lower-rated properties cost less but rent for almost the same as high-rated ones. The market doesn't seem to value it much.
- **Rural outperforms urban**. Rural properties show higher returns even with extra maintenance factored in.
- **No clear north/south divide**. I expected southern Italy to be cheaper and northern to be more expensive, but profitable deals exist in both.

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

## What I Learned

This project taught me a lot about handling messy real-world data at scale:
- Building pipelines that don't break when websites change their HTML structure
- Orchestrating complex workflows with dependencies across 300+ tasks
- Designing database schemas that actually make sense for analytics (turns out the first attempt is never the right one)
- Training ML models on sparse, noisy data where you don't control data quality
- Making technical work useful for non-technical people

## Limitations

The model isn't perfect: the 75-78% R² means it's good for spotting trends and comparing properties, but you'd definitely want to verify specific listings yourself before making decisions. Also, this assumes you're buying to rent out long-term: if you're planning to flip or use it yourself, the metrics don't apply.

The data is also a snapshot from early 2025, so the specific listings are already outdated (real estate moves fast). But the patterns and methods should still hold.

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
    return round(P * (i * (i + 1)**n) / ((i + 1)**n - 1), 2)
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

## Links

- 📊 [Interactive Dashboard](https://public.tableau.com/views/Italianrealestate/Dashboard_1)
- 💻 [GitHub Repository](https://github.com/LeonardoPaccianiMori/italian-real-estate-pipeline)
- 📝 [Technical Documentation](https://github.com/LeonardoPaccianiMori/italian-real-estate-pipeline/tree/main/docs)
