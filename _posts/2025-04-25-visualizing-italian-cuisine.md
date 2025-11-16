---
layout: post
title: "Visualizing Italian Cuisine: Creative Techniques Beyond Bar Charts"
date: 2025-04-25 11:00:00
description: How custom visualizations—from RGB ternary maps to diverging choropleths—revealed geographic patterns in Italian recipes
tags: data-visualization plotly maps
categories: data-science
featured: false
---

## The Challenge: Visualizing Multi-Dimensional Culinary Data

For my [Italian Regional Cuisine project](/projects/italian-cuisine-gnn/), I had rich, multi-dimensional data:
- **3,389 recipes** across **20 Italian regions**
- **2,234 unique ingredients** with varying frequencies
- **Temporal dimension** (1891 vs modern)
- **Geographic dimension** (regional patterns)
- **Categorical relationships** (ingredient-technique pairings)

Standard visualizations (bar charts, scatter plots, heatmaps) could only show one or two dimensions at a time. To reveal deeper patterns, I needed **custom visualizations** tailored to the data structure.

This post walks through three creative visualization techniques that uncovered insights invisible in standard charts:

1. **Diverging Choropleth Maps** - The olive oil vs butter divide
2. **RGB Ternary Maps** - Three-way starch preferences (pasta/rice/polenta)
3. **Interactive Regional Similarity** - Click-to-explore hierarchical clustering

---

## 1. The Olive Oil vs Butter Divide: Diverging Choropleth

### The Question

Northern Italian cuisine uses butter. Southern cuisine uses olive oil. But where exactly is the boundary? Can we visualize the **gradient** from butter-dominant to oil-dominant regions?

### The Challenge

A standard choropleth (single color scale) shows one variable at a time:
- Map 1: Olive oil usage
- Map 2: Butter usage

But you can't **compare** them side-by-side mentally. The insight - *where* the transition happens - requires seeing both simultaneously.

### The Solution: Diverging Color Scale

I created a **fat preference score**:
```
Fat Score = (Olive Oil Usage) / (Olive Oil + Butter Usage) × 100
```

- **0% = Pure butter** (red)
- **50% = Equal mix** (yellow/white)
- **100% = Pure olive oil** (green)

Then mapped this to Italy's regions using a **diverging RdYlGn colorscale**:

```plotly
{% include plotly/italian-cuisine/olive-oil-butter-divide.json %}
```

<div class="caption">
    Diverging choropleth: Green = olive oil dominant, Red = butter dominant, Yellow = balanced. The North-South divide is stark. Interactive: hover for exact percentages, zoom to explore.
</div>

### The Insight

The visualization immediately reveals:
- **Sharp boundary** at ~45°N latitude (roughly Florence/Bologna line)
- **North**: Butter-dominant (red) - Lombardy, Piedmont, Veneto
- **Center**: Transition zone (yellow) - Tuscany, Emilia-Romagna
- **South**: Olive oil-dominant (green) - Campania, Calabria, Sicily
- **Extreme**: Valle d'Aosta (Alpine) is 91% butter; Sicily is 97% olive oil

**Why this works**:
- ✅ Shows **both** variables in one view (butter ← → oil)
- ✅ **Diverging scale** emphasizes the transition zone
- ✅ **Geographic map** reveals the north-south gradient
- ✅ **Color psychology**: Red (butter/cold) vs Green (oil/warm) matches mental model

### Implementation (Plotly)

```python
# Calculate fat preference score
fat_comparison['oil_pct'] = (fat_comparison['olive_oil'] /
                              fat_comparison['total']) * 100

# Merge with geodata
geo_fat = merge_with_geodata(italy_gdf, fat_comparison_reset,
                              'oil_pct', region_col)

# Create choropleth with diverging scale
fig = go.Figure(go.Choroplethmapbox(
    geojson=json.loads(geo_fat.to_json()),
    locations=geo_fat[region_col],
    z=geo_fat['oil_pct'],
    colorscale='RdYlGn',  # Diverging: Red → Yellow → Green
    zmid=50,              # Center at 50% (equal usage)
    zmin=0,               # Pure butter
    zmax=100,             # Pure olive oil
    marker_line_width=1,
    marker_line_color='white',
    colorbar=dict(
        title='Fat Preference',
        ticktext=['100% Butter', '50%-50%', '100% Oil'],
        tickvals=[0, 50, 100]
    )
))
```

**Key parameters**:
- `zmid=50` centers the diverging scale at equal usage
- `RdYlGn` colorscale emphasizes positive/negative deviation
- Custom `ticktext` makes colorbar intuitive

### Why Not Just Two Maps?

I tried showing two separate maps (one for butter, one for oil). Problems:
- ❌ **Cognitive load**: Viewer must mentally subtract Map A from Map B
- ❌ **No transition zone**: Can't see where balance occurs
- ❌ **Misses the story**: The divide is the insight, not individual usage

The diverging choropleth tells the story in one glance: **Italy is divided by fat preference along a geographic line**.

---

## 2. The Pasta-Rice-Polenta Triangle: RGB Ternary Visualization

### The Question

Italian regions favor different starches:
- **Pasta**: Most regions
- **Rice**: Northern regions (Po Valley paddies)
- **Polenta**: Alpine regions

But most regions use **all three** to varying degrees. How do you visualize a **three-way trade-off** geographically?

### The Challenge

Standard approaches fail:
- **Stacked bar chart**: Shows proportions but not geography
- **Three separate maps**: Can't see relationships
- **Scatter plot (2D)**: Can only show two variables

We need a visualization that shows:
1. **Three-way proportions** (ternary relationship)
2. **Geographic distribution** (map)
3. **Intuitive color mapping** (no legend required)

### The Solution: RGB Color Mixing

I used **RGB color space** as a ternary coordinate system:

- **Red channel** = Pasta proportion
- **Green channel** = Rice proportion
- **Blue channel** = Polenta proportion

Each region gets a color based on its starch mix:
- **Pure red** (255, 0, 0) = 100% pasta
- **Pure green** (0, 255, 0) = 100% rice
- **Pure blue** (0, 0, 255) = 100% polenta
- **Yellow** (255, 255, 0) = Pasta + Rice mix
- **Purple** (255, 0, 255) = Pasta + Polenta mix
- **Gray** (128, 128, 128) = Equal three-way mix

```plotly
{% include plotly/italian-cuisine/pasta-rice-polenta-triangle.json %}
```

<div class="caption">
    RGB ternary map: Red = Pasta, Green = Rice, Blue = Polenta. Color intensity shows proportion. Interactive: hover reveals exact percentages per region.
</div>

### The Insight

The visualization reveals clear **geographic clusters**:

**Green regions** (rice-dominant):
- Lombardy, Piedmont, Veneto
- Po Valley rice paddies → risotto culture
- ~50-70% rice usage

**Blue regions** (polenta-dominant):
- Trentino-Alto Adige, Valle d'Aosta
- Alpine mountain regions
- Corn cultivation in valleys
- ~40-60% polenta usage

**Red regions** (pasta-dominant):
- Most of Central/Southern Italy
- Wheat cultivation, Mediterranean diet
- 70-90% pasta usage

**Yellow regions** (pasta + rice):
- Emilia-Romagna (transitional region)
- Mixes Po Valley rice with pasta traditions
- Balanced usage

**Why this works**:
- ✅ **No legend needed**: Red/Green/Blue mapping is intuitive
- ✅ **Three dimensions** shown simultaneously
- ✅ **Geographic patterns** immediately visible (North green, Alpine blue, everywhere else red)
- ✅ **Gradient shows transitions**: Yellow regions are pasta-rice hybrids

### The Ternary Triangle Legend (Optional)

To help viewers understand the RGB mapping, you could create a **custom ternary triangle legend**. However, since the interactive map has hover tooltips showing exact percentages, this static legend is optional.

**Generated with PIL** (Python Imaging Library):

```python
def create_rgb_triangle_base64(size=300):
    """Create RGB ternary triangle with barycentric coordinates"""
    img = Image.new('RGBA', (size, size), (0, 0, 0, 0))
    pixels = img.load()

    for y in range(size):
        for x in range(size):
            nx = x / size
            ny = 1 - (y / size)

            # Check if inside triangle
            if ny <= 2 * nx and ny <= 2 * (1 - nx):
                # Barycentric coordinates
                r_weight = ny                    # Top vertex (Pasta)
                g_weight = (1 - nx) * (1 - ny)  # Bottom-left (Rice)
                b_weight = nx * (1 - ny)        # Bottom-right (Polenta)

                # Normalize
                total = r_weight + g_weight + b_weight
                if total > 0:
                    r_weight /= total
                    g_weight /= total
                    b_weight /= total

                # Map to RGB color
                r = int(r_weight * 255)
                g = int(g_weight * 255)
                b = int(b_weight * 255)

                pixels[x, y] = (r, g, b, 255)

    return img
```

This creates a smooth gradient showing all possible starch mixes.

### Implementation (Plotly Choropleth)

The tricky part: **Plotly choropleths use a single colorscale**, but we want **each region to have its own RGB color**.

**Solution**: Create one trace per region with a constant color:

```python
# Calculate RGB colors for each region
geo_starch['rgb_color'] = geo_starch.apply(
    lambda row: f'rgb({int(row["pasta_prop"]*255)},'
                f'{int(row["rice_prop"]*255)},'
                f'{int(row["polenta_prop"]*255)})',
    axis=1
)

# Create figure with one trace per region
for idx, row in geo_starch.iterrows():
    region_name = row[region_col]
    rgb_color = row['rgb_color']

    fig.add_trace(go.Choroplethmapbox(
        geojson=single_feature_geojson,
        locations=[region_name],
        z=[1],  # Constant value
        colorscale=[[0, rgb_color], [1, rgb_color]],  # Single color
        showscale=False,
        hovertemplate=(
            f'<b>{region_name}</b><br>'
            f'Pasta: {row["pasta_prop"]:.1%}<br>'
            f'Rice: {row["rice_prop"]:.1%}<br>'
            f'Polenta: {row["polenta_prop"]:.1%}'
        )
    ))
```

**Challenges solved**:
- ✅ Each region gets unique RGB color
- ✅ Hover shows exact percentages
- ✅ Smooth gradients between neighboring regions
- ✅ No confusing multi-scale colorbar

### Why This Beats Alternatives

**Alternative 1: Three separate maps**
- ❌ Viewer must mentally combine three views
- ❌ Can't see **relationships** (e.g., pasta-rice mix)

**Alternative 2: Ternary scatter plot**
- ✅ Shows three-way proportions
- ❌ Loses geographic context (which regions are neighbors?)

**Alternative 3: Pie charts per region**
- ✅ Shows proportions per region
- ❌ Cluttered, hard to compare across regions
- ❌ Can't see geographic patterns

**RGB ternary map combines the best of all**:
- ✅ Three-way proportions (ternary)
- ✅ Geographic distribution (map)
- ✅ Intuitive (color mixing)
- ✅ Compact (one visualization)

---

## 3. Interactive Regional Similarity: Hierarchical Clustering on Maps

### The Question

Which Italian regions have **similar cuisines**? Can we visualize this geographically, not just in a dendrogram?

### The Challenge

Traditional similarity analysis uses:
- **Dendrograms**: Show hierarchical clustering, but lose geography
- **Heatmaps**: Show pairwise similarity, but not spatial relationships
- **PCA/t-SNE**: Show clustering in 2D, but abstract space (not geographic)

None of these preserve the **spatial context**: which regions are neighbors, which are far apart.

### The Solution: Interactive Choropleth with Click-to-Explore

The ideal visualization would be an **interactive click-to-explore map** where:
1. **Click any region** to highlight it
2. **Map updates** to show similarity to the clicked region
3. **Color intensity** = similarity (cosine similarity of ingredient vectors)
4. **Geographic context preserved** - you see which nearby/distant regions are similar

However, this requires backend callbacks (Plotly Dash) which don't work in static Jekyll sites. Instead, the **heatmap visualization** (shown below) provides the same similarity information in a different format.

### The Insight

**Example: Sicily's Culinary Similarity**

From the similarity analysis, we can see which regions share culinary traditions with Sicily:

**Most similar regions**:
- **Sardinia** (0.89 similarity) - Fellow island, seafood-heavy
- **Calabria** (0.84) - Adjacent Southern region, share tomatoes/chili
- **Campania** (0.78) - Southern neighbor, similar Mediterranean ingredients

**Least similar regions**:
- **Valle d'Aosta** (0.21) - Alpine, completely different climate/ingredients
- **Trentino-Alto Adige** (0.28) - Mountain region, polenta-based
- **Lombardy** (0.34) - Northern, butter/rice-based

**Geographic insight**: Similarity correlates with **distance + climate**, not just administrative boundaries. The heatmap visualization below shows this pattern across all region pairs.

### Implementation (Plotly + Callbacks)

**Compute cosine similarity matrix**:

```python
from sklearn.metrics.pairwise import cosine_similarity

# Create ingredient-region matrix (TF-IDF style)
ingredient_matrix = regional_ingredients.pivot_table(
    index='region',
    columns='ingredient',
    values='usage_count',
    fill_value=0
)

# Normalize (TF-IDF style weighting)
ingredient_matrix_normalized = (
    ingredient_matrix / ingredient_matrix.sum(axis=1, keepdims=True)
)

# Cosine similarity between all region pairs
similarity_matrix = cosine_similarity(ingredient_matrix_normalized)
similarity_df = pd.DataFrame(
    similarity_matrix,
    index=ingredient_matrix.index,
    columns=ingredient_matrix.index
)
```

**Create interactive choropleth**:

```python
# On click, update map to show similarity to clicked region
def create_similarity_map(selected_region):
    similarities = similarity_df[selected_region]

    geo_similarity = merge_with_geodata(
        italy_gdf,
        similarities.reset_index().rename(columns={selected_region: 'similarity'}),
        'similarity',
        region_col
    )

    fig = go.Figure(go.Choroplethmapbox(
        geojson=json.loads(geo_similarity.to_json()),
        locations=geo_similarity[region_col],
        z=geo_similarity['similarity'],
        colorscale='RdYlBu_r',  # Red = similar, Blue = different
        zmin=0,
        zmax=1,
        marker_line_width=1,
        colorbar=dict(title='Similarity'),
        hovertemplate='<b>%{text}</b><br>Similarity: %{z:.2f}<extra></extra>'
    ))

    return fig
```

**Why this works**:
- ✅ **Preserves geography**: See if similar regions are neighbors or distant
- ✅ **Interactive exploration**: Click different regions to compare
- ✅ **Contextual**: Similarity shown in geographic context, not abstract space
- ✅ **Intuitive**: Map format is familiar, colorscale is clear

### Comparison to Standard Approaches

**Heatmap** (standard similarity viz):

```
           Sicily  Sardinia  Lombardy  ...
Sicily      1.00     0.89      0.34   ...
Sardinia    0.89     1.00      0.31   ...
Lombardy    0.34     0.31      1.00   ...
```

- ✅ Shows all pairwise similarities
- ❌ No geographic context
- ❌ Hard to read (20×20 matrix)

**Dendrogram** (hierarchical clustering):

```
           ┌─ Sicily
    ┌──────┤
    │      └─ Sardinia
────┤
    │      ┌─ Lombardy
    └──────┤
           └─ Piedmont
```

- ✅ Shows hierarchical structure
- ❌ No geography
- ❌ Binary splits hide continuous similarity

**Interactive choropleth**:
- ✅ Geography preserved
- ✅ Continuous similarity shown
- ✅ Exploration via clicking
- ✅ Intuitive for anyone

---

## Bonus: Hierarchical Clustering Heatmap with Macro-Region Annotations

For a comprehensive view, I combined **hierarchical clustering** (dendrogram) with **heatmap** (similarity matrix), adding **macro-region annotations**:

```plotly
{% include plotly/italian-cuisine/regional-similarity-heatmap.json %}
```

<div class="caption">
    Cosine similarity heatmap with hierarchical clustering. Regions reordered by similarity, grouped by macro-region (North/Center/South/Islands). Interactive: hover to see exact similarity values.
</div>

**Key additions**:
1. **Reorder rows/columns** by hierarchical clustering (similar regions adjacent)
2. **Add macro-region labels** (North, Center, South, Islands)
3. **Add separator lines** between macro-regions
4. **Annotate above/beside** axes

```python
# Define macro-region groupings
macroregion_order = {
    'North': ['Lombardia', 'Piedmont', 'Veneto', ...],
    'Center': ['Tuscany', 'Lazio', ...],
    'South': ['Campania', 'Calabria', ...],
    'Islands': ['Sicily', 'Sardinia']
}

# Flatten to ordered list
ordered_regions = [r for macro in macroregion_order.values() for r in macro]

# Reorder similarity matrix
similarity_reordered = similarity_df.loc[ordered_regions, ordered_regions]

# Create heatmap
fig = go.Figure(data=go.Heatmap(
    z=similarity_reordered.values,
    x=similarity_reordered.columns,
    y=similarity_reordered.index,
    colorscale='RdYlBu_r'
))

# Add macro-region separator lines
for i, boundary in enumerate([8, 12, 18]):  # Macro-region boundaries
    fig.add_hline(y=boundary - 0.5, line_color='white', line_width=3)
    fig.add_vline(x=boundary - 0.5, line_color='white', line_width=3)

# Add macro-region labels
fig.add_annotation(
    text='North', x=4, y=-1.5, showarrow=False,
    font=dict(size=14, color='#FF6B6B')
)
# ... (repeat for Center, South, Islands)
```

**Insight**: Clear **block diagonal structure** - regions within same macro-region are more similar to each other than to other macro-regions. This validates the GNN's 60% macro-region accuracy - the patterns are real.

---

## Lessons Learned: Visualization Principles

### 1. Choose the Right Encoding for Your Data Structure

| Data Structure | Best Visualization |
|----------------|-------------------|
| **Two opposing values** | Diverging colorscale (oil vs butter) |
| **Three-way trade-off** | RGB ternary (pasta/rice/polenta) |
| **Pairwise similarity + geography** | Interactive choropleth |
| **Hierarchical relationships** | Clustered heatmap with annotations |

Standard charts (bar, line, scatter) work for 1-2 dimensions. **Complex data needs custom visualizations**.

### 2. Leverage Human Perception

**Color psychology matters**:
- **Diverging scales** (red ↔ green): Use for opposing concepts (butter vs oil, hot vs cold)
- **RGB mixing**: Intuitive for three-way relationships (primary colors blend naturally)
- **Grayscale intensity**: Good for single-dimension magnitude (similarity)

**Spatial context matters**:
- Geographic maps preserve **neighborhood relationships**
- Abstract embeddings (PCA, t-SNE) lose this context

### 3. Make Visualizations Interactive When Possible

Static images show **one view**. Interactive visualizations let viewers **explore**:
- Click regions to see similarity
- Hover for exact values
- Toggle between metrics (steps/ingredients/tools)
- Filter by category

Plotly's interactive features (hover, click callbacks, dropdowns) dramatically increase information density.

### 4. Don't Be Afraid of Custom Implementations

All three visualizations required **custom code**:
- Diverging choropleth: Manual `zmid` parameter tuning
- RGB ternary: PIL image generation + barycentric coordinates
- Interactive similarity: Separate trace per region

**Off-the-shelf tools** (Matplotlib, Seaborn) are great for standard charts. For domain-specific insights, **custom is better**.

---

## Code & Resources

Full visualization code in my [Italian Regional Cuisine repository](https://github.com/LeonardoPaccianiMori/portfolio-italian-cuisine):
- `notebooks/comprehensive_italian_cuisine_analysis.ipynb` - All visualizations
- Interactive versions use Plotly (HTML exports available)

**Related posts**:
- [How Artusi's 1891 Cookbook Failed to Unify Italian Cuisine](/blog/2025/artusi-failed-unification/)
- [Why I Represented Recipes as Graphs](/blog/2025/why-graphs-for-recipes/)
- [Full Project Overview](/projects/italian-cuisine-gnn/)

**Recommended reading**:
- [Fundamentals of Data Visualization](https://clauswilke.com/dataviz/) (Claus Wilke)
- [Plotly Python Documentation](https://plotly.com/python/)
- [ColorBrewer](https://colorbrewer2.org/) - Choosing colorscales

---

## What I Learned

The biggest lesson: **visualization is not decoration, it's exploration**. I started with standard bar charts and scatter plots, which showed individual patterns but missed the geographic story.

Switching to custom visualizations - diverging choropleths, RGB ternary maps, interactive similarity - revealed insights I wouldn't have found otherwise:
- The sharp oil/butter boundary at ~45°N latitude
- Alpine regions' unique polenta preference
- Island isolation creating culinary distinctiveness

These weren't just "prettier" versions of bar charts. They were **different questions answered** because the visualization method enabled them.

Also learned: **invest time in custom visualizations early**. I spent two weeks making standard plots, then one day building the RGB ternary map, which became the most insightful visualization in the project. The upfront effort (learning PIL, barycentric coordinates, Plotly customization) paid off immediately.

Finally: **geographic context matters for geographic data**. PCA and t-SNE embeddings are powerful for clustering, but they lose the spatial relationships that make Italian cuisine geographic (neighbors share ingredients, climate drives choices). Keeping the map view preserved that context and made patterns interpretable.
