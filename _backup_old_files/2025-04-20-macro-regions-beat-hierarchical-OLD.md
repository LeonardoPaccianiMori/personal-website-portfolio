---
layout: post
title: "Why Macro-Regions Beat Hierarchical Classification (and Fine-Grained Failed)"
date: 2025-04-20 14:00:00
description: Testing three approaches for regional cuisine classification - simple wins again
tags: deep-learning classification data-science
categories: [data-science, learning]
featured: false
---

## The Goal: Classify Italian Regional Cuisine

For my [Italian Regional Cuisine project](/projects/italian-cuisine-gnn/), I trained Graph Neural Networks to predict which Italian region a recipe comes from.

**The challenge**: Italy has 20 regions, each with distinct culinary traditions. Can a model learn these differences from recipe structure (ingredients + cooking steps + techniques)?

I tested **three approaches**:

1. **Fine-grained (20 classes)**: Direct classification into all 20 regions
2. **Macro-region (4 classes)**: Classify into geographic areas (North, Center, South, Islands)
3. **Hierarchical (two-level)**: First predict macro-region, then fine-grained region within that area

**Hypothesis**: Hierarchical should combine the benefits of both - use macro-region's easier task at Level 1, then specialize with fine-grained classifiers at Level 2.

**Reality**: Macro-region alone crushed the others.

---

## The Results: Macro-Region Wins by a Landslide

| Approach | Test Accuracy | F1 (Weighted) | Training Speed |
|----------|--------------|---------------|----------------|
| **Macro-Region** | **59.5%** | **0.588** | Fast (3 epochs) |
| Hierarchical | 22.3% | 0.216 | Medium (~20 epochs total) |
| Fine-Grained | 20.3% | 0.205 | Slow (48 epochs) |

<div class="row">
    <div class="col-sm mt-3 mt-md-0">
        {% include figure.liquid loading="eager" path="assets/img/projects/italian-cuisine/three-approaches-comparison.png" title="Three approaches comparison" class="img-fluid rounded z-depth-1" %}
    </div>
</div>
<div class="caption">
    Comparison of three classification approaches showing macro-region's clear advantage
</div>

**Macro-region achieved 2.7× better accuracy** than fine-grained while training **16× faster**.

---

## Why Fine-Grained Failed: The Data Scarcity Problem

**Training vs Test gap**: 84% → 20%

That's a **64 percentage point overfitting gap**. The model memorizes training data but can't generalize.

**The problem**: Not enough data per class.

| Region | Training Recipes | Test Recipes | Model Performance |
|--------|-----------------|--------------|-------------------|
| Emilia Romagna | 205 | 36 | OK (38% F1) |
| Lombardia | 115 | 23 | Moderate (35% F1) |
| Sardegna | 170 | 36 | Good (56% F1) |
| Valle d'Aosta | 37 | 6 | **Complete failure (0% F1)** |
| Molise | 96 | 19 | **Complete failure (0% F1)** |
| Basilicata | 26 | 4 | **Complete failure (0% F1)** |

**Five regions had 0% F1 scores** - the model never correctly predicted them.

**Why Sardegna works but Molise doesn't**:
- **Sardegna**: Geographic isolation → unique ingredients (pecorino sardo, bottarga, pane carasau)
- **Molise**: Landlocked, shares ingredients with neighbors Abruzzo/Campania/Puglia → no clear signal

The model needs **distinctive patterns**, not just data quantity. But distinctive patterns are rare when regions share borders and culinary traditions.

---

## Why Macro-Region Works: Geographic Coherence

**60% accuracy for 4 classes** is strong, especially with class imbalance.

**Per-macro-region performance**:

| Macro-Region | F1 Score | Why It Works |
|--------------|----------|--------------|
| **North** | 81% | Rice, butter, cream (Po Valley agriculture) |
| **Islands** | 52% | Geographic isolation, Arab/Greek influence |
| **South** | 44% | Mediterranean ingredients (tomatoes, chili, seafood) |
| **Center** | 35% | Transitional zone (mixes North/South elements) |

<div class="row">
    <div class="col-sm mt-3 mt-md-0">
        {% include figure.liquid loading="eager" path="assets/img/projects/italian-cuisine/macro-region-confusion-matrix.png" title="Macro-region confusion matrix" class="img-fluid rounded z-depth-1" %}
    </div>
</div>
<div class="caption">
    Confusion matrix showing North's strong diagonal and some Center/South overlap
</div>

**Why North performs best (81% F1)**:
- **Distinctive ingredients**: Risotto (rice + saffron), polenta, butter-based sauces
- **Climate-driven**: Alpine influence, dairy farming, rice cultivation in Po Valley
- **Historical**: Austrian/French influences distinct from Mediterranean South

**Why Center struggles (35% F1)**:
- **Geographic transition**: Shares northern pasta (but with olive oil not butter) and southern tomatoes
- **Culinary overlap**: Amatriciana (Lazio) vs Carbonara (also Lazio) vs Norcia pork (Umbria) - lots of pork/tomato/cheese dishes that blur together
- **Model confusion**: Frequently misclassified as South (28% of Center recipes)

---

## Why Hierarchical Didn't Help: Error Propagation

**The intuition**: Use macro-region classifier (59.5% accurate) at Level 1, then specialized regional classifiers at Level 2. Should be better than direct fine-grained classification, right?

**The math**:
```
Hierarchical Accuracy ≈ Level 1 Accuracy × Level 2 Accuracy
                      ≈ 0.595 × 0.375 (average)
                      ≈ 0.223 (22.3%)
```

**The problem**: When Level 1 is wrong (40.5% of cases), Level 2 has **zero chance** of being correct.

Example error cascade:
1. Recipe is actually from **Tuscany** (Center)
2. Level 1 predicts **South** (40% error rate)
3. Level 2 uses South sub-classifier (6 classes: Abruzzo, Molise, Campania, Puglia, Basilicata, Calabria)
4. Tuscany isn't even an option → guaranteed wrong

**Sub-classifier performance** (validation set):

| Sub-Classifier | Classes | Val F1 | Recipes | Issue |
|----------------|---------|--------|---------|-------|
| Islands | 2 | 80.8% | 257 | Works! (binary: Sardinia vs Sicily) |
| Center | 4 | 44.0% | 279 | Moderate (still data scarcity) |
| South | 6 | 39.4% | 539 | Struggles (6-way classification hard) |
| North | 8 | 34.1% | 744 | Hardest (8 classes, less distinctive) |

**Only the Islands sub-classifier really works** because it's a simple binary decision between two geographically isolated regions.

**The hierarchical approach fails because**:
1. Level 1 isn't accurate enough (59.5% < needed 80%+ for hierarchy to help)
2. Level 2 sub-classifiers struggle with same data scarcity issues as fine-grained model
3. Errors cascade and compound

**For hierarchy to work**, you need:
- **High Level 1 accuracy**: ≥80% (mine: 59.5%)
- **Good Level 2 performance**: ≥50% (mine: 34-44% except Islands)
- **Clear hierarchical structure**: Macro-regions should be internally homogeneous (they're not - North has 8 diverse regions)

I had none of these.

---

## Lessons Learned

### 1. Simple Often Beats Complex

I spent weeks implementing the hierarchical system (5 separate models, custom data loaders, two-level evaluation logic).

**Result**: 2 percentage points better than the baseline fine-grained model (22.3% vs 20.3%).

Meanwhile, the **simple macro-region classifier** took 2 hours to build and achieved 60% accuracy.

**Lesson**: Try the simple approach first. Add complexity only when it clearly helps.

### 2. Data Quantity > Model Architecture

I tried every architectural trick:
- Deeper networks (more GAT layers)
- Attention mechanisms (already had them)
- Hierarchical decomposition
- Class weights (to handle imbalance)
- Dropout, batch normalization, etc.

**None of it fixed the 84% → 20% overfitting gap.**

The problem wasn't the model - it was **50-150 recipes per region**. With 200-500 recipes per region, fine-grained might work. With current data, it won't.

**Lesson**: No amount of model complexity can compensate for insufficient data.

### 3. Task Difficulty Matters More Than You Think

| Task | Accuracy | Training Convergence |
|------|----------|---------------------|
| Macro-region (4-way) | 60% | 3 epochs |
| Fine-grained (20-way) | 20% | 48 epochs (still overfitting) |

**The 4-way task is just easier**:
- Clearer boundaries (North vs South is geographic)
- More data per class (400 recipes vs 50-150)
- Less confusion (no adjacent regions sharing ingredients)

**Deeper networks and better optimization don't make a 20-way problem easier** - they just overfit faster.

**Lesson**: Match your problem granularity to your data availability. With limited data, solve a coarser problem well rather than a fine-grained problem poorly.

### 4. Geographic Patterns Are Real

The macro-region classifier's 60% accuracy isn't luck or overfitting (train/test gap is only 5%).

It's learning **genuine geographic culinary patterns**:
- **North**: Alpine/Po Valley (rice, butter, dairy)
- **South**: Mediterranean (tomatoes, olive oil, seafood, chili)
- **Islands**: Isolated (unique ingredients, Arab/Greek influences)
- **Center**: Transitional (mixes North/South styles)

These patterns exist because:
- **Climate**: Alpine vs Mediterranean agriculture
- **History**: Austrian/French (North) vs Arab/Spanish (South) influences
- **Geography**: Mountains, coastlines, plains shape ingredients
- **Trade routes**: Coastal vs landlocked determines access to ingredients

**The model is learning real-world geography**, not spurious correlations.

### 5. Hierarchical Classification Isn't a Free Lunch

Hierarchical decomposition is often recommended for fine-grained classification:
- "Too many classes? Use a hierarchy!"
- "Break the problem into easier subproblems!"

**But hierarchical only helps if**:
1. **Level 1 is very accurate** (e.g., 80-90%)
2. **Level 2 sub-problems are actually easier** than the original problem
3. **Errors at Level 1 are acceptable** (your use case doesn't need fine-grained accuracy anyway)

In my case:
- Level 1 was only 60% accurate ❌
- Level 2 sub-problems were still hard (6-8 classes with data scarcity) ❌
- I needed fine-grained accuracy (that's the goal) ❌

**Hierarchical made things worse**, not better.

**Lesson**: Hierarchical isn't magic. It's error-prone if the hierarchy isn't naturally strong in your data.

---

## What I'd Do Differently

### 1. Collect More Data (200-500 Recipes Per Region)

The fundamental bottleneck is data quantity. With 200-500 recipes per region:
- Fine-grained model might reach 35-40% accuracy
- Hierarchical could work (stronger Level 1, better Level 2)
- Class imbalance would be less severe

**But**: High-quality regional labels are scarce. Most online recipes don't specify region, only country ("Italian").

### 2. Use Macro-Regions for Production

For real-world applications (recipe recommendations, ingredient substitutions), **macro-region classification is good enough**:
- 60% accuracy is production-viable
- North/South distinction captures most culinary differences
- Users care more about "Northern Italian" vs "Southern Italian" than "Lombardia" vs "Piemonte"

**Fine-grained classification is a research goal, not a product requirement.**

### 3. Treat Hierarchical as an Ensemble, Not a Pipeline

Instead of **error-cascading pipeline**:
```
Macro (59.5%) → Sub-classifier (37.5%) = 22.3% final
```

Try **ensemble voting**:
```
Fine-grained: 20%
Macro: 60%
Hierarchical: 22%
→ Weighted vote: ~35-40%?
```

Combine predictions from all three models. This avoids error propagation and might improve overall accuracy.

### 4. Accept the Limitations

**20% accuracy for 20 regions is bad.** Full stop.

But it's not because the model is broken - it's because **the task is genuinely hard with this data**:
- Regional boundaries are fuzzy (neighboring regions share ingredients)
- Modern globalization blurs traditional cuisines
- Historical evolution changes recipes over time
- Data scarcity makes learning impossible for rare regions

**Lesson**: Sometimes the right answer is "this task needs more data" or "this granularity is too fine for this dataset."

---

## Code & Resources

Full comparison in my [Italian Regional Cuisine repository](https://github.com/LeonardoPaccianiMori/portfolio-italian-cuisine):
- `src/models/train.py` - Fine-grained classifier
- `src/models/train_macro.py` - Macro-region classifier
- `src/models/train_hierarchical_sub.py` - Hierarchical sub-classifiers
- `src/models/evaluate_hierarchical.py` - Two-level evaluation

**Related posts**:
- [Full Project Overview](/projects/italian-cuisine-gnn/) - Context and detailed results
- [Why Graphs for Recipes](/blog/2025/why-graphs-for-recipes/) - Graph-based representation

---

## What I Learned

The big lesson: simplicity has value. I assumed hierarchical would beat macro-region - it's a more sophisticated approach, uses all the data, should combine the best of both worlds. But it failed because of error propagation. The simple macro-region classifier, with no fancy hierarchy or multi-level training, just worked better. Sometimes the straightforward solution is the right solution.

Also, I learned to recognize when a problem is fundamentally data-limited. I could tune hyperparameters forever, try hierarchical decomposition, ensemble methods, transfer learning - none of it would fix 50 recipes per region. The 84% → 20% train/test gap screams "not enough data," not "wrong architecture." Recognizing that early would have saved weeks of effort.

Finally, task granularity matters. A 20-way classification with imbalanced, overlapping classes is just harder than a 4-way classification with clear boundaries. That's not a model failure - it's a data reality. Better to solve a coarser problem well (macro-regions at 60%) than a fine-grained problem poorly (regions at 20%).
