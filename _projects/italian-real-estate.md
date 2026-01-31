---
layout: page
title: Finding Profitable Real Estate in Italy
description: AI-powered pipeline to help investors identify areas with high-return properties
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

## Abstract
I built an end-to-end pipeline to identify high-return real estate opportunities in Italy. Instead of using a public dataset, I scraped and structured over one million listings, generated a privacy-preserving synthetic dataset, trained a rental-price model, and published an interactive dashboard for investors. The focus is on data collection, orchestration, and decision support rather than squeezing out maximum model accuracy.

---

## Objective
Use rental listings to estimate rental income for properties for sale or auction, then surface high-ROI opportunities in an interactive dashboard.

#### Main findings in a nutshell
Auction properties outperform regular sales on ROI even after significant renovation costs, and rural areas often deliver higher returns than urban ones (based on the synthetic dataset).

---

## Tools Used

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

## Data and Pipeline (Brief)
Here is a simplified view of the full pipeline:
<div class="row">
    <div class="col-sm mt-3 mt-md-0">
        {% include figure.liquid loading="eager" path="assets/img/projects/italian-real-estate/italian-real-estate-project-structure.png" title="Project pipeline" class="img-fluid rounded z-depth-1" %}
    </div>
</div>
<div class="caption">
    End-to-end data pipeline from web scraping to interactive dashboard. Icons from <a href="https://www.flaticon.com/">Flaticon</a>.
</div>

**Pipeline summary**:
- Scraped rentals, sales, and auction listings for all Italian provinces (about 1 million listings).
- Cleaned, translated, and organized listings into a PostgreSQL warehouse.
- Generated a synthetic dataset to preserve patterns without exposing real listings.
- Trained a Random Forest model to predict rental prices from property features.
- Applied predictions to sale and auction listings and published results in a Tableau dashboard.

---

## Results

{% include dashboards/italian-real-estate-dashboard.html %}

<br>
(Works best on desktop/tablet - you can also <a href="https://public.tableau.com/views/Italianrealestate/Dashboard_1?:language=en-US&:sid=&:redirect=auth&:display_count=n&:origin=viz_share_link" target="_blank">open it in full screen</a>)

### Key Findings
These insights are based on the synthetic dataset, which preserves statistical properties and correlations:
- **Auction properties outperform regular sales**, even after accounting for significant renovation costs.
- **Energy efficiency impacts price less than expected**; lower-rated properties rent for similar amounts.
- **Rural areas often deliver higher returns** than urban ones.
- **No clear North-South divide**: profitable deals exist across the country.

---

## What I Learned
- Building pipelines that survive HTML changes and scale to hundreds of parallel tasks.
- Designing database schemas that are practical for analytics.
- Training models on sparse, noisy data where data quality is outside your control.
- Translating technical work into decisions for non-technical users.

---

## Limitations
- Model accuracy is good for trends (R2 ~0.75-0.78), but not for precise pricing.
- The data is a snapshot from early 2025 and listings are now outdated.
- Results are based on synthetic data, not the original scraped listings.

---

## Deep Dive
Full scraping, ETL, synthetic data, and modeling details are in [Italian Real Estate: Full Technical Deep Dive](/blog/2026/italian-real-estate-deep-dive/).

---

## View the Code
All code for this project is available on GitHub [here](https://github.com/LeonardoPaccianiMori/portfolio-italian-real-estate).

**Disclaimer**: Scraping code is redacted to prevent misuse. Shared for portfolio demonstration only.

**Note**: This project's code was originally written by me and later reorganized in January 2026 using Codex 5.2, in order to make it tidier and better organized.

---

## Disclaimer

The content of this page was originally written by me. I used AI tools for editing and clarity only; the ideas, analysis, and conclusions are mine.
