---
layout: post
title: "Why I Used Graphs (Not Just Ingredient Lists) to Understand Recipes"
date: 2025-04-15 10:00:00
description: How representing recipes as relationship networks revealed patterns that ingredient-based ML misses
tags: graph-neural-networks neo4j deep-learning
categories: data-science
featured: true
---

## The Problem: Recipes Are More Than Ingredient Lists

For my [Italian Regional Cuisine project](/projects/italian-cuisine-gnn/), I wanted to train a neural network to classify which Italian region a recipe comes from.

**The standard approach** for recipe ML:
1. Extract ingredient list
2. One-hot encode ingredients (binary: present/absent)
3. Feed to classifier (Random Forest, SVM, simple neural network)

**This works okay** for simple tasks like cuisine classification (Italian vs Chinese), but fails to capture something fundamental: **recipes aren't bags of ingredients, they're processes**.

Consider two recipes:

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

**Same ingredients** (pasta aside): eggs, guanciale, pecorino. **Completely different dishes**.

The difference isn't *what* ingredients you use, it's:
- **How** you combine them (sequencing)
- **When** you add them (timing)
- **Which techniques** you apply (frying vs boiling vs mixing)

Ingredient-based ML treats both as `[eggs=1, guanciale=1, pecorino=1, pasta=0/1]`. **Graphs capture the structure.**

---

## The Solution: Model Recipes as Knowledge Graphs

Instead of flattening recipes into ingredient lists, I represented them as **heterogeneous graphs** (networks with different node and edge types).

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

    -[:HAS_STEP {order: 4}]-> (Step4 {action: 'toss'})
```

**What this captures that ingredient lists miss**:
- **Sequencing**: Pasta is boiled *first*, guanciale fried *while* pasta cooks
- **Technique-ingredient pairing**: Guanciale is *fried* (not boiled), eggs are *mixed* (not fried)
- **Relationships**: Eggs and pecorino are combined together (not separate steps)
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

vs

```sql
-- SQL equivalent (messy)
SELECT i.name, COUNT(*) as freq
FROM recipes r
JOIN recipe_ingredients ri ON r.id = ri.recipe_id
JOIN ingredients i ON ri.ingredient_id = i.id
WHERE r.region = 'Sicilia'
GROUP BY i.name
ORDER BY freq DESC
LIMIT 10
```

For simple queries, SQL is fine. But for **multi-hop graph traversals** (e.g., "find ingredients used in steps that employ frying in Northern Italian recipes"), Cypher is far cleaner.

### 2. Graph Algorithms Built-In

Neo4j has native support for:
- **PageRank**: Find "central" ingredients (used across many recipes)
- **Community Detection**: Group recipes by similarity
- **Shortest Path**: Find recipe "distance" (how many ingredient swaps to convert one recipe to another)

I used these algorithms for exploratory analysis before building the GNN.

### 3. Visual Exploration

Neo4j Browser lets you **visualize** the graph interactively. During development, this was invaluable for:
- Debugging data quality issues (orphaned nodes, missing edges)
- Understanding recipe structure patterns
- Explaining the model to non-technical stakeholders

<div class="row">
    <div class="col-sm mt-3 mt-md-0">
        {% include figure.liquid loading="eager" path="assets/img/projects/italian-cuisine/neo4j-browser-example.png" title="Neo4j Browser" class="img-fluid rounded z-depth-1" %}
    </div>
</div>
<div class="caption">
    Neo4j Browser showing a recipe subgraph with ingredients, steps, and their relationships
</div>

### 4. Natural Fit for GNNs

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

### Why GAT Over Simpler Models?

**Graph Convolutional Networks (GCNs)** treat all neighbors equally. **GAT** learns to **weight** important connections via attention:

```
Attention(ingredient → step) = softmax(
    LeakyReLU(W * [h_ingredient || h_step])
)
```

**Example**: For a Sicilian recipe, the model might learn:
- *High attention* to `(tomato) -[:USES_INGREDIENT]-> (fry)` (tomato sauce technique)
- *High attention* to `(eggplant) -[:USES_INGREDIENT]-> (fry)` (melanzane fritte)
- *Low attention* to `(pasta) -[:USES_INGREDIENT]-> (boil)` (too common, not distinctive)

This weighting happens automatically during training - the model learns which relationships matter for regional classification.

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

After several GAT layers, each node has an updated embedding that incorporates information from its neighbors (and neighbors' neighbors, etc.).

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

## What the Model Learned

### Attention Patterns

By visualizing attention weights, I can see what the model finds important:

**For Northern recipes** (Lombardy, Piedmont):
- *High attention* to `rice` node (risotto signature)
- *High attention* to `butter` → `sauté` edges (Northern cooking fat)
- *High attention* to `cream` → `mix` edges (rich sauces)

**For Southern recipes** (Sicily, Campania):
- *High attention* to `tomato` → `fry` edges (tomato sauce base)
- *High attention* to `chili` → `cook` edges (spicy Southern flavors)
- *High attention* to `seafood` → `grill` edges (Mediterranean influence)

**For Islands** (Sardinia, Sicily):
- *High attention* to `almond` node (Sicilian pastries)
- *High attention* to `caper` node (Pantelleria capers)
- *High attention* to `pecorino` → `grate` edges (sheep's milk cheese)

The model isn't just memorizing ingredient lists - it's learning **which ingredient-technique combinations** define regional cuisines.

### Comparison to Ingredient-Only Baselines

I compared the graph-based GAT to simpler baselines:

| Model | Test Accuracy (Macro-Region) | What It Uses |
|-------|------------------------------|--------------|
| **Graph GAT** | **59.5%** | Full graph structure |
| Ingredient-only MLP | 52.3% | Binary ingredient presence |
| Ingredient + Action MLP | 55.8% | Ingredients + technique counts |
| GCN (simpler GNN) | 57.1% | Graph structure, no attention |

**Key findings**:
1. **Graphs > Flat features**: 59.5% vs 52.3% (ingredient-only)
2. **Attention helps**: GAT (59.5%) > GCN (57.1%)
3. **Techniques matter**: Adding actions (55.8%) improves over ingredients alone (52.3%)

The 7.2 percentage point improvement from using graphs (59.5% vs 52.3%) might seem small, but for a 4-class problem with imbalanced data, it's meaningful.

---

## Lessons Learned

### 1. Graph Databases Aren't Just for Social Networks

When people think "graph databases," they think Facebook friends, LinkedIn connections, Twitter followers. But **recipes are graphs too**:
- Ingredients connect to steps
- Steps connect sequentially
- Techniques connect to ingredients

Neo4j made it easy to:
- Model these relationships naturally
- Query complex patterns
- Visualize the data
- Export to GNN format

### 2. Structure Matters for ML

I spent weeks trying to improve accuracy with:
- Better hyperparameters (learning rate, dropout, batch size)
- Deeper networks (more layers)
- Regularization techniques

**None of it helped as much as switching from flat features to graphs.** The structure encodes information that's otherwise lost.

**Lesson**: Before tuning hyperparameters, make sure your input representation captures the problem structure.

### 3. Attention Mechanisms Are Interpretable

Unlike black-box neural networks, GAT attention weights can be visualized. For each recipe, I can see:
- Which ingredients the model focuses on
- Which technique-ingredient pairs are important
- Which steps contribute most to the classification

This interpretability helps:
- Debug model errors (is it confusing Central/South because both use tomatoes?)
- Validate patterns (does it correctly identify risotto as Northern?)
- Explain predictions to stakeholders

### 4. Graph Neural Networks Have Limitations

**When graphs help**:
✅ Relationships matter (ingredient-technique pairing, step sequencing)
✅ Non-Euclidean data (recipes don't fit into grids or sequences)
✅ Multi-hop dependencies (ingredient A influences step B which uses ingredient C)

**When simpler models are fine**:
❌ Relationships don't matter (e.g., binary classification "contains tomato?")
❌ Data is already tabular/flat (e.g., house prices with numeric features)
❌ Limited training data (GNNs need more data than simpler models)

For my project, graphs were the right choice. But I wouldn't default to GNNs for all recipe ML tasks.

### 5. Data Quality > Model Architecture

The graph structure helped, but the biggest bottleneck was **data quantity**:
- **Fine-grained model** (20 regions): 20% accuracy (severe overfitting)
- **Macro-region model** (4 regions): 60% accuracy (works well)

With only 50-150 recipes per region, even the graph structure couldn't overcome data scarcity.

**Lesson**: Graphs improve representational power, but they don't create data. For fine-grained classification, I'd need 200-500 recipes per region.

---

## Code & Resources

Full implementation in my [Italian Regional Cuisine repository](https://github.com/LeonardoPaccianiMori/portfolio-italian-cuisine):
- `src/preprocessing/neo4j_import.py` - Graph construction
- `src/features/feature_extractor.py` - Node/edge feature extraction
- `src/models/regional_gnn.py` - Heterogeneous GAT architecture
- `notebooks/graph_analysis.ipynb` - Neo4j exploration

**Related posts**:
- [Full Project Overview](/projects/italian-cuisine-gnn/) - Project context and results
- [Comparing Three Classification Approaches](/blog/2025/three-approaches-regional-classification/) - Why macro-regions win

**Recommended reading**:
- [Graph Attention Networks (Veličković et al., 2018)](https://arxiv.org/abs/1710.10903) - Original GAT paper
- [PyTorch Geometric Documentation](https://pytorch-geometric.readthedocs.io/) - Heterogeneous graph tutorial

---

## What I Learned

The big lesson: structure matters. I spent years thinking of ML as "features → model → predictions," where feature engineering is a preprocessing step and the model is where the magic happens. But for many problems (recipes, molecules, social networks, knowledge graphs), the relationships **are** the features. Representing those relationships explicitly (as graphs) lets the model learn patterns that would be invisible in flat feature vectors.

Also, Neo4j surprised me. I expected it to be overkill for a dataset of 2,000 recipes, something you'd only use at Google scale. But the ability to query complex patterns in a few lines of Cypher, visualize subgraphs in the browser, and export directly to GNN format made development so much faster. I'd use it again for any project where relationships matter.

Finally, I learned that interpretability and performance aren't always at odds. Attention mechanisms make GATs more interpretable **and** more accurate. The attention weights show exactly which ingredient-technique combinations define regional cuisines, turning the model from a black box into a hypothesis-generating tool. That's valuable even beyond the classification task itself.

---

## Appendix: Graph Statistics

For the curious, here are some statistics about the recipe graph:

### Node Counts

| Node Type | Count | Examples |
|-----------|-------|----------|
| Recipes | 2,019 | Carbonara, Risotto, Arancini |
| Ingredients | 2,234 | Tomato, Pasta, Olive Oil |
| Steps | 13,237 | "Sauté onions until soft" |

### Edge Counts

| Edge Type | Count | Meaning |
|-----------|-------|---------|
| REQUIRES | 18,547 | Recipe uses ingredient |
| HAS_STEP | 13,237 | Recipe contains step |
| USES_INGREDIENT | 24,891 | Step transforms ingredient |
| NEXT_STEP | 11,218 | Sequential step ordering |

### Degree Distribution

**Ingredient node degrees** (number of recipes using each ingredient):
- **Top 5**: Olive oil (892), Salt (854), Garlic (687), Tomato (621), Parsley (534)
- **Long tail**: 823 ingredients appear in <10 recipes

**Recipe node degrees** (number of ingredients per recipe):
- **Mean**: 9.2 ingredients
- **Median**: 8 ingredients
- **Max**: 34 ingredients (complex regional feast dish)

### Graph Diameter

**Longest shortest path** (recipe → ingredient → recipe chain): 8 hops

This means you can connect any two recipes through a chain of shared ingredients and intermediate recipes in at most 8 steps. The "Six Degrees of Kevin Bacon" for Italian cuisine!
