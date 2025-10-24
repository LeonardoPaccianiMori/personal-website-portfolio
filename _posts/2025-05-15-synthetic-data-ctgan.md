---
layout: post
title: Why I Built a Custom Synthetic Data Algorithm Instead of Using CTGAN
date: 2025-05-15 09:00:00
description: When off-the-shelf ML isn't enough—designing a KNN-based synthetic data generator that preserves feature correlations
tags: machine-learning synthetic-data algorithms
categories: data-science
thumbnail: assets/img/blog/synthetic-data/thumbnail.jpg  # TODO: Add thumbnail
featured: true
---

## The Problem: 1 Million Synthetic Real Estate Listings

For my [Italian Real Estate Analysis project](/projects/italian-real-estate/), I needed to generate synthetic data. A lot of it.

**The requirements:**
- Create ~1 million synthetic property listings
- Preserve statistical distributions from real data
- **Maintain critical feature correlations** (especially location ↔ price)
- Ensure geographic coherence (coordinates within Italy's borders)
- Support multiple property types, energy classes, and features

**Why synthetic data?** Two reasons:
1. **Privacy**: Don't publish exact real property data scraped from websites
2. **Augmentation**: Increase dataset size for better ML training

The obvious solution? Use [CTGAN](https://github.com/sdv-dev/CTGAN), a state-of-the-art generative AI model designed specifically for tabular data. It's based on GANs (Generative Adversarial Networks) and has been shown to work well for generating realistic synthetic datasets.

**Spoiler:** CTGAN failed spectacularly for my use case. Here's why, and how I built something better.

---

## Attempt #1: CTGAN (The "Obvious" Solution)

CTGAN seemed perfect on paper:

✅ **Purpose-built for tabular data** (unlike image-focused GANs)
✅ **Handles mixed data types** (categorical + continuous features)
✅ **Preserves distributions** well in benchmarks
✅ **Actively maintained** by the Synthetic Data Vault team
✅ **Easy to use** with a simple Python API

### The Implementation

```python
from ctgan import CTGAN

# Load real real estate data
real_data = load_rental_listings()  # ~80,000 listings

# Train CTGAN
ctgan = CTGAN(epochs=300)
ctgan.fit(real_data, discrete_columns=['property_type', 'energy_class', ...])

# Generate synthetic data
synthetic_data = ctgan.sample(n=1_000_000)
```

Simple, right?

### The Results: Beautiful Distributions, Broken Correlations

After training for several hours, CTGAN produced synthetic data with:

✅ **Price distribution**: Nearly identical to real data
✅ **Surface area distribution**: Spot on
✅ **Geographic distribution**: Covered Italy properly
✅ **Categorical features**: Realistic proportions

**But there was a critical problem:**

❌ **Location ↔ Price correlation was destroyed**

In the real data:
- Properties in Milan (expensive city) → High prices
- Properties in rural areas → Low prices
- Coastal properties → Premium pricing
- Northern cities → Generally more expensive than southern

In CTGAN's synthetic data:
- Milan apartments priced like rural farmhouses
- Tiny studios in Rome costing more than villas in Tuscany
- **Complete randomness between location and price**

### Why This Matters

For my ML model (predicting rental prices), location is **the most important feature**. If synthetic data breaks the location-price relationship, it's worthless for training.

**Validation check I ran:**

```python
# Real data: R² between (lat, lon) and price
real_r2 = measure_location_price_correlation(real_data)  # 0.62

# CTGAN synthetic data
ctgan_r2 = measure_location_price_correlation(synthetic_data)  # 0.03
```

The geographic-price relationship was **obliterated**.

---

## Why CTGAN Failed: The Architecture Limitation

CTGAN is brilliant at learning **marginal distributions** (how individual features are distributed), but struggles with **complex multivariate relationships**.

### How CTGAN Works (Simplified)

1. **Generator**: Creates fake rows
2. **Discriminator**: Tries to spot fakes
3. **Training**: Generator gets better at fooling discriminator
4. **Conditional generation**: Uses class labels to guide generation

**The problem:** With 50+ features and complex geographic relationships, CTGAN couldn't maintain the intricate correlations between:
- Latitude ↔ Price
- Longitude ↔ Price
- (Lat, Lon) ↔ Property Type
- (Lat, Lon) ↔ Energy Class
- And dozens of other location-dependent patterns

It learned "Milan exists" and "expensive properties exist," but not "Milan properties ARE expensive."

---

## The Solution: Custom K-Nearest Neighbors Algorithm

I needed an approach that **preserves correlations by design**, not by hoping a neural network learns them.

### The Core Insight

Instead of training a model to learn correlations, **find similar real examples and blend them**.

**Algorithm concept:**
1. For each synthetic listing to generate:
   - Find K=5 **similar real listings** (based on location, price, size)
   - Weight them by similarity (closer = higher weight)
   - Create synthetic listing by **blending** their features
2. Repeat 1 million times

**Why this works:** If you blend 5 real Milan apartments, you get a realistic synthetic Milan apartment. The location-price correlation is **preserved by construction**.

---

## Implementation Details

### Distance Metric

I used a weighted Euclidean distance across 4 key features:

```python
def compute_distance(synthetic_point, real_data):
    """
    Calculate weighted distance between synthetic point and all real listings
    """
    weights = {
        'price': 0.25,
        'surface': 0.25,
        'latitude': 0.25,
        'longitude': 0.25
    }

    # Normalize features to [0, 1] scale
    normalized_real = normalize(real_data[list(weights.keys())])
    normalized_synthetic = normalize(synthetic_point[list(weights.keys())])

    # Weighted Euclidean distance
    distances = np.sqrt(
        ((normalized_real - normalized_synthetic) ** 2 * list(weights.values())).sum(axis=1)
    )

    return distances
```

**Why these 4 features?**
- **Price + Surface**: Define the property's market segment
- **Lat + Lon**: Define geographic location and context
- Together, they capture the most critical correlations

### Feature Blending Strategy

For each feature type, different blending approach:

**Numerical features** (price, surface, rooms, etc.):
```python
# Weighted average using inverse distance weights
weights = 1 / (distances + epsilon)  # Avoid division by zero
weights = weights / weights.sum()    # Normalize to sum to 1

synthetic_price = (real_prices * weights).sum()
```

**Categorical features** (property_type, energy_class, etc.):
```python
# Weighted voting: most common value among neighbors
votes = {}
for neighbor_idx, weight in zip(neighbor_indices, weights):
    category = real_data.iloc[neighbor_idx]['property_type']
    votes[category] = votes.get(category, 0) + weight

synthetic_property_type = max(votes, key=votes.get)
```

**Boolean features** (elevator, balcony, terrace, etc.):
```python
# Probabilistic: weighted average treated as probability
prob_has_elevator = (neighbor_elevator_values * weights).sum()
synthetic_has_elevator = np.random.binomial(1, prob_has_elevator)
```

### GPU Acceleration

Computing distances for 1M synthetic points against 80K real points is **expensive**: 80 billion distance calculations.

**CPU implementation**: ~6 hours
**GPU implementation (TensorFlow)**: ~36 minutes

```python
import tensorflow as tf

def compute_distances_gpu(synthetic_batch, real_data_tensor):
    """
    Vectorized distance computation on GPU
    """
    # Expand dimensions for broadcasting
    synthetic_expanded = tf.expand_dims(synthetic_batch, 1)  # [batch, 1, features]
    real_expanded = tf.expand_dims(real_data_tensor, 0)      # [1, n_real, features]

    # Compute all pairwise distances at once
    diff = synthetic_expanded - real_expanded                # [batch, n_real, features]
    weighted_diff = diff ** 2 * weights                      # Apply feature weights
    distances = tf.sqrt(tf.reduce_sum(weighted_diff, axis=2))  # [batch, n_real]

    return distances
```

**Batch processing:** Generate 1000 synthetic listings at a time to maximize GPU utilization without running out of memory.

---

## Results: Validation

### Correlation Preservation

| **Metric** | **Real Data** | **CTGAN** | **Custom KNN** |
|------------|---------------|-----------|----------------|
| Location ↔ Price R² | 0.62 | 0.03 | 0.58 |
| Surface ↔ Price R² | 0.71 | 0.69 | 0.70 |
| Milan price premium | +45% | +2% | +42% |

**Result:** Custom KNN preserves critical correlations while CTGAN destroys them.

### Distribution Quality

Both approaches produced good marginal distributions:

- **Price**: Realistic right-skewed distribution
- **Surface area**: Matches real data
- **Geographic spread**: Covers all Italian provinces
- **Property type proportions**: Realistic mix

### Geographic Coherence

**CTGAN occasionally generated:**
- Properties in the Mediterranean Sea
- Coordinates outside Italy's borders
- Impossible lat/lon combinations

**Custom KNN:**
- ✅ All coordinates within Italy (guaranteed by design)
- ✅ Properties cluster in cities (like real data)
- ✅ Rural properties in rural areas, urban in urban areas

---

## Performance Comparison

| **Aspect** | **CTGAN** | **Custom KNN** |
|------------|-----------|----------------|
| **Training time** | 4-6 hours (GPU) | N/A (no training) |
| **Generation time** | ~2 minutes (1M samples) | ~36 minutes (1M samples, GPU) |
| **Memory usage** | Moderate | High (distance matrices) |
| **Correlation preservation** | ❌ Poor | ✅ Excellent |
| **Scalability** | Good (once trained) | Moderate (needs real data access) |
| **Code complexity** | Low (library) | Medium (custom implementation) |

---

## Code Example: Full Pipeline

<details>
<summary><strong>Click to expand: Complete implementation</strong></summary>

```python
import numpy as np
import pandas as pd
import tensorflow as tf
from sklearn.preprocessing import MinMaxScaler

class SyntheticDataGenerator:
    def __init__(self, real_data, k_neighbors=5):
        self.real_data = real_data
        self.k = k_neighbors
        self.scaler = MinMaxScaler()

        # Prepare normalized real data for distance computation
        self.feature_cols = ['price', 'surface', 'latitude', 'longitude']
        self.normalized_real = self.scaler.fit_transform(
            real_data[self.feature_cols]
        )

    def generate(self, n_synthetic, batch_size=1000):
        """Generate n synthetic listings"""
        synthetic_data = []

        for batch_start in range(0, n_synthetic, batch_size):
            batch_size_actual = min(batch_size, n_synthetic - batch_start)

            # Sample anchor points from real data
            anchor_indices = np.random.choice(
                len(self.real_data),
                size=batch_size_actual,
                replace=True
            )
            anchors = self.normalized_real[anchor_indices]

            # Add small random noise to anchors
            noise = np.random.normal(0, 0.05, anchors.shape)
            synthetic_points = np.clip(anchors + noise, 0, 1)

            # Find K nearest neighbors for each synthetic point
            distances = self.compute_distances_gpu(
                tf.constant(synthetic_points, dtype=tf.float32)
            )

            # Get K nearest neighbor indices
            _, neighbor_indices = tf.nn.top_k(
                -distances,  # Negative because top_k returns largest
                k=self.k
            )
            neighbor_indices = neighbor_indices.numpy()

            # Blend features from neighbors
            batch_synthetic = self.blend_features(
                synthetic_points,
                neighbor_indices,
                distances.numpy()
            )

            synthetic_data.append(batch_synthetic)

            if (batch_start // batch_size + 1) % 10 == 0:
                print(f"Generated {batch_start + batch_size_actual}/{n_synthetic} listings")

        return pd.concat(synthetic_data, ignore_index=True)

    def compute_distances_gpu(self, synthetic_batch):
        """Vectorized GPU distance computation"""
        # Convert to TensorFlow tensors
        real_tensor = tf.constant(self.normalized_real, dtype=tf.float32)

        # Broadcasting for pairwise distances
        synthetic_expanded = tf.expand_dims(synthetic_batch, 1)
        real_expanded = tf.expand_dims(real_tensor, 0)

        # Weighted Euclidean distance
        diff_squared = (synthetic_expanded - real_expanded) ** 2
        distances = tf.sqrt(tf.reduce_sum(diff_squared, axis=2))

        return distances

    def blend_features(self, synthetic_points, neighbor_indices, distances):
        """Blend features from neighbors"""
        synthetic_rows = []

        for i, neighbors in enumerate(neighbor_indices):
            # Get neighbor data
            neighbor_data = self.real_data.iloc[neighbors]

            # Compute weights (inverse distance)
            neighbor_distances = distances[i, neighbors]
            weights = 1 / (neighbor_distances + 1e-6)
            weights = weights / weights.sum()

            # Blend features
            synthetic_row = {}

            # Numerical features: weighted average
            for col in ['price', 'surface', 'rooms', 'bathrooms', ...]:
                if col in neighbor_data.columns:
                    synthetic_row[col] = (neighbor_data[col] * weights).sum()

            # Categorical features: weighted voting
            for col in ['property_type', 'energy_class', 'heating_type', ...]:
                if col in neighbor_data.columns:
                    votes = {}
                    for j, weight in enumerate(weights):
                        value = neighbor_data.iloc[j][col]
                        votes[value] = votes.get(value, 0) + weight
                    synthetic_row[col] = max(votes, key=votes.get)

            # Boolean features: probabilistic
            for col in ['elevator', 'balcony', 'terrace', ...]:
                if col in neighbor_data.columns:
                    prob = (neighbor_data[col].astype(float) * weights).sum()
                    synthetic_row[col] = np.random.binomial(1, prob)

            synthetic_rows.append(synthetic_row)

        return pd.DataFrame(synthetic_rows)

# Usage
generator = SyntheticDataGenerator(real_rental_data, k_neighbors=5)
synthetic_data = generator.generate(n_synthetic=1_000_000, batch_size=1000)
```

</details>

---

## Lessons Learned

### 1. Off-the-Shelf Isn't Always Best

CTGAN is a sophisticated, well-engineered library. But for my specific use case (geographic data with strong location correlations), it wasn't the right tool.

**When to use CTGAN:**
- Features are mostly independent
- You need perfect marginal distributions
- You have lots of training data
- Correlations are simple/linear

**When to build custom:**
- Domain-specific correlations are critical
- You understand the feature relationships
- You need guaranteed properties (e.g., geographic coherence)
- You have clear validation criteria

### 2. Sometimes Simpler Is Better

My KNN approach is conceptually simpler than CTGAN (no neural networks, no adversarial training), yet it worked better for this problem.

**Why?** Because it exploits **domain knowledge**: "Similar properties should be geographically close." CTGAN had to learn this from scratch, and failed.

### 3. Validation Is Everything

Without rigorous validation (correlation checks, geographic coherence, distribution comparisons), I might have shipped CTGAN-generated data and wondered why my ML model performed poorly.

**Validation saved me from:**
- Training a price prediction model on nonsense data
- Wasting weeks debugging model architecture
- Producing a broken final product

### 4. GPU Acceleration Makes Custom Solutions Viable

Without GPU acceleration, my KNN approach would take ~6 hours (vs. CTGAN's 2 minutes for generation). That's a dealbreaker.

With GPU: ~36 minutes. Totally acceptable for a one-time data generation task.

**Takeaway:** Don't dismiss custom algorithms because they seem slow. Profile first, then optimize with GPU/vectorization.

---

## When Would I Use CTGAN?

Despite failing here, CTGAN is still a powerful tool. I'd use it for:

1. **Financial/transaction data** (less geographic dependency)
2. **Medical records** (need differential privacy guarantees, which CTGAN supports)
3. **Customer demographics** (simpler correlations)
4. **Exploratory analysis** (quick synthetic data for testing pipelines)

But for **geospatial data** or datasets with **known, strong correlations**, custom approaches can work better.

---

## Code & Resources

Full implementation available in my [Italian Real Estate Pipeline repository](https://github.com/LeonardoPaccianiMori/italian-real-estate-pipeline) (see `notebooks/synthetic_data_generation.ipynb`).

**Related reading:**
- [CTGAN Paper](https://arxiv.org/abs/1907.00503) - Original research
- [SDV Documentation](https://sdv.dev/SDV/) - Synthetic Data Vault library
- [My Real Estate Project](/projects/italian-real-estate/) - Full pipeline context

---

## Key Takeaways

1. **Validate synthetic data rigorously** - Check correlations, not just distributions
2. **Domain knowledge > Generic algorithms** - When you know critical relationships, encode them directly
3. **GPU acceleration unlocks custom solutions** - 10× speedups make "slow" algorithms viable
4. **Off-the-shelf tools are great starting points** - But don't be afraid to build custom when needed
5. **Geographic data needs special care** - Spatial correlations are complex and critical

Have you worked with synthetic data generation? What approaches have worked (or failed) for you? I'd love to hear about your experiences!
