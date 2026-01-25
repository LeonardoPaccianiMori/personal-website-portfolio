---
layout: post
title: "Why I Represented Recipes as Graphs (Not Just Ingredient Lists)"
date: 2025-04-15 10:00:00
description: How representing recipes as relationship networks revealed patterns that ingredient-based features miss
tags: graph-neural-networks neo4j deep-learning
categories: data-science
featured: false
---

## The Problem: Recipes Are More Than Ingredient Lists

For my [Italian Regional Cuisine project](/projects/italian-cuisine-gnn/), I wanted to train a neural network to classify which Italian region a recipe comes from.

**The standard approach** for recipe ML:
1. Extract ingredient list
2. One-hot encode ingredients (binary: present/absent)
3. Feed to classifier (Random Forest, neural network, etc.)

**This works okay** for simple tasks, but it fails to capture something fundamental: **recipes aren't bags of ingredients, they're processes**.

Consider two recipes with similar ingredients:

**Recipe A** (Carbonara):
1. Cook pasta
2. **Meanwhile**, fry guanciale until crispy
3. Beat eggs with pecorino
4. Toss hot pasta with guanciale
5. Add egg mixture off heat, toss quickly

**Recipe B** (Frittata):
1. Fry guanciale until crispy
2. Beat eggs with pecorino
3. Pour eggs over guanciale
4. Cook until set

**Same core ingredients**: eggs, guanciale (cured pork cheek), pecorino cheese. **Completely different dishes**.

The difference isn't *what* ingredients you use, it's:
- **How** you combine them (sequencing)
- **When** you add them (timing)
- **Which techniques** you apply (frying vs boiling vs mixing)

An ingredient-list representation treats both as `[eggs=1, guanciale=1, pecorino=1, pasta=0/1]`. **Graphs capture the structure.**

---

## The Solution: Model Recipes as Knowledge Graphs

Instead of flattening recipes into ingredient lists, I represented them as **heterogeneous graphs** in Neo4j (networks with different node and edge types).

### Graph Structure

**Nodes** (three types):
1. **Recipes**: Metadata (region, category, servings)
2. **Ingredients**: Normalized names (e.g., "pomodori" → "tomato")
3. **Steps**: Cooking instructions with extracted actions

**Edges** (five types):
1. `REQUIRES`: Recipe uses ingredient
2. `HAS_STEP`: Recipe contains cooking step
3. `USES_INGREDIENT`: Step transforms ingredient
4. `NEXT_STEP`: Sequential step ordering
5. `EMPLOYS_ACTION`: Step uses cooking technique

### Example: Carbonara Graph

```
(Carbonara:Recipe {region: 'Lazio'})
    -[:REQUIRES]-> (Guanciale:Ingredient)
    -[:REQUIRES]-> (Eggs:Ingredient)
    -[:REQUIRES]-> (Pecorino:Ingredient)
    -[:REQUIRES]-> (Pasta:Ingredient)

    -[:HAS_STEP {order: 1}]-> (Step1 {action: 'boil'})
        -[:USES_INGREDIENT]-> (Pasta)
        -[:NEXT_STEP]-> (Step2)

    -[:HAS_STEP {order: 2}]-> (Step2 {action: 'fry'})
        -[:USES_INGREDIENT]-> (Guanciale)
        -[:NEXT_STEP]-> (Step3)

    -[:HAS_STEP {order: 3}]-> (Step3 {action: 'mix'})
        -[:USES_INGREDIENT]-> (Eggs)
        -[:USES_INGREDIENT]-> (Pecorino)
        -[:NEXT_STEP]-> (Step4)
```

**What this captures that ingredient lists miss**:
- **Sequencing**: Pasta is boiled *first*, guanciale fried *meanwhile*
- **Technique-ingredient pairing**: Guanciale is *fried* (not boiled), eggs are *mixed* (not fried)
- **Relationships**: Eggs and pecorino are combined together (not in separate steps)
- **Process flow**: NEXT_STEP edges create temporal ordering

---

## Why Neo4j for Storage?

I could have stored this graph structure in JSON or a relational database, but I chose **Neo4j** (a graph database) for several reasons:

### 1. Query Expressiveness

**Find signature ingredients for a region**:

```cypher
// Cypher (Neo4j query language)
MATCH (r:Recipe {region: 'Sicilia'})-[:REQUIRES]->(i:Ingredient)
WITH i, COUNT(*) AS freq
ORDER BY freq DESC LIMIT 10
RETURN i.name, freq
```

For simple queries, SQL is fine. But for **multi-hop graph traversals** (e.g., "find ingredients used in frying steps in Northern recipes"), Cypher is far cleaner.

### 2. Natural Fit for GNNs

When training Graph Neural Networks, you need to pass:
- Node features (embeddings)
- Edge lists (adjacency matrices)
- Edge types (for heterogeneous graphs)

Neo4j exports these directly:

```python
from neo4j import GraphDatabase

def extract_graph(tx, recipe_title):
    query = """
    MATCH (r:Recipe {title: $title})-[:HAS_STEP]->(s:Step)
                                    -[:USES_INGREDIENT]->(i:Ingredient)
    RETURN r, s, i
    """
    result = tx.run(query, title=recipe_title)
    # Convert to PyTorch Geometric HeteroData
    return to_hetero_data(result)
```

This extraction is much cleaner than reconstructing graphs from SQL joins.

---

## The Graph Neural Network Architecture

Once I had recipes as graphs, I trained a **Graph Attention Network** (GAT) to classify regional origin.

### Why GAT?

**Graph Convolutional Networks (GCNs)** treat all neighbors equally. **GAT** learns to **weight** important connections via attention.

The model can learn, for example:
- *High attention* to `(tomato) -[:USES_INGREDIENT]-> (fry)` for Southern recipes
- *High attention* to `(rice) -[:USES_INGREDIENT]-> (sauté)` for Northern recipes (risotto)
- *Low attention* to `(pasta) -[:USES_INGREDIENT]-> (boil)` (too common, not regionally distinctive)

### Heterogeneous Graph Attention

Standard GATs assume all nodes are the same type. My recipes have **three node types** (recipe, ingredient, step), so I used **Heterogeneous GAT**:

```python
class HeteroGAT(nn.Module):
    def __init__(self):
        self.gat_layers = nn.ModuleDict({
            # Separate GAT for each edge type
            ('recipe', 'REQUIRES', 'ingredient'): GATConv(...),
            ('recipe', 'HAS_STEP', 'step'): GATConv(...),
            ('step', 'USES_INGREDIENT', 'ingredient'): GATConv(...),
            ('step', 'NEXT_STEP', 'step'): GATConv(...),
        })

    def forward(self, x_dict, edge_index_dict):
        # Message passing for each edge type
        for edge_type, gat in self.gat_layers.items():
            src, rel, dst = edge_type
            x_dict[dst] = gat(
                (x_dict[src], x_dict[dst]),
                edge_index_dict[edge_type]
            )
        return x_dict
```

**What this does**:
- Each edge type has its own learned parameters
- `REQUIRES` edges learn ingredient importance
- `USES_INGREDIENT` edges learn technique-ingredient associations
- `NEXT_STEP` edges learn temporal patterns
- Messages flow through the graph, aggregating information from neighbors

### Graph-Level Classification

After several GAT layers, each node has an updated embedding that incorporates information from its neighbors.

For **regional classification**, I need a **single vector per recipe**:

```python
# Aggregate node embeddings to graph-level representation
recipe_embedding = global_mean_pool(
    node_embeddings['recipe'],
    batch_indices
)

# Classify
logits = self.classifier(recipe_embedding)
region = logits.argmax(dim=1)
```

**Graph pooling** aggregates all node embeddings into one vector that represents the entire recipe graph.

---

## Results: Macro-Region Classification

I trained the model to classify recipes into **macro-regions** (North, Center, South, Islands):

**Test accuracy**: **59.5%** (4-class problem)

**Per-macro-region performance**:
- **North**: 81% F1 - distinctive ingredients (rice, butter, cream)
- **Islands**: 52% F1 - geographic isolation creates unique patterns
- **South**: 44% F1 - Mediterranean ingredients (tomatoes, olive oil, chili)
- **Center**: 35% F1 - transitional zone (mixes North/South)

### What the Model Learned

The GNN learns **which ingredient-technique combinations** define regional cuisines:

**Northern recipes**:
- Rice + sauté + broth = **risotto** signature
- Butter + sauté = Northern cooking fat preference
- Cream + mix = rich Northern sauces

**Southern recipes**:
- Tomato + fry = Southern tomato sauce base
- Chili + cook = spicy Southern flavors
- Olive oil + toss = Mediterranean cooking

**Islands**:
- Seafood + grill = coastal cooking
- Pecorino + grate = sheep's milk cheese (isolation)
- Almonds + bake = Arab/Sicilian desserts

The model isn't just memorizing ingredient lists - it's learning **structure**: which ingredients pair with which techniques, in which sequences.

---

## Why Structure Matters

### The Core Insight

I spent weeks trying to improve accuracy with:
- Better hyperparameters (learning rate, dropout, batch size)
- Deeper networks (more layers)
- Regularization techniques

**None of it helped as much as switching from flat features to graphs.**

The graph structure encodes information that's otherwise lost:
- **Temporal order**: Pasta boiled before sauce added
- **Technique-ingredient pairing**: Butter sautéed vs olive oil drizzled
- **Ingredient combinations**: Which ingredients appear together in same step

**Lesson**: Before tuning hyperparameters, make sure your input representation captures the problem structure.

---

## Lessons Learned

### 1. Graph Databases Aren't Just for Social Networks

When people think "graph databases," they think Facebook friends, LinkedIn connections. But **recipes are graphs too**:
- Ingredients connect to steps
- Steps connect sequentially
- Techniques connect to ingredients

Neo4j made it easy to:
- Model these relationships naturally
- Query complex patterns
- Export to GNN format

### 2. Graphs Help When Relationships Matter

**When graphs are worth it**:
✅ Relationships matter (ingredient-technique pairing, step sequencing)
✅ Non-Euclidean data (recipes don't fit into grids or sequences)
✅ Multi-hop dependencies (ingredient A influences step B which uses ingredient C)

**When simpler models are fine**:
❌ Relationships don't matter (e.g., "contains tomato?" binary classification)
❌ Data is already tabular/flat (e.g., house prices with numeric features)
❌ Limited training data (GNNs need more data than simpler models)

For recipe regional classification, graphs were the right choice - but I wouldn't default to GNNs for all recipe ML tasks.

### 3. Data Quality > Model Architecture

The graph structure helped, but the biggest bottleneck was **data quantity**:
- **Fine-grained model** (20 regions): 20% accuracy (severe overfitting)
- **Macro-region model** (4 regions): 60% accuracy (works well)

With only 50-150 recipes per region, even the graph structure couldn't overcome data scarcity.

**Lesson**: Graphs improve representational power, but they don't create data. For fine-grained classification, I'd need 200-500 recipes per region.

---

## Implementation Details

### Graph Statistics

| Metric | Count |
|--------|-------|
| Recipes | 3,389 |
| Ingredients | 2,234 |
| Steps | 13,237 |
| REQUIRES edges | 18,547 |
| HAS_STEP edges | 13,237 |
| USES_INGREDIENT edges | 24,891 |
| NEXT_STEP edges | 11,218 |

### GNN Architecture

**Model components**:
- **Embedding layers**: Ingredients (128D), Actions (64D)
- **GAT layers**: 3 layers, 4 attention heads each
- **Pooling**: Global mean pooling
- **Classifier**: 2-layer MLP
- **Parameters**: 19.5M total

**Training**:
- AdamW optimizer (lr=0.001, weight decay=1e-5)
- Weighted cross-entropy loss (handle class imbalance)
- Early stopping (patience=10 epochs)
- Batch size: 32 recipes
- Best model: 3 epochs for macro-region

---

## Code & Resources

Full implementation in my [Italian Regional Cuisine repository](https://github.com/LeonardoPaccianiMori/portfolio-italian-cuisine):
- `src/preprocessing/neo4j_import.py` - Graph construction
- `src/features/feature_extractor.py` - Node/edge feature extraction
- `src/models/regional_gnn.py` - Heterogeneous GAT architecture
- `notebooks/graph_analysis.ipynb` - Neo4j exploration

**Related posts**:
- [How Artusi's 1891 Cookbook Failed to Unify Italian Cuisine](/blog/2025/artusi-failed-unification/)
- [Visualizing Italian Cuisine: Creative Techniques Beyond Bar Charts](/blog/2025/visualizing-italian-cuisine/)
- [Full Project Overview](/projects/italian-cuisine-gnn/)

**Recommended reading**:
- [Graph Attention Networks (Veličković et al., 2018)](https://arxiv.org/abs/1710.10903) - Original GAT paper
- [PyTorch Geometric Documentation](https://pytorch-geometric.readthedocs.io/) - Heterogeneous graph tutorial

---

## What I Learned

The big lesson: **structure matters**. For years I thought of ML as "features → model → predictions," where feature engineering is preprocessing and the model is where the magic happens. But for many problems (recipes, molecules, social networks, knowledge graphs), the **relationships are the features**.

Representing those relationships explicitly (as graphs) lets the model learn patterns that would be invisible in flat feature vectors.

Also, Neo4j surprised me. I expected it to be overkill for 3,000 recipes, something you'd only use at Google scale. But the ability to query complex patterns in Cypher, visualize subgraphs, and export directly to GNN format made development much faster. I'd use it again for any project where relationships matter.

The meta-lesson: **before reaching for fancy algorithms, make sure your data representation captures the problem structure**. I spent weeks tuning hyperparameters on flat features. Switching to graphs gave a bigger improvement in one day.

---

## Disclaimer

The content of this page was originally written by me. I used AI tools for editing and clarity only; the ideas, analysis, and conclusions are mine.
