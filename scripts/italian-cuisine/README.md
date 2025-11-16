# Italian Cuisine Plotly Figure Generation

This folder contains everything needed to generate interactive Plotly visualizations for the Italian Cuisine GNN project.

## 📁 Folder Structure

```
personal-website-portfolio/
├── assets/
│   ├── data/
│   │   └── italian-cuisine/
│   │       ├── shapefiles/          # Italy regional boundaries
│   │       │   └── Reg01012025_WGS84.*
│   │       └── analysis/            # Recipe data CSVs
│   │           ├── recipe_metadata.csv
│   │           ├── ingredient_stats.csv
│   │           ├── regional_ingredients.csv
│   │           └── ... (other CSVs)
│   └── plotly/
│       └── italian-cuisine/         # OUTPUT: Generated JSON files
│           ├── olive-oil-butter-divide.json
│           ├── pasta-rice-polenta-triangle.json
│           └── ... (other plots)
└── scripts/
    └── italian-cuisine/
        ├── generate_plotly_figures.py  # Python script to generate plots
        └── README.md                   # This file
```

---

## 🚀 Quick Start

### 1. Generate All Figures

Run the Python script:

```bash
cd "/home/lpm/Google Drive/Websites/personal-website-portfolio/scripts/italian-cuisine"
python generate_plotly_figures.py
```

This will create 6 JSON files in `../../assets/plotly/italian-cuisine/`

### 2. Embed in Blog Posts/Project Pages

Use the ` ```plotly ` code fence syntax (as shown in al-folio documentation):

**Option A: Include by reference** (cleaner, recommended)

```markdown
```plotly
{% include_relative ../../assets/plotly/italian-cuisine/olive-oil-butter-divide.json %}
```
```

**Option B: Inline JSON** (more portable but messier)

Copy the JSON content from the generated file and paste it directly:

```markdown
```plotly
{
  "data": [...],
  "layout": {...}
}
```
```

---

## 📊 Generated Figures

After running the notebook, you'll have these JSON files ready to embed:

| File | Description | Use In |
|------|-------------|--------|
| `olive-oil-butter-divide.json` | Diverging choropleth (fat preference) | Project page, Blog Post 1, Blog Post 3 |
| `pasta-rice-polenta-triangle.json` | RGB ternary map (starch distribution) | Project page, Blog Post 1, Blog Post 3 |
| `pca-regional-clustering.json` | PCA scatter plot (macro-region clustering) | Project page, Blog Post 1 |
| `ingredient-evolution.json` | Bar chart (Artusi vs Modern) | Project page, Blog Post 1 |
| `category-evolution.json` | Stacked bar (recipe categories) | Project page, Blog Post 1 |
| `regional-similarity-heatmap.json` | Heatmap (cosine similarity) | Blog Post 3 |

---

## 🔧 Customization

### Modify a Figure

1. Edit the corresponding function in `generate_plotly_figures.py`
2. Re-run the script: `python generate_plotly_figures.py`
3. The markdown file will automatically use the updated JSON

### Add a New Figure

1. Create a new function following the existing pattern:
   ```python
   def create_my_new_figure(data):
       """Docstring explaining what this creates."""
       fig = go.Figure(...)
       return fig
   ```
2. Add it to the `figures` dict in `main()`
3. Run script to generate JSON
4. Embed in markdown using ` ```plotly ` block

### Simplify GeoJSON Further

If file sizes are too large, adjust the tolerance in the script (line ~83):

```python
# Current: 0.01 degrees (~1km)
italy_gdf['geometry'] = italy_gdf['geometry'].simplify(tolerance=0.01)

# More aggressive: 0.02 degrees (~2km)
italy_gdf['geometry'] = italy_gdf['geometry'].simplify(tolerance=0.02)
```

Higher tolerance = smaller files but less detail on boundaries.

---

## 📝 Embedding Examples

### In Project Page

```markdown
---
layout: page
title: Italian Cuisine GNN
---

## The Olive Oil vs Butter Divide

The most striking geographic pattern:

```plotly
{% include_relative ../../assets/plotly/italian-cuisine/olive-oil-butter-divide.json %}
```

As the map shows, Northern Italy uses butter while...
```

### In Blog Post

```markdown
---
layout: post
title: "Artusi's Failed Unification"
---

The data reveals a clear divide:

```plotly
{% include_relative ../../assets/plotly/italian-cuisine/olive-oil-butter-divide.json %}
```

This pattern reflects climate and agriculture...
```

---

## ✅ Benefits of This Approach

**vs Static PNG Images:**
- ✅ **Interactive**: Hover, zoom, pan
- ✅ **Higher quality**: Vector-based, scalable
- ✅ **Easier to update**: Edit notebook, re-run, done
- ✅ **Smaller file size**: ~50-200 KB vs 500KB-2MB PNGs
- ✅ **Professional**: Matches modern data science portfolios

**vs Copying Notebook Directly:**
- ✅ **Self-contained**: All data in portfolio repo
- ✅ **Version control**: Track changes to visualizations
- ✅ **Consistent theme**: Dark mode matches al-folio
- ✅ **Easy regeneration**: One notebook generates all figures

---

## 🐛 Troubleshooting

### "Module not found" errors

Install required packages:

```bash
pip install pandas numpy plotly geopandas scikit-learn
```

### "File not found" errors

Check that paths are correct relative to script location:
- Data: `../../assets/data/italian-cuisine/`
- Output: `../../assets/plotly/italian-cuisine/`

Paths are handled automatically using `Path(__file__).parent` in the script.

### Plotly plots not rendering in website

1. Verify al-folio supports ` ```plotly ` syntax (it does!)
2. Check JSON is valid (use https://jsonlint.com)
3. Ensure Jekyll is processing markdown correctly
4. Try rebuilding site: `bundle exec jekyll serve`

### GeoJSON too large

Simplify geometries more aggressively (see "Customization" section above)

---

## 📚 References

- [al-folio Plotly documentation](https://alshedivat.github.io/al-folio/blog/2025/plotly/)
- [Plotly Python documentation](https://plotly.com/python/)
- [GeoJSON simplification](https://geopandas.org/en/stable/docs/reference/api/geopandas.GeoSeries.simplify.html)

---

## 🎯 Next Steps

After generating figures:

1. ✅ Run script to generate all JSON files: `python generate_plotly_figures.py`
2. ✅ Verify files exist in `assets/plotly/italian-cuisine/`
3. ✅ Replace old project page with revised version (see `REVISION_SUMMARY.md`)
4. ✅ Replace old blog posts with new versions
5. ✅ Embed Plotly JSON files using ` ```plotly ` blocks (already done!)
6. ✅ Build site locally and preview
7. ✅ Push to production when ready!

See `REVISION_SUMMARY.md` and `PLOTLY_EMBEDS_COMPLETE.md` in the root directory for complete instructions.
