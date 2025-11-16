---
layout: page
title: Mapping Italian Regional Cuisine with Graph Neural Networks
description: Using AI to understand and classify regional Italian recipes through their ingredient and cooking relationships
img: assets/img/projects/italian-cuisine/italian-cuisine-thumbnail.jpg
importance: 1
category: portfolio
---

<div class="row">
    <div class="col-sm mt-3 mt-md-0">
        {% include figure.liquid loading="eager" path="assets/img/projects/italian-cuisine/italian-cuisine-thumbnail.jpg" title="Italian regional cuisine" class="img-fluid rounded z-depth-1" %}
    </div>
</div>
<div class="caption">
    Geographic distribution of Italian regional cuisines showing distinct culinary traditions
</div>

**January - April 2025**

Italian cuisine isn't one thing - it's twenty different regional traditions, each with unique ingredients, techniques, and flavors shaped by geography, history, and local agriculture. A Sicilian recipe looks nothing like one from Piedmont. But can a machine learning model understand these differences?

I built a system that represents recipes as **graphs** (networks of relationships between ingredients, cooking steps, and techniques) and trained Graph Neural Networks to classify which Italian region a recipe comes from. The twist: instead of just looking at ingredient lists like most recipe ML projects, my model learns from the **structure** - how ingredients connect to cooking steps, which techniques transform which ingredients.

Main finding: **Geographic macro-regions** (North, Center, South, Islands) are far easier to distinguish than individual regions. The model achieves 60% accuracy for macro-regions but only 20% for fine-grained regional classification. This isn't a failure - it reveals something real about Italian cuisine: regional boundaries are fuzzy, but broader geographic patterns are strong.

## What I Built

The project combines historical data analysis, graph database engineering, and modern deep learning:

### Data Collection

I assembled **two complementary datasets**:

1. **Historical baseline**: Pellegrino Artusi's 1891 cookbook *"Science in the Kitchen and the Art of Eating Well"*
   - First attempt to unify Italian cuisine post-unification
   - 790 recipes from Central/Northern Italy
   - Represents late 19th-century Italian cooking

2. **Modern recipes**: ~1,200 traditional regional recipes
   - Covers all 20 Italian regions
   - Scraped from Italian recipe websites and the All Italian Cuisine (AIC) dataset
   - Represents contemporary regional cuisine

The historical comparison reveals how Italian cuisine evolved: modern recipes use more ingredients per dish, feature more southern specialties (like pizza), and show ingredient frequency shifts reflecting changing food availability and cultural exchange.

### Graph Database (Neo4j)

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

### Graph Neural Networks

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

## Limitations

The 20% fine-grained accuracy means this model **cannot reliably** distinguish individual regions. For production use (e.g., recipe recommendation), the macro-region classifier (60% accuracy) is the only viable option.

**Why not collect more data?**
- High-quality regional labels are scarce (most recipes don't specify region)
- Risk of incorrect labels (recipes spread across regions, get modified)
- Historical recipes rare (Artusi is one of few comprehensive sources)

The project's value isn't a production-ready classifier - it's understanding **what makes regional classification hard** and **what patterns do exist** in Italian cuisine geography.

---

## Technical Deep Dive

For the curious, here's a deeper look into the technical implementation:

<details markdown="1">
<summary><strong>Graph Database Schema</strong></summary>

## Neo4j Database Design

### Node Types

**Recipe Nodes**:
```cypher
CREATE (r:Recipe {
  title: "Risotto alla Milanese",
  region: "Lombardia",
  macro_region: "North",
  category: "first-course",
  servings: 4,
  source: "modern"
})
```

**Ingredient Nodes** (normalized):
```cypher
CREATE (i:Ingredient {
  name: "arborio rice",
  normalized_name: "rice",
  category: "grain"
})
```

**Step Nodes**:
```cypher
CREATE (s:Step {
  instruction: "Sauté chopped onion in butter until translucent",
  step_number: 1,
  duration_minutes: 3,
  action: "sauté"
})
```

### Relationships

**Recipe-Ingredient** (`REQUIRES`):
```cypher
(recipe)-[:REQUIRES {
  quantity: "320g",
  unit: "grams",
  optional: false
}]->(ingredient)
```

**Recipe-Step** (`HAS_STEP`):
```cypher
(recipe)-[:HAS_STEP {
  order: 1
}]->(step)
```

**Step-Ingredient** (`USES_INGREDIENT`):
```cypher
(step)-[:USES_INGREDIENT {
  quantity: "1",
  unit: "whole"
}]->(ingredient)
```

**Step-Step** (`NEXT_STEP`):
```cypher
(step1)-[:NEXT_STEP {
  order: 2
}]->(step2)
```

### Graph Statistics

| Metric | Artusi (1891) | Modern | Total |
|--------|---------------|---------|-------|
| Recipes | 790 | 1,229 | 2,019 |
| Ingredients | 892 | 1,847 | 2,234 |
| Steps | 4,325 | 8,912 | 13,237 |
| Relationships | 18,500+ | 35,000+ | 53,500+ |

### Cypher Queries for Analysis

**Find signature ingredients by region**:
```cypher
MATCH (r:Recipe {region: 'Sicilia'})-[:REQUIRES]->(i:Ingredient)
WITH i, COUNT(*) AS freq
ORDER BY freq DESC
LIMIT 10
RETURN i.name, freq
```

**Extract recipe subgraph**:
```cypher
MATCH path = (r:Recipe {title: 'Carbonara'})-[:HAS_STEP]->(s:Step)
                      -[:USES_INGREDIENT]->(i:Ingredient)
RETURN path
```

</details>

---

<details markdown="1">
<summary><strong>GNN Architecture</strong></summary>

## Heterogeneous Graph Attention Network

### Model Components

**Input Embeddings**:
```python
# Ingredient embeddings
self.ingredient_embedding = nn.Embedding(
    num_ingredients,
    embed_dim=128
)

# Action embeddings (cooking techniques)
self.action_embedding = nn.Embedding(
    num_actions,
    embed_dim=64
)
```

**GAT Layers** (3 layers):
```python
self.gat_layers = nn.ModuleList([
    HeteroGATConv(
        in_channels={
            'recipe': 128,
            'ingredient': 128,
            'step': 64
        },
        out_channels=256,
        num_heads=4,
        dropout=0.3
    )
    for _ in range(3)
])
```

**Attention Mechanism**:
- Learns importance of different relationships
- 4 attention heads capture diverse patterns
- Dropout (0.3) prevents overfitting

**Graph Pooling**:
```python
# Aggregate node embeddings to graph-level representation
recipe_embedding = global_mean_pool(
    node_embeddings['recipe'],
    batch_indices
)
```

**Classification Head**:
```python
self.classifier = nn.Sequential(
    nn.Linear(256, 128),
    nn.ReLU(),
    nn.Dropout(0.3),
    nn.Linear(128, num_regions)
)
```

### Training Configuration

**Optimizer**: AdamW
- Learning rate: 0.001
- Weight decay: 1e-5 (L2 regularization)

**Loss**: Cross-Entropy with class weights
- Balances class imbalance
- Weights inversely proportional to class frequency

**Early Stopping**:
- Patience: 10 epochs
- Metric: Validation F1 (weighted)

**Batch Size**: 32 recipes per batch

### Model Parameters

| Model | Total Params | Trainable | Training Time (GPU) |
|-------|--------------|-----------|---------------------|
| Fine-Grained (20 classes) | 19.5M | 19.5M | ~2 hours (48 epochs) |
| Macro-Region (4 classes) | 19.5M | 19.5M | ~15 mins (13 epochs) |
| Hierarchical (5 models) | 97.4M | 97.4M | ~1.5 hours (all models) |

</details>

---

<details markdown="1">
<summary><strong>Data Processing Pipeline</strong></summary>

## From Raw Recipes to Graph Neural Networks

### Phase 1: Data Collection & Cleaning

**Artusi's Cookbook**:
1. OCR text extraction from PDF
2. Recipe segmentation (title, ingredients, instructions)
3. NLP parsing with spaCy (Italian model)
4. Manual correction of OCR errors

**Modern Recipes**:
1. Web scraping from Italian recipe sites
2. All Italian Cuisine (AIC) dataset integration
3. Deduplication and quality filtering
4. Regional label validation

### Phase 2: Neo4j Import

**Ingredient Normalization**:
```python
def normalize_ingredient(raw_text):
    """
    'pomodori pelati' → 'tomato'
    '200g di farina 00' → 'flour'
    """
    # Remove quantities, units
    # Lemmatize (plural → singular)
    # Map variants to canonical form
    return canonical_name
```

**Action Extraction**:
```python
COOKING_ACTIONS = {
    'cuocere', 'friggere', 'bollire', 'arrostire',
    'saltare', 'stufare', 'gratinare', ...
}

def extract_action(step_text):
    """Find cooking verb in instruction"""
    doc = nlp(step_text)
    for token in doc:
        if token.lemma_ in COOKING_ACTIONS:
            return token.lemma_
    return 'prepare'  # default
```

**Graph Construction**:
1. Create recipe nodes with metadata
2. Create ingredient/step nodes
3. Link recipes to ingredients (`REQUIRES`)
4. Link recipes to steps (`HAS_STEP`)
5. Link steps to ingredients (`USES_INGREDIENT`)
6. Link sequential steps (`NEXT_STEP`)

### Phase 3: Feature Extraction

**For each recipe, extract**:
- Ingredient feature vector (multi-hot encoding of 2,234 ingredients)
- Action feature vector (multi-hot encoding of 87 cooking techniques)
- Graph structure (adjacency lists for each relation type)

**Vocabulary Building**:
```python
ingredient_vocab = {
    'tomato': 0,
    'flour': 1,
    'olive oil': 2,
    ...  # 2,234 total
}

action_vocab = {
    'sauté': 0,
    'boil': 1,
    'fry': 2,
    ...  # 87 total
}
```

### Phase 4: Train/Val/Test Split

**Stratified splitting** (preserves regional distribution):
- **Training**: 70% (1,819 recipes)
- **Validation**: 15% (400 recipes)
- **Test**: 15% (390 recipes)

**Class distribution** (training set):
- North: 744 recipes (40.9%)
- South: 539 recipes (29.6%)
- Center: 279 recipes (15.3%)
- Islands: 257 recipes (14.1%)

</details>

---

<details markdown="1">
<summary><strong>Evaluation Metrics</strong></summary>

## Why Not Just Accuracy?

With imbalanced classes (North: 41% vs Islands: 14%), accuracy alone is misleading. A model that always predicts "North" gets 41% accuracy!

### Metrics Used

**F1 Score (Weighted)**:
- Balances precision and recall
- Weights each class by support (number of examples)
- Better reflects real-world performance

**F1 Score (Macro)**:
- Treats all classes equally (unweighted average)
- Shows performance on minority classes
- Reveals bias toward majority classes

**Confusion Matrix**:
- Shows which regions are confused
- Reveals geographic patterns (neighbors confused more)

**Per-Class Metrics**:
```python
classification_report = {
    'North': {
        'precision': 0.779,  # When predicting North, correct 78% of time
        'recall': 0.843,     # Catches 84% of actual North recipes
        'f1-score': 0.810,   # Harmonic mean
        'support': 159       # Test set examples
    },
    ...
}
```

### Results Interpretation

| Metric | Macro-Region | Fine-Grained | What It Means |
|--------|--------------|--------------|---------------|
| Accuracy | 59.5% | 20.3% | Overall correct predictions |
| F1 (weighted) | 0.588 | 0.205 | Balanced performance |
| F1 (macro) | 0.530 | 0.148 | Performance on small classes |
| Train Acc | ~65% | 84.2% | Overfitting in fine-grained |

**Key insight**: The 84% → 20% train/test gap in fine-grained shows the model memorizes training data but doesn't learn generalizable patterns.

</details>

---

<details markdown="1">
<summary><strong>Historical Analysis</strong></summary>

## Artusi vs Modern Recipes

### Pellegrino Artusi's Legacy

Pellegrino Artusi published *"Science in the Kitchen and the Art of Eating Well"* in 1891, shortly after Italian unification (1861). His cookbook was **explicitly political**: an attempt to create a unified "Italian" cuisine from fragmented regional traditions.

**The Southern Exclusion**:
- Artusi's 790 recipes come almost entirely from Central/Northern Italy
- Southern Italian cuisine (Campania, Sicily, Calabria, Puglia) is nearly absent
- This wasn't accidental - post-unification Italy was culturally divided, with Northern elites viewing the South as backward

**Post-Unification Context**:
- Italy unified politically in 1861, but culturally fragmented
- No common language (regional dialects dominated)
- No shared culinary tradition (what's "Italian" food?)
- Artusi aimed to create that tradition through his cookbook

### Evolution Analysis (1891 → 2025)

**Recipe Complexity**:
- Artusi: Average 5.5 ingredients per recipe
- Modern: Average 9.2 ingredients per recipe
- **67% increase** - modern recipes are more elaborate

**Category Distribution**:

| Category | Artusi (1891) | Modern | Change |
|----------|---------------|--------|--------|
| First Course (Pasta/Risotto) | 18% | 32% | **+78%** |
| Second Course (Meat/Fish) | 45% | 28% | -38% |
| Desserts | 22% | 18% | -18% |
| **Pizza** | 0.1% | 4.2% | **+4100%** |

**Key Trends**:
1. **Rise of pasta**: Once a simple first course, now dominates Italian cuisine
2. **Pizza goes national**: Barely present in Artusi, now emblematic
3. **Less meat-centric**: Modern recipes more balanced across categories

**Ingredient Frequency Shifts**:

**Increasing**:
- Tomatoes: +250% (now ubiquitous, rare in 1891)
- Mozzarella: +180% (pizza/caprese salad boom)
- Basil: +140% (pesto, caprese)

**Decreasing**:
- Lard: -65% (health trends, olive oil replacement)
- Organ meats: -45% (changing tastes)
- Preserved fish: -40% (fresh seafood available year-round)

**Cooking Techniques**:

**Increasing**:
- Grilling (+120%): Outdoor cooking trend
- Food processor (+∞): Technology adoption

**Decreasing**:
- Boiling (-30%): Preference for sautéing, roasting
- Long braises (-25%): Faster cooking methods

### Geographic Expansion

Artusi's regional coverage was limited:
- **Heavy**: Tuscany, Emilia Romagna, Lombardy
- **Light**: Lazio, Liguria
- **Nearly absent**: All of Southern Italy, Islands

Modern dataset covers all 20 regions, revealing Southern specialties Artusi ignored:
- **Sicilian**: Arancini, pasta alla norma, cannoli
- **Neapolitan**: Pizza margherita, parmigiana di melanzane
- **Calabrian**: 'Nduja, peperoncino-based sauces

This geographic expansion explains some GNN confusion - "Italian cuisine" means very different things in different eras.

</details>

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
