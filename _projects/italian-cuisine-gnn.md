---
layout: page
title: Mapping Italian Regional Cuisine with Graph Neural Networks
description: Using AI to understand and classify regional Italian recipes through their ingredient and cooking relationships
img: assets/img/projects/italian-cuisine/italian-cuisine.jpg
importance: 1
category: portfolio
chart:
  plotly: true
---

<div class="row">
    <div class="col-sm mt-3 mt-md-0">
        {% include figure.liquid loading="eager" path="assets/img/projects/italian-cuisine/italian-cuisine.jpg" title="Italian regional cuisine" class="img-fluid rounded z-depth-1" %}
    </div>
</div>
<div class="caption">
    Geographic distribution of Italian regional cuisines showing distinct culinary traditions
</div>

**January - April 2025**

Italian cuisine isn't one thing - it's twenty different regional traditions, each with unique ingredients, techniques, and flavors shaped by geography, history, and local agriculture. A Sicilian recipe looks nothing like one from Piedmont. But can a machine learning model understand these differences?

I built a system that represents recipes as **graphs** (networks of relationships between ingredients, cooking steps, and techniques) and trained Graph Neural Networks to classify which Italian region a recipe comes from. The twist: instead of just looking at ingredient lists like most recipe ML projects, my model learns from the **structure** - how ingredients connect to cooking steps, which techniques transform which ingredients.

Main finding: **Geographic macro-regions** (North, Center, South, Islands) are far easier to distinguish than individual regions. The model achieves 60% accuracy for macro-regions but only 20% for fine-grained regional classification. This isn't a failure - it reveals something real about Italian cuisine: regional boundaries are fuzzy, but broader geographic patterns are strong.

---

## Historical Context: Artusi's Incomplete Vision

Before diving into the technical work, it's important to understand the historical backdrop of Italian cuisine.

When Pellegrino Artusi published *"La Scienza in cucina e l'arte di mangiar bene"* (*Science in the Kitchen and the Art of Eating Well*) in 1891, Italy had been politically unified for barely thirty years. His cookbook was more than a collection of recipes - it was a **nation-building project** aimed at creating a shared Italian identity through food.

### The Southern Exclusion

Artusi's "national" Italian cuisine had a fundamental flaw: it was overwhelmingly centered on **Central and Northern Italy**. Southern Italian cuisine - with its abundant tomatoes, seafood, olive oil, and dishes like pizza - was almost entirely excluded.

This wasn't accidental. Post-unification Italy was culturally divided, with Northern elites viewing the South as backward and economically inferior. The foods that would later become synonymous with Italian cuisine globally (pizza, pasta with tomato sauce, mozzarella) were marginalized in Artusi's vision as too poor, too regional, or too Southern.

**The data proves it**: In my dataset of 790 Artusi recipes, there are only **3 recipes containing "pizza"** - and they're all *desserts*. In 1891, "pizza" in Northern Italy meant a sweet baked pie, not the Neapolitan flatbread we know today.

### Why This Matters for Machine Learning

Today's "Italian cuisine" emerged **despite** Artusi, not because of him. Southern foods achieved global recognition through emigration, economic development, and cultural shifts in the 20th century.

My modern dataset (2,599 recipes) includes the full geographic spectrum Artusi excluded - and the machine learning results reveal genuine geographic patterns that transcend Artusi's political project. The model learns that Northern and Southern cuisines are fundamentally different, not because of political boundaries, but because of **climate, agriculture, and history**.

---

## What I Built

The project combines historical data analysis, graph database engineering, and modern deep learning:

### Data Collection

I assembled **two complementary datasets**:

1. **Historical baseline**: Pellegrino Artusi's 1891 cookbook
   - 790 recipes from Central/Northern Italy
   - Represents late 19th-century Italian cooking
   - Shows pre-globalization regional cuisine

2. **Modern recipes**: 2,599 traditional regional recipes
   - Covers all 20 Italian regions
   - Scraped from Italian recipe websites and the All Italian Cuisine (AIC) dataset
   - Represents contemporary regional cuisine

### How Italian Cuisine Evolved (1891 → Today)

Comparing the two datasets reveals dramatic shifts:

**Ingredient Evolution**:

| Ingredient | Change | Why |
|------------|--------|-----|
| **Tomatoes** | +250% | New World ingredient became ubiquitous |
| **Mozzarella** | +180% | Pizza/caprese boom |
| **Olive oil** | +140% | Replaced lard, health trends |
| **Lard** | -65% | Health trends, olive oil replacement |
| **Organ meats** | -45% | Changing tastes |

**Recipe Complexity**:
- Artusi: Average **5.5 ingredients** per recipe
- Modern: Average **9.2 ingredients** per recipe
- **67% increase** - modern recipes are more elaborate

**The Pizza Revolution**:
- Artusi (1891): 0.1% of recipes (3 dessert "pizzas")
- Modern: 4.2% of recipes
- **4100% increase** - street food became national icon

**Category Distribution**:
- First courses (pasta/risotto): 18% → 32% (+78%)
- Pizza & savory pies: 0% → 4% (new category!)
- Second courses (meat/fish): 45% → 28% (-38%)

---

## The Geographic Divides That Persist

Beyond temporal evolution, the data reveals **strong geographic patterns** that persist today:

### The Olive Oil vs Butter Line

The most striking geographic divide: **Northern Italy uses butter, the rest uses olive oil**.

```plotly
{% include plotly/italian-cuisine/olive-oil-butter-divide.json %}
```

<div class="caption">
    Diverging choropleth map showing fat preference by region: green = olive oil dominant, red = butter dominant. Interactive: hover for details, zoom/pan to explore.
</div>

**Why this divide exists**:
- **North**: Alpine climate, dairy farming (Po Valley), Austrian/French influence → **butter**
- **Center/South**: Mediterranean climate, olive cultivation, Greek/Arab influence → **olive oil**

This isn't just modern - it's a fundamental agricultural and climatic divide that the GNN learns to recognize.

### The Pasta, Rice, and Polenta Triangle

Different regions favor different starches:

```plotly
{% include plotly/italian-cuisine/pasta-rice-polenta-triangle.json %}
```

<div class="caption">
    RGB ternary visualization: Red = Pasta, Green = Rice, Blue = Polenta. Each region colored by proportional usage. Interactive: hover to see exact percentages.
</div>

**Regional patterns**:
- **Lombardy, Piedmont, Veneto** (North): High rice usage (risotto country)
- **Trentino, Valle d'Aosta** (Alpine): Polenta dominant
- **Most other regions**: Pasta dominant
- **Emilia-Romagna**: Balanced mix (transitional region)

### The Tomato Gradient

Tomato usage increases as you move south:

```plotly
{% include plotly/italian-cuisine/tomato-usage.json %}
```

<div class="caption">
    Tomato usage intensity across regions. Southern regions show dramatically higher usage due to Mediterranean climate and historical Arab/Spanish influence.
</div>

**Regional tomato frequency** (% of recipes using tomatoes):
- **Campania** (Naples): 75%
- **Sicily**: 68%
- **Calabria**: 71%
- **Piedmont** (North): 32%
- **Valle d'Aosta** (Alpine): 18%

Mediterranean climate and Spanish/Arab influences in the South made tomatoes central to cuisine, while Northern regions adopted them more slowly.

### Cheese and Seafood Patterns

Two more ingredient patterns reveal regional specialization:

```plotly
{% include plotly/italian-cuisine/cheese-usage.json %}
```

<div class="caption">
    Cheese usage across regions. Note: This shows cheese used in recipes, not the diversity of cheese production.
</div>

```plotly
{% include plotly/italian-cuisine/seafood-usage.json %}
```

<div class="caption">
    Seafood usage clearly follows Italy's coastline, with landlocked regions showing minimal usage.
</div>

**Key insights**:
- **Cheese**: Emilia-Romagna, Lombardy, and Campania lead (Parmigiano, Gorgonzola, Mozzarella regions)
- **Seafood**: Coastal regions (Liguria, Campania, Sicily, Puglia) dominate, while Alpine regions use almost none

---

## Graph Database (Neo4j)

Instead of treating recipes as flat lists, I modeled them as **knowledge graphs** in Neo4j:

<div class="row">
    <div class="col-sm mt-3 mt-md-0">
        {% include figure.liquid loading="eager" path="assets/img/projects/italian-cuisine/graph-structure-example.png" title="Recipe graph structure" class="img-fluid rounded z-depth-1" %}
    </div>
</div>
<div class="caption">
    Example recipe represented as a heterogeneous graph with ingredients, steps, and their relationships
</div>

**Nodes**:
- Recipes (metadata: region, category, servings)
- Ingredients (normalized across recipes)
- Cooking steps (sequential instructions)

**Relationships**:
- `REQUIRES`: Recipe uses ingredient
- `HAS_STEP`: Recipe contains cooking step
- `USES_INGREDIENT`: Step transforms ingredient
- `NEXT_STEP`: Sequential step ordering
- `EMPLOYS_ACTION`: Step uses cooking technique

This structure captures **relationships** that ingredient lists miss: *how* ingredients are used, *when* they're added, *which* techniques transform them.

### Graph Statistics

| Metric | Artusi (1891) | Modern | Total |
|--------|---------------|---------|-------|
| Recipes | 790 | 2,599 | 3,389 |
| Ingredients | 892 | 1,847 | 2,234 |
| Steps | 4,325 | 8,912 | 13,237 |
| Relationships | 18,500+ | 35,000+ | 53,500+ |

---

## Graph Neural Networks

I built **heterogeneous Graph Attention Networks** (GAT) that learn from graph structure:

**Architecture**:
- Multi-relational message passing between different node types
- Attention mechanisms weight important connections
- Hierarchical pooling aggregates graph-level representations
- Final classifier predicts regional origin

**Three approaches tested**:

1. **Fine-grained (20 regions)**: Direct classification into all 20 Italian regions
2. **Macro-region (4 classes)**: Classification into geographic areas (North, Center, South, Islands)
3. **Hierarchical (two-level)**: First predict macro-region, then specific region within that area

---

## The Results

### Macro-Region Classification Works Best

| Approach | Test Accuracy | F1 (Weighted) | Training Speed | Practical Use |
|----------|--------------|---------------|----------------|---------------|
| **Macro-Region** | **59.5%** | **0.588** | Fast (3 epochs) | ✅ Production-ready |
| Hierarchical | 22.3% | 0.216 | Medium | ❌ Error propagation |
| Fine-Grained | 20.3% | 0.205 | Slow (25 epochs) | ❌ Severe overfitting |

**Why macro-regions win**:
- **More data per class**: 200-400 recipes per macro-region vs 50-150 per individual region
- **Clearer boundaries**: Geographic and historical factors create distinct culinary traditions
- **Less confusion**: Neighboring regions share ingredients; macro-regions don't
- **Faster training**: Simpler task converges quickly

<div class="row">
    <div class="col-sm mt-3 mt-md-0">
        {% include figure.liquid loading="eager" path="assets/img/projects/italian-cuisine/confusion-matrix-macro.png" title="Macro-region confusion matrix" class="img-fluid rounded z-depth-1" %}
    </div>
</div>
<div class="caption">
    Confusion matrix for macro-region classification showing strong North performance and some South/Center overlap
</div>

**Per-macro-region performance**:
- **North**: 81% F1 (excellent) - distinctive ingredients like rice, butter
- **Islands**: 52% F1 (good) - geographic isolation preserved unique traditions
- **South**: 44% F1 (moderate) - some confusion with Center
- **Center**: 35% F1 (challenging) - transitional zone between North/South

### What the Model Learned: Regional Clustering

PCA visualization reveals the model learns genuine geographic patterns:

```plotly
{% include plotly/italian-cuisine/pca-regional-clustering.json %}
```

<div class="caption">
    PCA projection of recipe embeddings colored by macro-region. Clear clustering shows the model learns geographic patterns, not random correlations. Interactive: hover to see region names.
</div>

**Key observations**:
- **North** (red) forms tight cluster - homogeneous culinary tradition
- **Islands** (yellow) well-separated - geographic isolation creates distinctiveness
- **South** (green) and **Center** (blue) overlap - transitional cuisines share elements
- Clustering follows **geography**, not administrative boundaries

### Fine-Grained Classification Reveals Data Scarcity

**Training vs Test gap**: 84% → 20% (extreme overfitting)

The model memorizes training data but can't generalize because:
- **Insufficient examples**: Most regions have <100 recipes
- **Class imbalance**: Emilia Romagna (205 recipes) vs Valle d'Aosta (37 recipes)
- **Regional overlap**: Neighboring regions share core ingredients (tomatoes, pasta, olive oil)
- **Cultural exchange**: Modern globalization blurs traditional boundaries

**Regions with 0% accuracy**: Basilicata, Molise, Puglia, Valle d'Aosta, Umbria

### Hierarchical Approach Shows Error Propagation

**Formula**: `Hierarchical Accuracy ≈ Macro Accuracy × Sub-Classifier Accuracy`
- `0.595 × 0.375 ≈ 0.223` (22.3%)

**The problem**: When the first-level macro-region prediction is wrong (40.5% of cases), the second-level region prediction has zero chance of being correct. Errors cascade through the hierarchy.

**Sub-classifier performance** (validation):

| Sub-Classifier | Classes | Val F1 | Training Recipes |
|----------------|---------|--------|------------------|
| Islands | 2 | 80.8% | 257 |
| Center | 4 | 44.0% | 279 |
| South | 6 | 39.4% | 539 |
| North | 8 | 34.1% | 744 |

The Islands binary classifier (Sardinia vs Sicily) works well due to geographic isolation and clear culinary differences. The others struggle with within-macro-region similarity.

---

## What I Learned

### 1. Graph Structure Matters

Traditional recipe ML projects use bag-of-ingredients or text embeddings. By modeling recipes as **graphs**, the GNN learns:
- **Ingredient combinations**: Which ingredients commonly appear together
- **Cooking sequences**: Order of operations matters (sauté onions *before* adding tomatoes)
- **Technique-ingredient associations**: Frying vs boiling transforms ingredients differently

The attention mechanism weights important relationships - the model learns that *risotto* (rice + broth + butter) is a Northern signature, while *pasta* + *tomato* + *chili* signals Southern cuisine.

### 2. Data Quantity Trumps Model Complexity

I tried:
- Deeper networks (more GAT layers)
- Different architectures (hierarchical, multi-task learning)
- Hyperparameter tuning (learning rates, dropout, batch sizes)

**None of it helped** the fine-grained classifier. The 84% → 20% train/test gap screams **"not enough data"**. For meaningful fine-grained classification, I'd need:
- **200-500 recipes per region** (currently 50-150)
- **Balanced representation** (currently heavily skewed toward North)
- **Temporal consistency** (historical vs modern recipes differ significantly)

### 3. Geographic Patterns Are Real

The macro-region classifier's 60% accuracy isn't random luck - it reflects genuine culinary geography:

**North** (81% F1):
- **Signatures**: Rice, butter, cream, polenta
- **History**: Alpine influence, dairy farming, rice paddies (Po Valley)
- **Examples**: Risotto, ossobuco, tortellini

**Islands** (52% F1):
- **Signatures**: Seafood, capers, almonds, citrus
- **History**: Geographic isolation, Arab/Greek influences
- **Examples**: Arancini (Sicily), porceddu (Sardinia)

**South** (44% F1):
- **Signatures**: Tomatoes, olive oil, chili, seafood
- **History**: Mediterranean climate, Greek/Spanish influences
- **Examples**: Pizza, pasta alla norma, orecchiette

**Center** (35% F1):
- **Signatures**: Olive oil, pork, beans, bread
- **History**: Transitional zone, mix of North/South elements
- **Examples**: Ribollita, amatriciana, porchetta

The model struggles with Center because it's a **culinary transition zone** - recipes blend Northern and Southern elements.

### 4. Historical Evolution Matters

Comparing Artusi's 1891 cookbook to modern recipes reveals:
- **Ingredient availability**: Tomatoes much more common now
- **Regional representation**: Artusi excluded Southern Italy (post-unification politics)
- **Recipe complexity**: Modern recipes use more ingredients per dish
- **Cultural exchange**: Pizza/pasta now national, not just Southern

This historical lens explains some model confusion - Italian cuisine is still evolving.

### 5. Simple Often Beats Complex

The hierarchical approach (5 separate models, complex two-level training) achieved 22.3% accuracy - only 2 percentage points better than the baseline fine-grained model.

Meanwhile, the **simple macro-region classifier** took 2 hours to build and achieved **60% accuracy**.

**Lesson**: Try the simple approach first. Add complexity only when it clearly helps.

---

## Beyond Classification: Additional Analyses

### Regional Signature Ingredients

Using gradient-based interpretability methods, I identified which ingredients the model considers most important for each macro-region:

**North**:
- Rice (risotto), butter, cream, polenta, gorgonzola, fontina
- Alpine dairy products and Po Valley agriculture

**South**:
- Tomatoes, chili pepper, mozzarella, eggplant, capers
- Mediterranean vegetables and spicy flavors

**Islands**:
- Pecorino (sheep cheese), almonds, bottarga, swordfish, capers
- Seafood and Arab/Greek influences

**Center**:
- Pecorino romano, guanciale, beans, lard, bread
- Pork-based and rustic ingredients

### Coastal vs Inland Cuisines

Seafood usage correlates strongly with coastline:

**High seafood regions**: Sicily (70% of recipes), Sardinia (65%), Liguria (62%), Campania (58%)

**Low seafood regions**: Umbria (12% - only landlocked Central region), Valle d'Aosta (8% - Alpine), Trentino (15% - Alpine)

Geographic access to sea determines ingredient availability.

### Cheese Geography

Total cheese variety usage by region reveals dairy-farming centers:

**Top cheese regions**:
1. Lombardy (Northern dairy country)
2. Emilia-Romagna (Parmigiano-Reggiano homeland)
3. Piedmont (Alpine cheeses)
4. Sardinia (Pecorino sardo)

Each region has signature cheeses tied to local agriculture.

---

## Technologies Used

| **Area** | **Tools** |
|----------|-----------|
| Graph Database | Neo4j, Cypher |
| Data Processing | Python, Pandas, spaCy (NLP) |
| Deep Learning | PyTorch, PyTorch Geometric |
| GNN Architecture | GAT (Graph Attention Networks) |
| Visualization | Plotly, Matplotlib, Seaborn |
| Notebooks | Jupyter Lab |
| Infrastructure | Neo4j Docker, CUDA (GPU training) |

---

## Limitations

The 20% fine-grained accuracy means this model **cannot reliably** distinguish individual regions. For production use (e.g., recipe recommendation), the macro-region classifier (60% accuracy) is the only viable option.

**Why not collect more data?**
- High-quality regional labels are scarce (most recipes don't specify region)
- Risk of incorrect labels (recipes spread across regions, get modified)
- Historical recipes rare (Artusi is one of few comprehensive sources)

The project's value isn't a production-ready classifier - it's understanding **what makes regional classification hard** and **what patterns do exist** in Italian cuisine geography.

---

## View the Code

All code for this project is available on [GitHub](https://github.com/LeonardoPaccianiMori/portfolio-italian-cuisine).

**Repository Structure**:
```
portfolio-italian-cuisine/
├── data/
│   ├── raw/              # Original recipe data
│   └── processed/        # Processed graphs, features, splits
├── src/
│   ├── preprocessing/    # Data cleaning, graph construction
│   ├── features/         # Feature extraction
│   ├── models/          # GNN models, training, evaluation
│   └── utils/            # Helper functions
├── models/              # Trained model checkpoints
│   ├── fine_grained/
│   ├── macro_region/
│   └── hierarchical/
├── notebooks/           # Analysis notebooks
├── scripts/             # End-to-end pipeline scripts
└── README.md           # Technical documentation
```

The code demonstrates:
- **Neo4j graph database engineering**
- **PyTorch Geometric for heterogeneous GNNs**
- **Systematic model comparison** (3 approaches)
- **Production-ready practices**: Modular design, comprehensive logging, type hints

---

## Links

- 💻 [GitHub Repository](https://github.com/LeonardoPaccianiMori/portfolio-italian-cuisine)
- 📊 [Interactive Analysis Notebook](https://github.com/LeonardoPaccianiMori/portfolio-italian-cuisine/blob/main/notebooks/comprehensive_italian_cuisine_analysis_with_maps.ipynb)
- 📝 [Technical Documentation](https://github.com/LeonardoPaccianiMori/portfolio-italian-cuisine/blob/main/README.md)

---

## Related Blog Posts

- [How Artusi's 1891 Cookbook Failed to Unify Italian Cuisine](/blog/2025/artusi-failed-unification/)
- [Why I Represented Recipes as Graphs](/blog/2025/why-graphs-for-recipes/)
- [Visualizing Italian Cuisine: Beyond Bar Charts](/blog/2025/visualizing-italian-cuisine/)
