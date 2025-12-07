---
layout: post
title: "How Artusi's 1891 Cookbook Failed to Unify Italian Cuisine—And Why Machine Learning Reveals the Truth"
date: 2025-04-01 10:00:00
description: Analyzing 134 years of Italian recipes reveals how post-unification politics still shape what we eat today
tags: history data-science graph-neural-networks italy
categories: data-science
thumbnail: assets/img/projects/italian-cuisine/italian-cuisine-thumbnail.jpg
featured: true
chart:
  plotly: true
---

## The Nation-Building Project That Failed

In 1891, Pellegrino Artusi published *"La Scienza in cucina e l'arte di mangiar bene"* (*Science in the Kitchen and the Art of Eating Well*), a cookbook with an ambitious goal: to create a shared Italian identity through food.

Italy had been politically unified for barely thirty years. The famous phrase attributed to Massimo d'Azeglio, "We have made Italy, now we must make Italians," perfectly captured the challenge facing the young nation. Regional dialects were mutually incomprehensible, cultural traditions varied wildly, and a sense of shared national identity barely existed beyond elite circles.

Artusi recognized that food could serve as a powerful unifying force: something practical, daily, and shareable that could help forge a common Italian identity.

**He failed.**

And 134 years later, machine learning can show us exactly why.

---

## The Data Proves the Exclusion

For my [Italian Regional Cuisine project](/projects/italian-cuisine-gnn/), I analyzed two datasets:
- **Artusi's 1891 cookbook**: 790 recipes
- **Modern Italian recipes**: 2,599 recipes covering all 20 regions

When you run the numbers, Artusi's political project becomes starkly visible:

### The Southern Exclusion

Artusi's "national" cuisine was overwhelmingly **Central and Northern Italian**. Southern cuisine - the food that would later define "Italian" globally - was almost entirely absent.

**The evidence**:

| Ingredient | Artusi (1891) | Modern | Change |
|-----------|---------------|---------|---------|
| **Tomatoes** | 18% of recipes | 63% of recipes | **+250%** |
| **Olive oil** | 35% of recipes | 84% of recipes | **+140%** |
| **Butter** | 48% of recipes | 32% of recipes | **-33%** |
| **Lard** | 22% of recipes | 8% of recipes | **-65%** |

Tomatoes - the ingredient most associated with Italian food worldwide - appeared in less than one-fifth of Artusi's recipes. Butter dominated over olive oil, reflecting Northern cooking traditions.

### The Pizza That Wasn't

In Artusi's 790 recipes, the word "pizza" appears exactly **3 times**.

All three are **desserts**.

In 1891 Northern Italy, "pizza" meant a sweet baked pie, not the Neapolitan flatbread that would become Italy's most famous dish. Pizza was street food, eaten by poor people in Naples, considered too regional and too low-class for Artusi's bourgeois national canon.

**Modern dataset**: 4.2% of recipes are pizza (savory, Neapolitan-style)
**Change**: **+4,100%**

The food that defines Italian cuisine globally was invisible in Artusi's nation-building project.

---

## Why the Exclusion Happened

This wasn't accidental. It was **political**.

### The *Questione Meridionale* ("Southern Question")

Post-unification Italy was divided. The North viewed the South as backward, exotic, and economically inferior. Southern ingredients that would later become synonymous with Italian cuisine were either absent or marginalized in Artusi's vision:

- **Dried pasta**: Too poor, too simple
- **Abundant tomato sauce**: Too regional (Southern specialty)
- **Olive oil as primary fat**: Mediterranean, not "modern"
- **Mozzarella di bufala**: Unknown outside Campania
- **Pizza, arancini, sfincione**: Street food, beneath bourgeois cooking

Artusi's book reflected and reinforced the biases of Northern elites who dominated the new Italian state. The South was treated almost as an internal colony, its food culture dismissed.

### An Incomplete Canon

Artusi wanted to create a shared Italian culinary identity, but he ended up codifying **exclusions as much as inclusions**. His book showed how food can be used to construct identity - and how that construction inevitably reflects the power dynamics and prejudices of its time.

**The profound irony**: Today's global Italian cuisine (pizza, pasta with tomato sauce, mozzarella) emerged **despite** Artusi, not because of him. These Southern foods achieved international status through emigration, economic development, and cultural shifts well into the 20th century.

---

## What Machine Learning Reveals

Fast forward to 2025. I trained Graph Neural Networks on 3,389 Italian recipes spanning 134 years to classify recipes by region.

The model learned patterns Artusi never saw - because **it had access to the full geographic spectrum** he excluded.

### The Geographic Divides Persist

#### 1. The Olive Oil vs Butter Line

The most striking pattern: **Northern Italy uses butter, the rest uses olive oil**.

```plotly
{% include plotly/italian-cuisine/olive-oil-butter-divide.json %}
```

<div class="caption">
    Diverging choropleth map: green regions prefer olive oil, red regions prefer butter. The North-South divide is stark. Interactive: hover for exact percentages.
</div>

**Fat preference by macro-region**:
- **North**: 68% butter, 32% olive oil
- **Center**: 15% butter, 85% olive oil
- **South**: 8% butter, 92% olive oil
- **Islands**: 5% butter, 95% olive oil

This isn't cultural preference - it's **geography and climate**:
- **North**: Alpine climate, dairy farming (Po Valley cows) → butter
- **South**: Mediterranean climate, olive cultivation → olive oil

Artusi's butter-heavy recipes reflected his Northern/Central bias, not a unified Italian cuisine.

#### 2. The Tomato Gradient

Tomato usage increases as you move south:

```plotly
{% include plotly/italian-cuisine/tomato-usage.json %}
```

<div class="caption">
    Tomato usage intensity map. The gradient clearly shows Mediterranean South vs Alpine North divide.
</div>

**Tomato frequency** (% of recipes using tomatoes):
- **Campania** (Naples): 75%
- **Sicily**: 68%
- **Calabria**: 71%
- **Tuscany** (Artusi's region): 45%
- **Piedmont** (North): 32%
- **Valle d'Aosta** (Alpine): 18%

The Mediterranean South, with Spanish and Arab culinary influences, made tomatoes central. The North adopted them more slowly - which is why Artusi's recipes show only 18% tomato usage.

#### 3. The Starch Triangle: Pasta, Rice, Polenta

```plotly
{% include plotly/italian-cuisine/pasta-rice-polenta-triangle.json %}
```

<div class="caption">
    RGB ternary map: Red = Pasta, Green = Rice, Blue = Polenta. Regional starch preferences follow geography, not politics. Interactive: hover to see exact percentages per region.
</div>

**Regional patterns**:
- **Lombardy, Piedmont, Veneto** (North): Rice dominant (risotto country - Po Valley paddies)
- **Trentino, Valle d'Aosta** (Alpine): Polenta dominant (corn-based mountain food)
- **Most other regions**: Pasta dominant (wheat cultivation)

Artusi emphasized rice and polenta (Northern staples) over pasta. Modern Italian cuisine reversed this - pasta became the national dish, originally a Southern tradition.

---

## What the Model Learned

I trained three Graph Neural Network classifiers:

1. **Fine-grained (20 regions)**: 20% accuracy (failed - data scarcity)
2. **Hierarchical (two-level)**: 22% accuracy (failed - error propagation)
3. **Macro-region (4 classes: North, Center, South, Islands)**: **60% accuracy** ✅

### Why Macro-Regions Work

The model achieves 60% accuracy on macro-regions because **geographic patterns are real**:

**North** (81% F1 score):
- **Signatures**: Rice, butter, cream, polenta, gorgonzola
- **Why**: Alpine climate, Po Valley agriculture, dairy farming
- **History**: Austrian/French influences
- **Examples**: Risotto alla milanese, ossobuco, tortellini

**South** (44% F1 score):
- **Signatures**: Tomatoes, olive oil, chili, mozzarella, eggplant
- **Why**: Mediterranean climate, Greek/Spanish/Arab influences
- **History**: Coastal trade routes, New World ingredients
- **Examples**: Pizza margherita, pasta alla norma, orecchiette

**Islands** (52% F1 score):
- **Signatures**: Seafood, pecorino, almonds, capers, citrus
- **Why**: Geographic isolation, Arab/Greek heritage
- **History**: Separated from mainland, preserved unique traditions
- **Examples**: Arancini (Sicily), porceddu (Sardinia), bottarga

**Center** (35% F1 score):
- **Signatures**: Olive oil, pork, beans, pecorino romano
- **Why**: Transitional zone - mixes North/South elements
- **History**: Land-based, rustic cooking
- **Examples**: Amatriciana, carbonara, ribollita

The model **struggles most with Center** because it's a culinary transition zone. Recipes blend Northern and Southern elements, creating fuzzy boundaries.

### PCA Visualization Shows Geographic Clustering

```plotly
{% include plotly/italian-cuisine/pca-regional-clustering.json %}
```

<div class="caption">
    PCA projection of recipe embeddings colored by macro-region. Clear geographic clustering emerges from graph structure alone. Interactive: hover to identify individual regions.
</div>

**Key findings**:
- **North forms a tight cluster** - homogeneous culinary tradition
- **Islands well-separated** - geographic isolation creates distinctiveness
- **South and Center overlap** - transitional cuisines share elements
- Clustering follows **climate and geography**, not administrative regions

The model isn't learning Artusi's political boundaries. It's learning **real geographic patterns** driven by agriculture, climate, and history.

---

## Why Artusi Failed (And What Succeeded Instead)

Artusi's attempt to create a unified Italian cuisine through a Northern/Central canon failed because:

1. **He excluded half the country** - Southern cuisine was dismissed as too regional, too poor
2. **Geography > politics** - Climate and agriculture create real culinary boundaries that don't respect political unification
3. **The wrong foods won** - Pizza, pasta with tomato sauce, olive oil became globally synonymous with "Italian food" - all Southern traditions Artusi marginalized

**What actually unified Italian cuisine?**

- **Emigration** (late 1800s-early 1900s): Southern Italians brought pizza and pasta to America, making them internationally famous
- **Economic development** (post-WWII): Rising incomes made formerly "poor" Southern foods desirable
- **Globalization** (1960s-present): Pizza and pasta became global comfort foods
- **Cultural shifts**: Street food became gourmet, rustic became authentic

The Italian cuisine the world knows today - pizza, spaghetti with tomato sauce, mozzarella, olive oil - is fundamentally **Southern Italian cuisine** that Artusi tried to exclude from the national canon.

---

## The Irony: Machine Learning Vindicates the South

My GNN results show that:

1. **Geographic patterns are strong** - 60% macro-region accuracy proves real culinary divides exist
2. **The South is distinct** - Southern cuisine forms its own recognizable cluster
3. **Artusi's vision was incomplete** - Excluding the South meant excluding major culinary traditions
4. **Modern cuisine is balanced** - All regions represented, not just North/Center

The model **couldn't have been trained in Artusi's era** - not because of lacking technology, but because **the data was incomplete**. His political project to unify Italy through food failed because it was built on exclusion.

Today's dataset includes the South Artusi dismissed. And the machine learning results vindicate what became clear over the 20th century: **you can't have "Italian cuisine" without the South**.

---

## What I Learned

### 1. Data Reflects Power Structures

Artusi's dataset was biased because **post-unification power was biased**. Northern elites controlled the narrative, and Southern food culture was excluded.

This isn't just historical curiosity - it's a reminder that **all datasets encode the biases of their creators**. When training ML models, we need to ask: *What's missing? Who's excluded? Whose perspective dominates?*

### 2. Machine Learning Can Reveal Hidden Patterns

The GNN learned geographic culinary divides (oil vs butter, rice vs pasta vs polenta, tomato gradients) that Artusi couldn't see - because he didn't have access to Southern data.

Modern ML with comprehensive data can reveal patterns that politically-motivated historical projects missed.

### 3. Geography Matters More Than Politics

Italian political unification happened in 1861. But **culinary unification never happened** - because geography creates real boundaries.

Alpine climate (butter, rice, polenta) vs Mediterranean climate (olive oil, tomatoes, pasta) creates a fundamental divide that transcends political borders.

The GNN learns this because **graph structure encodes relationships**: which ingredients pair with which techniques, in which sequences. A Northern risotto (sauté rice in butter, add broth gradually) is structurally different from a Southern pasta dish (boil pasta, toss with olive oil-based sauce).

### 4. Historical Context Enriches Technical Work

This project could have been pure machine learning: "I trained a GNN, got 60% accuracy, here are the confusion matrices."

But adding historical context - understanding Artusi's political goals, the Southern Exclusion, how Italian cuisine evolved despite his project - transforms it from a technical exercise into a story about **food, power, geography, and identity**.

**Data science isn't just about algorithms. It's about understanding what the data represents.**

---

## Implications for Modern Italian Cuisine

### The Current State: Balanced Representation

My modern dataset (2,599 recipes) includes:
- **North**: 744 recipes (29%)
- **South**: 539 recipes (21%)
- **Center**: 279 recipes (11%)
- **Islands**: 257 recipes (10%)
- **Unknown/Mixed**: 780 recipes (30%)

Unlike Artusi's Northern/Central dominance, today's Italian cuisine recognizes all regions. The foods once dismissed as too Southern - pizza, pasta with tomato sauce, olive oil - are now **globally iconic**.

### What "Italian Food" Means Today

Ask someone worldwide to name Italian foods:
1. **Pizza** - Neapolitan (South)
2. **Spaghetti** - Traditionally Southern (though now national)
3. **Pasta with tomato sauce** - Southern tradition
4. **Mozzarella** - Campanian (South)
5. **Olive oil** - Mediterranean (South/Islands)

The Southern cuisine Artusi excluded became **the face of Italian food globally**.

Risotto, ossobuco, and tortellini (Northern dishes Artusi emphasized) are known by food enthusiasts, but they didn't achieve the same global dominance as pizza and pasta.

### The Lesson

Artusi's project failed because it was **prescriptive, not descriptive**. He tried to *define* what Italian cuisine *should be* based on political goals (unification) and class biases (bourgeois Northern cooking).

What succeeded was **emergent, not designed**: Southern emigrants brought their food to America, it became popular, globalization spread it worldwide, and now it defines "Italian" cuisine regardless of what Artusi wanted.

**You can't engineer culture from the top down. It emerges from the bottom up.**

---

## Technical Details: How the Model Works

For those interested in the machine learning side:

### Graph Representation

I modeled recipes as **heterogeneous graphs** in Neo4j:

**Nodes**: Recipes, Ingredients, Steps
**Edges**: REQUIRES, HAS_STEP, USES_INGREDIENT, NEXT_STEP, EMPLOYS_ACTION

This captures **structure** that ingredient lists miss:
- How ingredients are combined
- Which techniques transform which ingredients
- Sequential cooking steps

### Graph Neural Network Architecture

**Graph Attention Networks (GAT)** with:
- 3 GAT layers (multi-relational message passing)
- 4 attention heads (learn important relationships)
- Heterogeneous edges (different relationship types)
- Graph pooling (aggregate to recipe-level representation)
- Softmax classifier (predict macro-region)

**Training**:
- 1,819 training recipes (70%)
- 390 validation recipes (15%)
- 390 test recipes (15%)
- AdamW optimizer, early stopping
- Weighted cross-entropy loss (handle class imbalance)

**Result**: 59.5% test accuracy on 4-class macro-region classification

For full technical details, see the [project page](/projects/italian-cuisine-gnn/) or [GitHub repository](https://github.com/LeonardoPaccianiMori/portfolio-italian-cuisine).

---

## Conclusion: Food, Power, and Data

Artusi's 1891 cookbook tried to answer the question: "What is Italian cuisine?"

His answer: Northern and Central cooking, bourgeois and refined, butter-based and moderate in tomatoes, excluding the South.

**History's answer**: Pizza, pasta, tomatoes, olive oil, mozzarella - the Southern foods Artusi dismissed.

**Machine learning's answer**: Geography creates real culinary boundaries. North (butter, rice), South (olive oil, tomatoes), Islands (seafood, isolation), Center (transitional). All equally "Italian."

The data reveals what Artusi couldn't see because of political biases: **Italian cuisine was never meant to be unified**. It's a collection of regional traditions shaped by climate, agriculture, and history.

And perhaps that's the real lesson - both for Italian cuisine and for data science:

**Diversity is not a problem to be solved. It's a pattern to be understood.**

---

## Related Posts

- [Why I Represented Recipes as Graphs](/blog/2025/why-graphs-for-recipes/)
- [Visualizing Italian Cuisine: Creative Techniques Beyond Bar Charts](/blog/2025/visualizing-italian-cuisine/)
- [Full Project Overview](/projects/italian-cuisine-gnn/)

---

## References and Further Reading

**Historical sources**:
- Artusi, Pellegrino. *La scienza in cucina e l'arte di mangiar bene* (1891)
- Dickie, John. *Delizia! The Epic History of the Italians and Their Food* (2007)

**Technical papers**:
- Veličković et al. "Graph Attention Networks" (2018) - GAT architecture
- PyTorch Geometric documentation - Heterogeneous graph implementation

**Data sources**:
- Artusi's cookbook (Project Gutenberg)
- All Italian Cuisine (AIC) dataset
- Italian recipe websites (scraped with permission)
