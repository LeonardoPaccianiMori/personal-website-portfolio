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
I built an end-to-end pipeline that starts with the scraping of real estate listings and ends with an investor-facing dashboard because I wanted a project where data acquisition mattered as much as modeling. Instead of starting from a pre-packaged housing dataset, I built my own by collecting and structuring more than **one million** Italian property listings, so the project demonstrates data acquisition and pipeline design rather than just modeling on a well-known and already cleaned dataset. I then generated a privacy-preserving synthetic dataset, trained a rental-price model, and used the results to identify areas with high-return opportunities.

---

## Why I Built the Dataset Myself
Real-estate modeling is a familiar data-science problem, but I was not interested in doing a polished version of a project built on a CSV that thousands of other people had already used (like the [Ames](https://www.kaggle.com/datasets/marcopale/housing/), [Boston](https://www.kaggle.com/datasets/schirmerchad/bostonhoustingmlnd/) or [California](https://www.kaggle.com/datasets/camnugent/california-housing-prices/) datasets). I wanted something closer to *real* analytical work: messy source data, evolving schemas, operational constraints, and a decision-support output at the end. Using Italian listings also made the problem feel more concrete to me rather than using a dataset from a market I was not familiar with.

---

## What I Built
Here is a simplified view of the pipeline:
<div class="row">
    <div class="col-sm mt-3 mt-md-0">
        {% include figure.liquid loading="eager" path="assets/img/projects/italian-real-estate/italian-real-estate-project-structure.png" title="Project pipeline" class="img-fluid rounded z-depth-1" %}
    </div>
</div>
<div class="caption">
    End-to-end data pipeline from web scraping to interactive dashboard. Icons from <a href="https://www.flaticon.com/">Flaticon</a>.
</div>

What I did was:
- I scraped rentals, sales, and auction listings for all Italian provinces, for a total of roughly **one million listings**.
- I built an ETL pipeline that cleaned, translated, and organized the data into an analytics-ready warehouse.
- I developed a custom algorithm to generate a synthetic dataset to preserve the useful structure of the original data without exposing scraped listings.
- I trained a simple Random Forest model to estimate rental income from property features.
- I published the outputs in a Tableau dashboard designed for investors exploring ROI.

---

## Results

{% include dashboards/italian-real-estate-dashboard.html %}

<br>
(The dashboard works best on desktops or tablets. You can also <a href="https://public.tableau.com/views/Italianrealestate/Dashboard_1?:language=en-US&:sid=&:redirect=auth&:display_count=n&:origin=viz_share_link" target="_blank">open it in full screen</a>)

### Key Findings
Analyzing the synthetic dataset (designed to preserve the key statistical relationships of the original data) I identified the following insights:
- **Auction properties outperform regular sales**, even after accounting for significant renovation costs.
- **Energy efficiency impacts rent less than expected**; lower-rated properties often rent for similar amounts.
- **Rural areas often deliver higher returns** than urban ones.
- **No clear North-South divide** appears in profitability; interesting opportunities exist across the country.

**Note:** The rental income prediction model is quite simple, and although it performes quite well to capture the main trends in the data (its R2 is 0.75), it is not sophisticated enough for precise pricing (which was not the main aim of this project). This system is meant to identify profitable *areas*, and not claim exact *property-level* forecasts.

---

## Technical Approach
Here is a brief overview of the technical approach used in this project:
- **Data collection**: Apache Airflow orchestrated scraping jobs across provinces and listing types; MongoDB stored both raw and processed non-relational data.
- **Data modeling**: I then chose a fixed relational schema and migrated the processed data into PostgreSQL.
- **Synthetic data**: I used a custom KNN-based synthetic data generator instead of CTGAN because preserving geographic and price correlations mattered more than reproducing marginal distributions alone.
- **Decision support**: I paired the model with an interactive dashboard so the project ended in a usable product rather than a notebook.

An aspect of this project I really liked is that no single component gets to pretend it is the whole story. The scraper, the schema decisions, the synthetic-data generation, and the dashboard *all* matter because the project only becomes useful when they work together.

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
- The accuracy of the rental income prediction model is good for trends (R2 = 0.75), but not for precise pricing.
- The data is a snapshot from early 2025, so the listings are now outdated.
- Results are *all* based on synthetic data rather than the original scraped listings.

---

## Deep Dive
Full scraping, ETL, synthetic data, and modeling details are in [Italian Real Estate: Full Technical Deep Dive](/blog/2025/italian-real-estate-deep-dive/).

---

## Related Blog Posts
- [Why I Replaced CTGAN with a Custom Synthetic Data Generator](/blog/2025/synthetic-data-ctgan/): The decision to abandon an off-the-shelf synthetic tabular data generator when it failed on the correlations that actually mattered.
- [How My Real Estate Pipeline Outgrew MongoDB and Moved to PostgreSQL](/blog/2025/mongodb-postgresql-ml/): Why the right database changed as my real-estate pipeline moved from messy extraction to analytics-ready modeling.

---

## View the Code
All code for this project is available on GitHub [here](https://github.com/LeonardoPaccianiMori/portfolio-italian-real-estate).

**Note**: This project used publicly accessible listing data for research and portfolio purposes. To avoid republishing source listings, I do not share the raw scraped data, and all public analysis and dashboards shown here are based on synthetic data. Scraping code is redacted to prevent misuse.
