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

## Summary
I built an end-to-end real estate pipeline that starts with web scraping and ends with an investor-facing dashboard. Rather than relying on a public dataset, I collected and structured more than one million Italian property listings, generated a privacy-preserving synthetic dataset, trained a rental-price model, and used the results to surface high-return opportunities.

---

## Why This Matters
This is the most product-oriented project in the portfolio. It shows the full chain from acquisition and orchestration to modeling, analytics, and interface design, with an emphasis on decision support rather than on model novelty for its own sake.

---

## What I Built
Here is the simplified view of the pipeline:
<div class="row">
    <div class="col-sm mt-3 mt-md-0">
        {% include figure.liquid loading="eager" path="assets/img/projects/italian-real-estate/italian-real-estate-project-structure.png" title="Project pipeline" class="img-fluid rounded z-depth-1" %}
    </div>
</div>
<div class="caption">
    End-to-end data pipeline from web scraping to interactive dashboard. Icons from <a href="https://www.flaticon.com/">Flaticon</a>.
</div>

- Scraped rentals, sales, and auction listings for all Italian provinces, for a total of roughly **one million listings**.
- Built an ETL flow that cleaned, translated, and organized the data into an analytics-ready warehouse.
- Generated a synthetic dataset to preserve the useful structure of the original data without exposing scraped listings.
- Trained a Random Forest model to estimate rental income from property features.
- Published the outputs in a Tableau dashboard designed for investors exploring ROI.

---

## Results

{% include dashboards/italian-real-estate-dashboard.html %}

<br>
(Works best on desktop or tablet - you can also <a href="https://public.tableau.com/views/Italianrealestate/Dashboard_1?:language=en-US&:sid=&:redirect=auth&:display_count=n&:origin=viz_share_link" target="_blank">open it in full screen</a>)

### Key Findings
These insights come from the synthetic dataset, which was designed to preserve the key statistical relationships of the original data:
- **Auction properties outperform regular sales**, even after accounting for significant renovation costs.
- **Energy efficiency impacts rent less than expected**; lower-rated properties often rent for similar amounts.
- **Rural areas often deliver higher returns** than urban ones.
- **No clear North-South divide** appears in profitability; interesting opportunities exist across the country.

These are directional insights for exploration, not investment advice. The system is meant to triage where to look more closely, not to claim exact property-level forecasts.

---

## Technical Approach
- **Data collection**: Apache Airflow orchestrated scraping jobs across provinces and listing types; MongoDB stored raw and intermediate data.
- **Data modeling**: once the schema stabilized, I migrated the cleaned data into PostgreSQL for analytics and feature engineering.
- **Synthetic data**: I used a custom KNN-based generator instead of CTGAN because preserving geographic and price correlations mattered more than reproducing marginal distributions alone.
- **Decision support**: I paired the model with an interactive dashboard so the project ended in a usable product rather than a notebook.

---

## What This Project Shows
- I can build and operate multi-stage data pipelines.
- I think about privacy and product usability alongside modeling.
- I can translate technical outputs into tools a non-technical user can act on.

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

## Limitations
- Model accuracy is good for trends (R2 about 0.75-0.78), but not for precise pricing.
- The data is a snapshot from early 2025, so the listings are now outdated.
- Results are based on synthetic data rather than the original scraped listings.

---

## Deep Dive
Full scraping, ETL, synthetic data, and modeling details are in [Italian Real Estate: Full Technical Deep Dive](/blog/2025/italian-real-estate-deep-dive/).

---

## View the Code
All code for this project is available on GitHub [here](https://github.com/LeonardoPaccianiMori/portfolio-italian-real-estate).

**Note**: Scraping code is redacted to prevent misuse. Shared for portfolio demonstration only.
