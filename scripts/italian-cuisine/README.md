# Italian cuisine chart generation

`generate_plotly_figures.py` regenerates selected interactive charts from the
aggregate, CC BY 4.0 analysis exports retained under
`assets/data/italian-cuisine/analysis/`.

The script deliberately does not require or distribute source recipe text,
recipe-level tables, processed recipe graphs, model features, or data splits.

## Run

From the repository root:

```bash
python -m venv .venv
source .venv/bin/activate
pip install pandas numpy plotly geopandas scikit-learn
python scripts/italian-cuisine/generate_plotly_figures.py
```

Outputs are written to `_includes/plotly/italian-cuisine/`, where the project
pages include them directly.

## Inputs

- `ingredient_usage_stats.csv`
- `regional_ingredients.csv`
- `category_stats.csv`
- Italy regional boundary shapefiles under `shapefiles/`

The broader `analysis/` directory also contains other aggregate tables used by
the site. See the repository [licensing map](../../LICENSE.md) before reuse.
