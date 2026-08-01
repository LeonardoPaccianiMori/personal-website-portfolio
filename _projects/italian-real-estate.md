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
I built an end-to-end pipeline that starts with collecting real-estate listings and ends with an investor-facing dashboard because I wanted a project where data acquisition mattered as much as modeling. Instead of starting from a pre-packaged housing dataset, I collected and structured more than **one million** Italian property listings. I then generated a fully synthetic analytical dataset designed to reproduce broad distributions and correlations—not individual listings—trained a rental-price model, and used the results to identify areas with potentially high returns.

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
    End-to-end data pipeline from collection to interactive dashboard. See the <a href="{{ '/licensing/' | relative_url }}">icon attributions</a>.
</div>

What I did was:
- I scraped rentals, sales, and auction listings for all Italian provinces, for a total of roughly **one million listings**.
- I built an ETL pipeline that cleaned, translated, and organized the data into an analytics-ready warehouse.
- I developed a custom algorithm to generate new synthetic rows that preserve useful aggregate structure without copying source listings.
- I trained a simple Random Forest model to estimate rental income from property features.
- I published the outputs in a Tableau dashboard designed for investors exploring ROI.

---

## Results

{% include dashboards/italian-real-estate-dashboard.html %}

<br>
(The dashboard works best on desktops or tablets. You can also open it in full screen by clicking <a href="https://public.tableau.com/views/Italianrealestate/Dashboard_1?:language=en-US&:sid=&:redirect=auth&:display_count=n&:origin=viz_share_link" target="_blank">here</a>)

### Key Findings
Analyzing the synthetic dataset (designed to preserve the key statistical relationships of the original data) I identified the following insights:
- **Auction properties outperform regular sales**, even after accounting for significant renovation costs.
- **Energy efficiency impacts rent less than expected**; lower-rated properties often rent for similar amounts.
- **Rural areas often deliver higher returns** than urban ones.
- **No clear North-South divide** appears in profitability; interesting opportunities exist across the country.

**Note:** The rental-income model is deliberately simple. It captures broad trends (R² = 0.75 on the synthetic study data), but it is not suitable for precise pricing. The system explores area-level patterns; it does not claim exact property-level forecasts or investment recommendations.

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
- The rental-income model captures broad trends in the synthetic study data (R² = 0.75), but is not suitable for precise pricing.
- The data is a snapshot from early 2025, so the listings are now outdated.
- Results are *all* based on synthetic data rather than the original scraped listings.
- The synthetic generator was designed to break row-level correspondence with the source data, but it was not evaluated as a formal privacy guarantee.
- Listing availability and collection permissions can change; anyone reproducing the pipeline must obtain current authorization and follow the source site's terms.

---

## Deep Dive
Full scraping, ETL, synthetic data, and modeling details are in [Technical Appendix: Real Estate Data Pipeline and ROI Modeling](/blog/2025/italian-real-estate-deep-dive/).

---

## Related Blog Posts
- [When CTGAN Failed to Preserve the Correlations That Mattered](/blog/2025/synthetic-data-ctgan/): The decision to abandon an off-the-shelf synthetic tabular data generator when it failed on the correlations that actually mattered.
- [Moving the Real Estate Pipeline from MongoDB to PostgreSQL](/blog/2025/mongodb-postgresql-ml/): How the storage layer changed as the project moved from messy scraping to analytics-ready modeling.

---

## View the Code
The public, reusable parts of the code are available on [GitHub](https://github.com/LeonardoPaccianiMori/portfolio-italian-real-estate).

**Data boundary:** the original listings came from Immobiliare.it. Neither source listings nor the synthetic row-level dataset are distributed in the repository. The public dashboard and this page retain aggregate study results, while code that would enable direct reuse of the original collection process is excluded.
