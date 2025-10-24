---
layout: post
title: "From MongoDB to PostgreSQL: Database Architecture for ML Projects"
date: 2025-06-20 10:30:00
description: Why I used both NoSQL and SQL databases in my data pipeline, and when each makes sense
tags: data-engineering databases architecture
categories: data-science
# thumbnail: assets/img/blog/databases/thumbnail.jpg 
featured: false
---

## The Problem: From Raw HTML to ML-Ready Data

In my [Italian Real Estate project](/projects/italian-real-estate/), I needed to build a pipeline that transformed messy web data into clean, ML-ready datasets.

**The journey:**
1. Scrape 1M+ property listings from Italian real estate websites (raw HTML)
2. Extract 50+ fields from unstructured HTML
3. Translate Italian text to English
4. Create a normalized, relational schema
5. Train ML models to predict rental prices

**The question:** What database architecture supports this progression from chaos to structure?

**The answer:** Use **both** MongoDB (datalake + warehouse) and PostgreSQL (analytics-ready), with clear transitions between them.

This post explains why I made this choice and how the multi-database architecture evolved.

---

## The Three-Layer Architecture

<div class="row">
    <div class="col-sm mt-3 mt-md-0">
        {% include figure.liquid loading="eager" path="assets/img/projects/italian-real-estate/italian-real-estate-project-structure.png" title="Data pipeline architecture" class="img-fluid rounded z-depth-1" %}
    </div>
</div>
<div class="caption">
    Three-layer architecture: MongoDB datalake → MongoDB warehouse → PostgreSQL analytics database
</div>

### Layer 1: MongoDB Datalake (Raw HTML)

**Contents:** Raw HTML from web scraping

**Why MongoDB?**
- ✅ **Schema flexibility**: Each listing might have different fields
- ✅ **Nested data**: HTML structure is hierarchical
- ✅ **Fast writes**: Scraping generates data quickly
- ✅ **Temporal tracking**: Store multiple scrapes over time

**Schema:**
```javascript
{
  "_id": ObjectId("..."),
  "url": "https://immobiliare.it/...",
  "html": "<html>...</html>",  // Raw HTML
  "timestamp": ISODate("2025-01-15T10:30:00Z"),
  "province": "Milan",
  "listing_type": "rent"
}
```

**Why not PostgreSQL here?**
- HTML is unstructured → No fixed schema yet
- Don't know what fields exist until parsing
- Need flexibility during exploration

### Layer 2: MongoDB Warehouse (Structured Documents)

**Contents:** Extracted, structured data (still in JSON/document format)

**Why MongoDB?**
- ✅ **Still evolving schema**: Discovering new fields during ETL
- ✅ **Nested structures**: Amenities, features as sub-documents
- ✅ **Easy iteration**: Can add/remove fields without migrations

**Schema:**
```javascript
{
  "_id": ObjectId("..."),
  "listing_id": "12345",
  "price": 1200,
  "surface": 85,
  "rooms": 3,
  "location": {
    "latitude": 45.4642,
    "longitude": 9.1900,
    "province": "Milan",
    "city": "Milano"
  },
  "amenities": {
    "elevator": true,
    "balcony": true,
    "parking": false
  },
  "energy": {
    "class": "B",
    "consumption": 75.5
  },
  "scraped_at": ISODate("..."),
  "language": "Italian"
}
```

**This is the "messy middle" layer** where data is structured but not yet normalized.

### Layer 3: PostgreSQL (ML-Ready Analytics)

**Contents:** Normalized, relational, ML-ready data

**Why PostgreSQL?**
- ✅ **Relational integrity**: Foreign keys, constraints
- ✅ **Query performance**: Joins, aggregations, indexes
- ✅ **Data normalization**: No redundancy (snowflake schema)
- ✅ **Type safety**: Strong typing for ML features
- ✅ **Standard SQL**: Compatible with ML tools (pandas, scikit-learn)

**Schema (Snowflake):**

<div class="row">
    <div class="col-sm mt-3 mt-md-0">
        {% include figure.liquid loading="eager" path="assets/img/projects/italian-real-estate/PostgreSQL_warehouse_ERD.png" title="PostgreSQL schema" class="img-fluid rounded z-depth-1" %}
    </div>
</div>
<div class="caption">
    PostgreSQL snowflake schema with fact table (listings) and dimension tables
</div>

```sql
-- Fact table
CREATE TABLE listings (
    listing_id SERIAL PRIMARY KEY,
    price NUMERIC(10, 2),
    surface NUMERIC(8, 2),
    rooms INTEGER,
    property_type_id INTEGER REFERENCES property_types(id),
    energy_class_id INTEGER REFERENCES energy_classes(id),
    province_id INTEGER REFERENCES provinces(id),
    latitude NUMERIC(10, 7),
    longitude NUMERIC(10, 7),
    elevator BOOLEAN,
    balcony BOOLEAN,
    -- ... 40+ more fields
);

-- Dimension tables (normalized)
CREATE TABLE property_types (
    id SERIAL PRIMARY KEY,
    name VARCHAR(50) UNIQUE
);

CREATE TABLE energy_classes (
    id SERIAL PRIMARY KEY,
    class CHAR(1) UNIQUE,
    description TEXT
);

-- ... more dimension tables
```

**This is the final, clean layer** optimized for ML model training.

---

## Why Not Just Use One Database?

### Why Not PostgreSQL for Everything?

**Could I have used PostgreSQL from the start?**

Technically yes, but it would have been painful:

**Problems with PostgreSQL for raw data:**

1. **Schema rigidity**
   - Need to define schema upfront
   - Adding fields requires migrations
   - Early exploration is slow

2. **Messy nested data**
   - HTML parsing produces inconsistent structures
   - Would need JSONB columns (loses benefits of relational DB)

3. **Rapid iteration**
   - During ETL development, schema changes constantly
   - ALTER TABLE for every discovery is tedious

**Example pain point:**

```sql
-- Week 1: Define schema
CREATE TABLE raw_listings (
    id SERIAL,
    html TEXT,
    price INTEGER
);

-- Week 2: Realize need more fields
ALTER TABLE raw_listings ADD COLUMN surface NUMERIC;
ALTER TABLE raw_listings ADD COLUMN energy_class VARCHAR(10);

-- Week 3: More discoveries
ALTER TABLE raw_listings ADD COLUMN heating_type VARCHAR(50);
ALTER TABLE raw_listings ADD COLUMN building_year INTEGER;

-- Week 4: Realize structure was wrong, need to denormalize differently
-- ... painful restructuring
```

With MongoDB, I could just add fields as I discovered them:

```javascript
// Week 1
db.listings.insertOne({price: 1200})

// Week 2
db.listings.insertOne({price: 1200, surface: 85, energy_class: "B"})

// Week 3
db.listings.insertOne({price: 1200, ..., heating_type: "autonomous"})

// No migrations needed!
```

### Why Not MongoDB for Everything?

**Could I have trained ML models directly on MongoDB?**

Also yes, but suboptimal:

**Problems with MongoDB for ML:**

1. **Query performance**
   - Joins are awkward (manual `$lookup` or client-side)
   - Aggregations are verbose
   - Slower than SQL for analytical queries

2. **Data integrity**
   - No foreign keys → Data can be inconsistent
   - No type enforcement → Strings mixed with numbers
   - ML models need clean, consistent data

3. **ML tooling**
   - Pandas, scikit-learn expect flat, relational data
   - Would need to flatten JSON every time

**Example query comparison:**

**MongoDB** (get average price by property type):
```javascript
db.listings.aggregate([
  {$group: {
    _id: "$property_type",
    avg_price: {$avg: "$price"}
  }},
  {$sort: {avg_price: -1}}
])
```

**PostgreSQL** (same query):
```sql
SELECT pt.name, AVG(l.price) as avg_price
FROM listings l
JOIN property_types pt ON l.property_type_id = pt.id
GROUP BY pt.name
ORDER BY avg_price DESC;
```

For simple queries, MongoDB is fine. But ML feature engineering involves **complex joins, window functions, and aggregations**. SQL shines here.

---

## The ETL Pipeline: MongoDB → PostgreSQL

### Phase 1: HTML → Structured Documents (MongoDB Datalake → Warehouse)

**Airflow DAG:**

```python
from airflow import DAG
from airflow.operators.python import PythonOperator

with DAG('mongodb_etl', schedule='@daily') as dag:

    def extract_from_html():
        """Parse HTML and extract structured fields"""
        from bs4 import BeautifulSoup
        import pymongo

        mongo = pymongo.MongoClient()
        datalake = mongo['real_estate_datalake']
        warehouse = mongo['real_estate_warehouse']

        for doc in datalake['raw_listings'].find():
            soup = BeautifulSoup(doc['html'], 'html.parser')

            # Extract fields
            listing = {
                'listing_id': extract_listing_id(soup),
                'price': extract_price(soup),
                'surface': extract_surface(soup),
                'location': extract_location(soup),
                # ... 50+ more fields
            }

            warehouse['listings'].insert_one(listing)

    extract_task = PythonOperator(
        task_id='extract_structured_data',
        python_callable=extract_from_html
    )
```

**Key steps:**
1. Read raw HTML from datalake
2. Parse with BeautifulSoup
3. Extract structured fields
4. Store in warehouse (still MongoDB)

### Phase 2: Structured Documents → Relational (MongoDB → PostgreSQL)

**Migration script:**

```python
import pymongo
import psycopg2
from psycopg2.extras import execute_batch

def migrate_to_postgresql():
    # Connect to both databases
    mongo = pymongo.MongoClient()
    pg_conn = psycopg2.connect("dbname=real_estate ...")
    pg_cursor = pg_conn.cursor()

    # Migrate dimension tables first (for foreign keys)
    property_types = set()
    energy_classes = set()

    for doc in mongo['real_estate_warehouse']['listings'].find():
        property_types.add(doc.get('property_type'))
        energy_classes.add(doc.get('energy_class'))

    # Insert dimension tables
    execute_batch(pg_cursor,
        "INSERT INTO property_types (name) VALUES (%s) ON CONFLICT DO NOTHING",
        [(pt,) for pt in property_types]
    )
    # ... same for energy_classes, provinces, etc.

    # Migrate fact table (listings)
    batch = []
    for doc in mongo['real_estate_warehouse']['listings'].find():
        row = (
            doc['price'],
            doc['surface'],
            doc['rooms'],
            lookup_property_type_id(doc['property_type']),
            lookup_energy_class_id(doc['energy_class']),
            doc['location']['latitude'],
            doc['location']['longitude'],
            # ... 40+ more fields
        )
        batch.append(row)

        if len(batch) >= 1000:
            execute_batch(pg_cursor,
                "INSERT INTO listings (price, surface, ...) VALUES (%s, %s, ...)",
                batch
            )
            batch = []

    pg_conn.commit()
```

**Key steps:**
1. Extract unique values for dimension tables
2. Insert dimension tables first (for FK references)
3. Flatten nested JSON into relational rows
4. Batch insert for performance

---

## The Translation Layer: Italian → English

One complication: All scraped data was in Italian, but I wanted ML models to work with English.

**Where to translate?** Between MongoDB warehouse and PostgreSQL.

### Translation Pipeline

**Architecture:**

```
MongoDB Warehouse (Italian)
         ↓
   Translation Layer
    - LibreTranslate API
    - SQLite cache
    - Custom dictionary
         ↓
PostgreSQL (English)
```

**Implementation:**

```python
import sqlite3
import requests

class TranslationCache:
    def __init__(self):
        self.conn = sqlite3.connect('translation_cache.db')
        self.create_table()

    def create_table(self):
        self.conn.execute('''
            CREATE TABLE IF NOT EXISTS translations (
                italian TEXT PRIMARY KEY,
                english TEXT,
                field_name TEXT
            )
        ''')

    def translate(self, text, field):
        """Translate with caching"""
        # Check cache
        cached = self.conn.execute(
            'SELECT english FROM translations WHERE italian = ?',
            (text,)
        ).fetchone()

        if cached:
            return cached[0]

        # Check custom dictionary
        if text in REAL_ESTATE_DICTIONARY:
            return REAL_ESTATE_DICTIONARY[text]

        # Call LibreTranslate API
        response = requests.post('http://localhost:5000/translate', json={
            'q': text,
            'source': 'it',
            'target': 'en'
        })
        translated = response.json()['translatedText']

        # Cache result
        self.conn.execute(
            'INSERT INTO translations VALUES (?, ?, ?)',
            (text, translated, field)
        )
        self.conn.commit()

        return translated

# Custom real estate dictionary
REAL_ESTATE_DICTIONARY = {
    'cucina abitabile': 'eat-in kitchen',
    'occupato': 'inhabited',
    'libero': 'vacant',
    'piano terra': 'ground floor',
    'ultimo piano': 'top floor',
    # ... 100+ phrases
}
```

**Performance:**
- **1M+ translations needed**
- **Cache hit rate**: ~80% (many repeated phrases)
- **Custom dictionary**: Handles domain-specific jargon
- **Total time**: ~6 hours (would be 30+ hours without caching)

---

## Performance Comparison: MongoDB vs PostgreSQL

I ran the same analytical queries on both databases to compare:

| **Query** | **MongoDB** | **PostgreSQL** | **Winner** |
|-----------|-------------|----------------|------------|
| Simple filter (price > 1000) | 120ms | 45ms | PostgreSQL |
| Group by + aggregate | 850ms | 180ms | PostgreSQL |
| Join 3 tables | 2.1s (manual) | 320ms | PostgreSQL |
| Complex analytics query | 5.8s | 1.2s | PostgreSQL |
| Full table scan | 3.2s | 2.8s | PostgreSQL |

**For ML feature engineering** (lots of joins, aggregations, window functions): **PostgreSQL is 3-5× faster**.

---

## Lessons Learned

### 1. Use the Right Tool for Each Stage

**MongoDB for early, exploratory stages:**
- Schema is evolving
- Data is messy/nested
- Fast iteration matters more than query performance

**PostgreSQL for analytics and ML:**
- Schema is stable
- Need complex queries
- Data integrity matters

**Don't force one database to do everything.**

### 2. Data Transformation Is Iterative

My ETL pipeline evolved over weeks:
- Started with 20 fields → Ended with 50+
- Discovered nested structures that needed flattening
- Realized some fields needed custom parsing

**MongoDB's flexibility let me iterate fast** without constant schema migrations.

### 3. Translation at the Right Layer

I initially considered three options:
1. Translate during scraping (too early, brittle)
2. Translate in MongoDB (wrong layer, should stay raw)
3. **Translate during MongoDB → PostgreSQL migration** ← This worked

**Why option 3?**
- MongoDB has raw Italian (preserves source)
- Translation happens once in batch (efficient)
- PostgreSQL gets clean English (ready for ML)

### 4. Normalization Reduces Redundancy

In MongoDB warehouse, "Apartment" appeared 400,000+ times as a string.

In PostgreSQL:
- `property_types` table has one row: `(1, 'Apartment')`
- `listings` table references: `property_type_id = 1`

**Storage savings:** ~40% reduction in database size

**Query benefits:** Categorical features are indexed integers, not strings

### 5. Start Simple, Add Complexity When Needed

**Phase 1:** I just used MongoDB (weeks 1-3)
- Got pipeline working
- Explored data structure
- Proved the concept

**Phase 2:** Added PostgreSQL (weeks 4-6)
- Optimized for ML
- Improved query performance
- Enforced data quality

**I didn't architect the "perfect" system upfront.** I evolved it based on needs.

---

## When to Use This Architecture

**Use MongoDB + PostgreSQL when:**

✅ **Data starts messy** (web scraping, APIs, logs)
✅ **Schema evolves during exploration**
✅ **End goal is ML/analytics** (need SQL performance)
✅ **You have time for ETL** (not real-time streaming)

**Just use PostgreSQL when:**

✅ **Schema is known upfront**
✅ **Data is already structured**
✅ **Mainly transactional workload** (CRUD operations)

**Just use MongoDB when:**

✅ **Schema will always be flexible**
✅ **Query patterns are simple** (key-value lookups)
✅ **Horizontal scaling is critical**

---

## Code & Resources

Full pipeline implementation in my [Italian Real Estate repository](https://github.com/LeonardoPaccianiMori/italian-real-estate-pipeline):
- `dags/mongodb_etl_dag.py` - Airflow ETL pipeline
- `dags/postgresql_migration_dag.py` - MongoDB → PostgreSQL migration
- `scripts/translate.py` - Translation layer
- `sql/schema.sql` - PostgreSQL schema definition

**Related posts:**
- [Custom Synthetic Data Algorithm](/blog/2025/synthetic-data-ctgan/) - Using PostgreSQL data for ML
- [Italian Real Estate Project](/projects/italian-real-estate/) - Full pipeline overview

---

## Key Takeaways

1. **Multi-database architectures are valid** - Don't feel obligated to use just one database
2. **Match database to data maturity** - Flexible (MongoDB) for exploration, rigid (PostgreSQL) for production
3. **ETL is where the magic happens** - Transform data to fit the right tool at each stage
4. **Normalization matters for ML** - Clean, typed, non-redundant data = better models
5. **Start simple, evolve based on needs** - Don't over-architect upfront

What database architecture have you used for ML projects? Have you found multi-database pipelines useful? Share your experiences!
