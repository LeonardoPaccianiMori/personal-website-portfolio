#!/usr/bin/env python3
"""
Generate Interactive Plotly Visualizations for Italian Cuisine GNN Project

This script creates all interactive Plotly visualizations as JSON files ready to
embed in Jekyll blog posts and project pages using the ```plotly code fence syntax.

Usage:
    python generate_plotly_figures.py

Output:
    JSON files in ../../_includes/plotly/italian-cuisine/
    - olive-oil-butter-divide.json
    - pasta-rice-polenta-triangle.json
    - pca-regional-clustering.json
    - ingredient-evolution.json
    - category-evolution.json
    - regional-similarity-heatmap.json

Requirements:
    - pandas, numpy, plotly, geopandas, scikit-learn
    - Data files in ../../assets/data/italian-cuisine/
"""

import pandas as pd
import numpy as np
import plotly.graph_objects as go
import plotly.express as px
import plotly.io as pio
import json
import geopandas as gpd
from pathlib import Path
from sklearn.decomposition import PCA
from sklearn.metrics.pairwise import cosine_similarity


# ==============================================================================
# CONFIGURATION
# ==============================================================================

# Set paths relative to script location
SCRIPT_DIR = Path(__file__).parent
BASE_DIR = SCRIPT_DIR / '../../assets/data/italian-cuisine'
SHAPEFILE_PATH = BASE_DIR / 'shapefiles' / 'Reg01012025_WGS84.shp'
DATA_DIR = BASE_DIR / 'analysis'
OUTPUT_DIR = SCRIPT_DIR / '../../_includes/plotly/italian-cuisine'

# Ensure output directory exists
OUTPUT_DIR.mkdir(parents=True, exist_ok=True)

# Plotly theme and colors
pio.templates.default = "plotly_dark"  # Match al-folio dark theme
COLORS = {
    'artusi': '#FF6B6B',      # Historical data (warm red)
    'contemporary': '#4ECDC4',  # Contemporary data (teal)
    'positive': '#51CF66',    # Positive trends (green)
    'negative': '#FF8787',    # Negative trends (red)
}

# Shapefile region column name
REGION_COL = "DEN_REG"
ISTAT_BOUNDARY_SOURCE = (
    "https://www.istat.it/notizia/"
    "confini-delle-unita-amministrative-a-fini-statistici-al-1-gennaio-2018-2/"
)


# ==============================================================================
# HELPER FUNCTIONS
# ==============================================================================

def load_data():
    """
    Load all data files (CSVs, JSON, shapefile) needed for visualizations.

    The inputs are aggregate analysis exports. Source recipe text and
    recipe-level derivatives are intentionally not required or distributed.

    Returns:
        tuple: (ingredient_stats, regional_ingredients, category_stats,
                italy_gdf)

    Raises:
        FileNotFoundError: If required data files are missing
    """
    print("Loading data files...")

    # Load CSV files
    ingredient_stats = pd.read_csv(DATA_DIR / 'ingredient_usage_stats.csv')
    regional_ingredients = pd.read_csv(DATA_DIR / 'regional_ingredients.csv')
    category_stats = pd.read_csv(DATA_DIR / 'category_stats.csv')

    # Load and process shapefile
    italy_gdf = gpd.read_file(SHAPEFILE_PATH)

    # Ensure WGS84 projection (required for Plotly's tile maps)
    if italy_gdf.crs != 'EPSG:4326':
        italy_gdf = italy_gdf.to_crs('EPSG:4326')

    # Simplify geometries to reduce JSON file size
    # tolerance=0.01 degrees (~1km) balances quality vs file size
    italy_gdf['geometry'] = italy_gdf['geometry'].simplify(
        tolerance=0.01,
        preserve_topology=True
    )

    print(f"✓ Loaded {len(ingredient_stats)} ingredients")
    print(f"✓ Loaded {len(italy_gdf)} regions")
    print("✓ Simplified regional boundaries for browser delivery")

    return ingredient_stats, regional_ingredients, category_stats, italy_gdf


def merge_with_geodata(gdf, data_df, region_col_name):
    """
    Merge statistical data with geodataframe for choropleth mapping.

    Handles region name standardization (e.g., "Emilia Romagna" → "Emilia-Romagna")
    to match shapefile naming conventions.

    Args:
        gdf (GeoDataFrame): Italy regional boundaries geodataframe
        data_df (DataFrame): Statistical data with 'region' column
        region_col_name (str): Column name in gdf containing region names

    Returns:
        GeoDataFrame: Merged geodataframe with statistical data
    """
    merged = gdf.copy()
    data_df = data_df.copy()

    # Standardize region names to match shapefile format (with hyphens)
    region_mapping = {
        'Emilia Romagna': 'Emilia-Romagna',
        'Friuli Venezia Giulia': 'Friuli-Venezia Giulia',
        'Trentino Alto Adige': 'Trentino-Alto Adige'
    }

    if 'region' in data_df.columns:
        data_df['region'] = data_df['region'].replace(region_mapping)

    # Merge on region names
    merged = merged.merge(
        data_df,
        left_on=region_col_name,
        right_on='region',
        how='left'
    )

    return merged


def istat_boundary_annotation():
    """Return a serializable Plotly annotation for Istat-derived geometry."""
    return {
        "x": 0,
        "y": 0,
        "xref": "paper",
        "yref": "paper",
        "xanchor": "left",
        "yanchor": "bottom",
        "showarrow": False,
        "text": (
            f'Boundaries: <a href="{ISTAT_BOUNDARY_SOURCE}">Istat 2025</a>, '
            'CC BY 4.0; simplified for web'
        ),
        "font": {"size": 10, "color": "#111111"},
        "bgcolor": "rgba(255,255,255,0.82)",
        "borderpad": 3,
    }


def add_istat_boundary_attribution(fig):
    """Credit the adapted Istat boundary geometry inside each map."""
    fig.add_annotation(**istat_boundary_annotation())
    return fig


def credit_all_geometry_artifacts():
    """Add the Istat credit to every retained JSON artifact with GeoJSON."""
    marker = "Istat 2025"
    for json_file in sorted(OUTPUT_DIR.glob("*.json")):
        payload = json.loads(json_file.read_text())
        if not any("geojson" in trace for trace in payload.get("data", [])):
            continue

        annotations = payload.setdefault("layout", {}).setdefault(
            "annotations", []
        )
        if not any(marker in item.get("text", "") for item in annotations):
            annotations.append(istat_boundary_annotation())
            json_file.write_text(
                json.dumps(payload, separators=(",", ":")) + "\n"
            )


def export_figure(fig, filename):
    """
    Export Plotly figure as JSON file.

    Converts figure to JSON format compatible with al-folio's ```plotly syntax.
    Reports file size to help track total payload.

    Args:
        fig (plotly.graph_objects.Figure): Plotly figure to export
        filename (str): Output filename (e.g., 'my-plot.json')

    Returns:
        Path: Path to exported file
    """
    output_path = OUTPUT_DIR / filename

    # Convert figure to JSON string
    fig_json = fig.to_json()

    # Save to file
    with open(output_path, 'w') as f:
        f.write(fig_json)

    # Report file size
    file_size_kb = output_path.stat().st_size / 1024
    print(f"  ✓ Exported {filename} ({file_size_kb:.1f} KB)")

    return output_path


# ==============================================================================
# VISUALIZATION GENERATORS
# ==============================================================================

def create_oil_butter_diverging_choropleth(italy_gdf, regional_ingredients):
    """
    Create diverging choropleth map showing olive oil vs butter preference.

    Uses an orange-neutral-blue colorscale where:
    - Blue = olive oil dominant
    - Orange = butter dominant
    - Light neutral = balanced usage

    Args:
        italy_gdf (GeoDataFrame): Italy regional boundaries
        regional_ingredients (DataFrame): Regional ingredient usage data

    Returns:
        plotly.graph_objects.Figure: Interactive choropleth map
    """
    print("\n1. Creating olive oil vs butter diverging choropleth...")

    # Extract olive oil and butter usage counts by region
    olive_oil_regional = regional_ingredients[
        regional_ingredients['ingredient'] == 'olive oil'
    ].set_index('region')['usage_count']

    butter_regional = regional_ingredients[
        regional_ingredients['ingredient'] == 'butter'
    ].set_index('region')['usage_count']

    # Calculate fat preference score (0-100 scale)
    # 0 = pure butter, 50 = balanced, 100 = pure olive oil
    fat_comparison = pd.DataFrame({
        'olive_oil': olive_oil_regional,
        'butter': butter_regional
    }).fillna(0)

    fat_comparison['total'] = fat_comparison['olive_oil'] + fat_comparison['butter']
    fat_comparison['oil_pct'] = (fat_comparison['olive_oil'] / fat_comparison['total']) * 100
    fat_comparison = fat_comparison.reset_index()

    # Merge with geodata
    geo_fat = merge_with_geodata(italy_gdf, fat_comparison, REGION_COL)
    geo_fat['oil_pct'] = geo_fat['oil_pct'].fillna(50)  # Default to balanced if no data

    # Create diverging choropleth
    fig = go.Figure(go.Choroplethmap(
        geojson=json.loads(geo_fat.to_json()),
        locations=geo_fat[REGION_COL],
        z=geo_fat['oil_pct'],
        featureidkey='properties.' + REGION_COL,
        colorscale=[
            [0.0, '#E69F00'],
            [0.25, '#F2CC78'],
            [0.5, '#F3F4F6'],
            [0.75, '#73B6DA'],
            [1.0, '#0072B2'],
        ],
        zmid=50,              # Center divergence at 50% (balanced)
        zmin=0,
        zmax=100,
        marker_line_width=1,
        marker_line_color='white',
        colorbar=dict(
            title='Fat Preference',
            ticktext=['100% Butter', '50%-50%', '100% Oil'],
            tickvals=[0, 50, 100]
        ),
        hovertemplate='<b>%{properties.DEN_REG}</b><br>Olive Oil: %{z:.1f}%<br>Butter: %{customdata:.1f}%<extra></extra>',
        customdata=100 - geo_fat['oil_pct']  # Calculate butter percentage for hover
    ))

    # Update layout for dark theme and proper map centering
    fig.update_layout(
        title='The Olive Oil vs Butter Divide: Geographic Distribution',
        map=dict(
            style="carto-darkmatter",
            zoom=4.75,
            center={"lat": 42.1, "lon": 12.5},
        ),
        height=600,
        paper_bgcolor='rgba(0,0,0,0)',
        margin={"r": 0, "t": 40, "l": 0, "b": 0}
    )

    return add_istat_boundary_attribution(fig)


def create_tomato_choropleth(italy_gdf, regional_ingredients):
    """
    Create choropleth map showing tomato usage by region.

    Args:
        italy_gdf (GeoDataFrame): Italy regional boundaries
        regional_ingredients (DataFrame): Regional ingredient usage data

    Returns:
        plotly.graph_objects.Figure: Interactive choropleth map
    """
    print("\n2. Creating tomato usage choropleth...")

    # Extract tomato usage by region
    tomato_regional = regional_ingredients[
        regional_ingredients['ingredient'] == 'tomato'
    ].set_index('region')['usage_count']

    # Merge with geodataframe
    geo_tomato = italy_gdf.merge(
        tomato_regional.rename('tomato_count'),
        left_on=REGION_COL,
        right_index=True,
        how='left'
    ).fillna(0)

    # Create choropleth
    fig = go.Figure(go.Choroplethmap(
        geojson=json.loads(geo_tomato.to_json()),
        locations=geo_tomato[REGION_COL],
        z=geo_tomato['tomato_count'],
        featureidkey=f'properties.{REGION_COL}',
        colorscale='Reds',
        zmin=0,
        marker_line_width=1,
        marker_line_color='white',
        colorbar=dict(title='Tomato<br>Usage'),
        hovertemplate='<b>%{location}</b><br>Tomato usage: %{z:.0f}<extra></extra>'
    ))

    fig.update_layout(
        title='Tomato Usage Across Italian Regions',
        map=dict(
            style='carto-positron',
            center=dict(lat=42.5, lon=12.5),
            zoom=4.5
        ),
        height=600,
        paper_bgcolor='rgba(0,0,0,0)',
        plot_bgcolor='rgba(0,0,0,0)'
    )

    return add_istat_boundary_attribution(fig)


def create_cheese_choropleth(italy_gdf, regional_ingredients):
    """
    Create choropleth map showing cheese usage by region.

    Args:
        italy_gdf (GeoDataFrame): Italy regional boundaries
        regional_ingredients (DataFrame): Regional ingredient usage data

    Returns:
        plotly.graph_objects.Figure: Interactive choropleth map
    """
    print("\n3. Creating cheese usage choropleth...")

    # Sum all cheese types (cheese, parmesan, ricotta, mozzarella, etc.)
    cheese_ingredients = ['cheese', 'parmesan', 'ricotta', 'mozzarella',
                         'gorgonzola', 'pecorino', 'fontina']

    cheese_data = regional_ingredients[
        regional_ingredients['ingredient'].isin(cheese_ingredients)
    ].groupby('region')['usage_count'].sum()

    # Merge with geodataframe
    geo_cheese = italy_gdf.merge(
        cheese_data.rename('cheese_count'),
        left_on=REGION_COL,
        right_index=True,
        how='left'
    ).fillna(0)

    # Create choropleth
    fig = go.Figure(go.Choroplethmap(
        geojson=json.loads(geo_cheese.to_json()),
        locations=geo_cheese[REGION_COL],
        z=geo_cheese['cheese_count'],
        featureidkey=f'properties.{REGION_COL}',
        colorscale='YlOrBr',
        zmin=0,
        marker_line_width=1,
        marker_line_color='white',
        colorbar=dict(title='Cheese<br>Usage'),
        hovertemplate='<b>%{location}</b><br>Cheese usage: %{z:.0f}<extra></extra>'
    ))

    fig.update_layout(
        title='Cheese Usage Across Italian Regions',
        map=dict(
            style='carto-positron',
            center=dict(lat=42.5, lon=12.5),
            zoom=4.5
        ),
        height=600,
        paper_bgcolor='rgba(0,0,0,0)',
        plot_bgcolor='rgba(0,0,0,0)'
    )

    return add_istat_boundary_attribution(fig)


def create_seafood_choropleth(italy_gdf, regional_ingredients):
    """
    Create choropleth map showing seafood usage by region.

    Args:
        italy_gdf (GeoDataFrame): Italy regional boundaries
        regional_ingredients (DataFrame): Regional ingredient usage data

    Returns:
        plotly.graph_objects.Figure: Interactive choropleth map
    """
    print("\n4. Creating seafood usage choropleth...")

    # Sum all seafood types
    seafood_ingredients = ['fish', 'seafood', 'tuna', 'anchovy', 'salmon',
                          'cod', 'shrimp', 'mussel', 'clam', 'squid']

    seafood_data = regional_ingredients[
        regional_ingredients['ingredient'].isin(seafood_ingredients)
    ].groupby('region')['usage_count'].sum()

    # Merge with geodataframe
    geo_seafood = italy_gdf.merge(
        seafood_data.rename('seafood_count'),
        left_on=REGION_COL,
        right_index=True,
        how='left'
    ).fillna(0)

    # Create choropleth
    fig = go.Figure(go.Choroplethmap(
        geojson=json.loads(geo_seafood.to_json()),
        locations=geo_seafood[REGION_COL],
        z=geo_seafood['seafood_count'],
        featureidkey=f'properties.{REGION_COL}',
        colorscale='Blues',
        zmin=0,
        marker_line_width=1,
        marker_line_color='white',
        colorbar=dict(title='Seafood<br>Usage'),
        hovertemplate='<b>%{location}</b><br>Seafood usage: %{z:.0f}<extra></extra>'
    ))

    fig.update_layout(
        title='Seafood Usage Across Italian Regions',
        map=dict(
            style='carto-positron',
            center=dict(lat=42.5, lon=12.5),
            zoom=4.5
        ),
        height=600,
        paper_bgcolor='rgba(0,0,0,0)',
        plot_bgcolor='rgba(0,0,0,0)'
    )

    return add_istat_boundary_attribution(fig)


def create_pasta_rice_polenta_ternary_map(italy_gdf, regional_ingredients):
    """
    Create RGB ternary choropleth showing pasta/rice/polenta distribution.

    Uses color mixing where:
    - Red channel = Pasta proportion
    - Green channel = Rice proportion
    - Blue channel = Polenta proportion

    Each region gets an RGB color based on its starch mixture.

    Args:
        italy_gdf (GeoDataFrame): Italy regional boundaries
        regional_ingredients (DataFrame): Regional ingredient usage data

    Returns:
        plotly.graph_objects.Figure: Interactive RGB ternary map
    """
    print("\n2. Creating pasta/rice/polenta RGB ternary map...")

    # Define search patterns for each starch type
    pasta_pattern = (
        'pasta|spaghetti|tagliatelle|fettuccine|lasagna|lasagne|'
        'ravioli|tortellini|tortelloni|cappelletti|agnolotti|'
        'rigatoni|fusilli|farfalle|conchiglie|orecchiette|'
        'bucatini|vermicelli|pappardelle|gnocchi|paccheri'
    )
    rice_pattern = 'rice|risotto'
    polenta_pattern = 'polenta'

    # Aggregate usage counts by region for each starch
    pasta_regional = regional_ingredients[
        regional_ingredients['ingredient'].str.contains(pasta_pattern, case=False, na=False)
    ].groupby('region')['usage_count'].sum()

    rice_regional = regional_ingredients[
        regional_ingredients['ingredient'].str.contains(rice_pattern, case=False, na=False)
    ].groupby('region')['usage_count'].sum()

    polenta_regional = regional_ingredients[
        regional_ingredients['ingredient'].str.contains(polenta_pattern, case=False, na=False)
    ].groupby('region')['usage_count'].sum()

    # Calculate proportions (for RGB color mixing)
    starch_comparison = pd.DataFrame({
        'pasta': pasta_regional,
        'rice': rice_regional,
        'polenta': polenta_regional
    }).fillna(0)

    starch_comparison['total_starch'] = starch_comparison.sum(axis=1)
    starch_comparison['pasta_prop'] = starch_comparison['pasta'] / starch_comparison['total_starch']
    starch_comparison['rice_prop'] = starch_comparison['rice'] / starch_comparison['total_starch']
    starch_comparison['polenta_prop'] = starch_comparison['polenta'] / starch_comparison['total_starch']
    starch_comparison = starch_comparison.fillna(0).reset_index()

    # Standardize region names
    region_mapping = {
        'Emilia Romagna': 'Emilia-Romagna',
        'Friuli Venezia Giulia': 'Friuli-Venezia Giulia',
        'Trentino Alto Adige': 'Trentino-Alto Adige'
    }
    starch_comparison['region'] = starch_comparison['region'].replace(region_mapping)

    # Merge with geodata
    geo_starch = italy_gdf.copy()
    geo_starch = geo_starch.merge(
        starch_comparison[['region', 'pasta_prop', 'rice_prop', 'polenta_prop']],
        left_on=REGION_COL,
        right_on='region',
        how='left'
    )

    # Fill missing values with 0
    geo_starch['pasta_prop'] = geo_starch['pasta_prop'].fillna(0)
    geo_starch['rice_prop'] = geo_starch['rice_prop'].fillna(0)
    geo_starch['polenta_prop'] = geo_starch['polenta_prop'].fillna(0)

    # Calculate RGB color for each region based on starch proportions
    geo_starch['rgb_color'] = geo_starch.apply(
        lambda row: f'rgb({int(row["pasta_prop"]*255)},'
                    f'{int(row["rice_prop"]*255)},'
                    f'{int(row["polenta_prop"]*255)})',
        axis=1
    )

    # Convert to GeoJSON and add RGB colors
    geojson_data = json.loads(geo_starch.to_json())
    for i, feature in enumerate(geojson_data['features']):
        feature['properties']['rgb_color'] = geo_starch.iloc[i]['rgb_color']

    # Create figure with one trace per region (each with its unique RGB color)
    # This is necessary because Plotly choropleth only supports single colorscale
    fig = go.Figure()

    for idx, row in geo_starch.iterrows():
        region_name = row[REGION_COL]
        rgb_color = row['rgb_color']

        # Create single-feature GeoJSON for this region
        single_feature_geojson = {
            'type': 'FeatureCollection',
            'features': [geojson_data['features'][idx]]
        }

        # Build hover text showing exact percentages
        hover_text = (
            f'<b>{region_name}</b><br>'
            f'Pasta: {row["pasta_prop"]:.1%}<br>'
            f'Rice: {row["rice_prop"]:.1%}<br>'
            f'Polenta: {row["polenta_prop"]:.1%}'
        )

        # Add trace with unique color
        fig.add_trace(go.Choroplethmap(
            geojson=single_feature_geojson,
            locations=[region_name],
            z=[1],  # Constant value (not used, color comes from colorscale)
            featureidkey='properties.' + REGION_COL,
            marker_line_width=1,
            marker_line_color='white',
            marker=dict(opacity=0.8),
            colorscale=[[0, rgb_color], [1, rgb_color]],  # Single-color scale
            showscale=False,
            hovertemplate=hover_text + '<extra></extra>',
            hoverinfo='text',
            name=region_name,
            showlegend=False
        ))

    # Update layout
    fig.update_layout(
        title='Pasta/Rice/Polenta Distribution (RGB Ternary Map)<br><sub>Red=Pasta, Green=Rice, Blue=Polenta</sub>',
        map=dict(
            style="carto-darkmatter",
            zoom=4.75,
            center={"lat": 42.1, "lon": 12.5},
        ),
        height=600,
        paper_bgcolor='rgba(0,0,0,0)',
        margin={"r": 0, "t": 60, "l": 0, "b": 0}
    )

    return add_istat_boundary_attribution(fig)


def create_pca_clustering_scatter(regional_ingredients):
    """
    Create PCA scatter plot showing regional culinary clustering.

    Projects high-dimensional ingredient usage data to 2D using PCA,
    colored by macro-region (North, Center, South, Islands).

    Args:
        regional_ingredients (DataFrame): Regional ingredient usage data

    Returns:
        plotly.graph_objects.Figure: Interactive scatter plot
    """
    print("\n3. Creating PCA regional clustering scatter plot...")

    # Create ingredient-region matrix
    ingredient_matrix = regional_ingredients.pivot_table(
        index='region',
        columns='ingredient',
        values='usage_count',
        fill_value=0
    )

    # Normalize (TF-IDF style: proportion of total usage per region)
    ingredient_matrix_normalized = (
        ingredient_matrix.div(ingredient_matrix.sum(axis=1), axis=0)
    )

    # Apply PCA to reduce to 2 dimensions
    pca = PCA(n_components=2)
    pca_coords = pca.fit_transform(ingredient_matrix_normalized)

    # Map regions to macro-regions for coloring
    macroregion_map = {
        'Lombardia': 'North', 'Piemonte': 'North', 'Veneto': 'North',
        'Emilia Romagna': 'North', 'Liguria': 'North', 'Trentino Alto Adige': 'North',
        'Friuli Venezia Giulia': 'North', "Valle d'Aosta": 'North',
        'Toscana': 'Center', 'Lazio': 'Center', 'Marche': 'Center', 'Umbria': 'Center',
        'Campania': 'South', 'Puglia': 'South', 'Calabria': 'South',
        'Abruzzo': 'South', 'Molise': 'South', 'Basilicata': 'South',
        'Sicilia': 'Islands', 'Sardegna': 'Islands'
    }

    # Create DataFrame for plotting
    pca_df = pd.DataFrame({
        'region': ingredient_matrix.index,
        'PC1': pca_coords[:, 0],
        'PC2': pca_coords[:, 1]
    })
    pca_df['macro_region'] = pca_df['region'].map(macroregion_map)

    # Create scatter plot colored by macro-region
    fig = px.scatter(
        pca_df,
        x='PC1',
        y='PC2',
        color='macro_region',
        text='region',
        color_discrete_map={
            'North': '#FF6B6B',
            'Center': '#4ECDC4',
            'South': '#51CF66',
            'Islands': '#FFE66D'
        },
        title='PCA Projection of Regional Cuisines<br><sub>Colored by Macro-Region</sub>'
    )

    # Update trace styling
    fig.update_traces(
        textposition='top center',
        marker=dict(size=12, line=dict(width=1, color='white'))
    )

    # Update layout with variance explained in axis labels
    fig.update_layout(
        xaxis_title=f'PC1 ({pca.explained_variance_ratio_[0]*100:.1f}% variance)',
        yaxis_title=f'PC2 ({pca.explained_variance_ratio_[1]*100:.1f}% variance)',
        height=600,
        legend_title='Macro-Region',
        paper_bgcolor='rgba(0,0,0,0)',
        plot_bgcolor='rgba(0,0,0,0)',
        xaxis=dict(gridcolor='#333', zeroline=True, zerolinecolor='#666'),
        yaxis=dict(gridcolor='#333', zeroline=True, zerolinecolor='#666')
    )

    return fig


def create_ingredient_evolution_bar(ingredient_stats):
    """
    Create grouped bar chart comparing ingredient usage: Artusi (1891) vs Modern.

    Shows top 15 ingredients by total usage with side-by-side bars.

    Args:
        ingredient_stats (DataFrame): Ingredient usage statistics

    Returns:
        plotly.graph_objects.Figure: Interactive bar chart
    """
    print("\n4. Creating ingredient evolution bar chart...")

    # Get top 15 ingredients by total usage
    top_ingredients = ingredient_stats.nlargest(15, 'total_usage')

    # Create grouped bar chart
    fig = go.Figure()

    # Artusi (1891) bars
    fig.add_trace(go.Bar(
        y=top_ingredients['ingredient'],
        x=top_ingredients['artusi_freq'],
        orientation='h',
        name='Artusi (1891)',
        marker_color=COLORS['artusi']
    ))

    # Contemporary-corpus bars
    fig.add_trace(go.Bar(
        y=top_ingredients['ingredient'],
        x=top_ingredients['contemporary_freq'],
        orientation='h',
        name='Contemporary corpus',
        marker_color=COLORS['contemporary']
    ))

    # Update layout
    fig.update_layout(
        title='Top 15 Ingredients: Usage Frequency Comparison (1891 vs Modern)',
        xaxis_title='Frequency (% of recipes)',
        yaxis_title='',
        height=600,
        barmode='group',  # Side-by-side bars
        paper_bgcolor='rgba(0,0,0,0)',
        plot_bgcolor='rgba(0,0,0,0)',
        xaxis=dict(gridcolor='#333'),
        yaxis=dict(autorange='reversed')  # Top ingredient at top
    )

    return fig


def create_category_evolution_stacked(category_stats):
    """
    Create stacked bar chart showing recipe category evolution.

    Compares category distribution between Artusi (1891) and modern recipes.

    Args:
        category_stats (DataFrame): Category statistics by source

    Returns:
        plotly.graph_objects.Figure: Interactive stacked bar chart
    """
    print("\n5. Creating category evolution stacked bar chart...")

    # Split data by source
    artusi_cats = category_stats[category_stats['source'] == 'Artusi']
    contemporary_cats = category_stats[category_stats['source'] == 'contemporary']

    # Merge to get both sources for each category
    cat_comparison = pd.merge(
        artusi_cats[['category', 'count']].rename(columns={'count': 'Artusi'}),
        contemporary_cats[['category', 'count']].rename(columns={'count': 'contemporary'}),
        on='category',
        how='outer'
    ).fillna(0)

    # Calculate percentages (out of 790 Artusi recipes and 2,599 contemporary recipes)
    cat_comparison['Artusi_pct'] = (cat_comparison['Artusi'] / 790) * 100
    cat_comparison['contemporary_pct'] = (cat_comparison['contemporary'] / 2599) * 100
    cat_comparison['total_pct'] = cat_comparison['Artusi_pct'] + cat_comparison['contemporary_pct']

    # Sort by total percentage (ascending for bottom-to-top display)
    cat_comparison = cat_comparison.sort_values('total_pct', ascending=True)

    # Create stacked bar chart
    fig = go.Figure()

    # Artusi layer
    fig.add_trace(go.Bar(
        y=cat_comparison['category'],
        x=cat_comparison['Artusi_pct'],
        orientation='h',
        name='Artusi (1891)',
        marker_color=COLORS['artusi'],
        text=cat_comparison['Artusi_pct'].round(1),
        textposition='inside'
    ))

    # Contemporary layer
    fig.add_trace(go.Bar(
        y=cat_comparison['category'],
        x=cat_comparison['contemporary_pct'],
        orientation='h',
        name='Contemporary corpus',
        marker_color=COLORS['contemporary'],
        text=cat_comparison['contemporary_pct'].round(1),
        textposition='inside'
    ))

    # Update layout
    fig.update_layout(
        title='Recipe Category Distribution: 1891 vs Modern (Stacked)',
        xaxis_title='Percentage of Recipes',
        barmode='stack',
        height=600,
        paper_bgcolor='rgba(0,0,0,0)',
        plot_bgcolor='rgba(0,0,0,0)',
        xaxis=dict(gridcolor='#333')
    )

    return fig


def create_regional_similarity_heatmap(regional_ingredients):
    """
    Create hierarchical clustered heatmap showing regional culinary similarity.

    Uses cosine similarity of ingredient usage vectors. Regions are reordered
    by hierarchical clustering and grouped by macro-region.

    Args:
        regional_ingredients (DataFrame): Regional ingredient usage data

    Returns:
        plotly.graph_objects.Figure: Interactive heatmap
    """
    print("\n6. Creating regional similarity heatmap...")

    # Create ingredient-region matrix
    ingredient_matrix = regional_ingredients.pivot_table(
        index='region',
        columns='ingredient',
        values='usage_count',
        fill_value=0
    )

    # Normalize (TF-IDF style)
    ingredient_matrix_normalized = (
        ingredient_matrix.div(ingredient_matrix.sum(axis=1), axis=0)
    )

    # Compute cosine similarity between all region pairs
    similarity_matrix = cosine_similarity(ingredient_matrix_normalized)
    similarity_df = pd.DataFrame(
        similarity_matrix,
        index=ingredient_matrix.index,
        columns=ingredient_matrix.index
    )

    # Define macro-region groupings for ordering
    macroregion_order = {
        'North': ['Lombardia', 'Piemonte', 'Veneto', 'Emilia Romagna', 'Liguria',
                  'Trentino Alto Adige', 'Friuli Venezia Giulia', "Valle d'Aosta"],
        'Center': ['Toscana', 'Lazio', 'Marche', 'Umbria'],
        'South': ['Campania', 'Puglia', 'Calabria', 'Abruzzo', 'Molise', 'Basilicata'],
        'Islands': ['Sicilia', 'Sardegna']
    }

    # Flatten to ordered list (filter to only existing regions)
    ordered_regions = [
        r for macro in macroregion_order.values()
        for r in macro
        if r in similarity_df.index
    ]

    # Reorder similarity matrix by macro-region grouping
    similarity_reordered = similarity_df.loc[ordered_regions, ordered_regions]

    # Create heatmap
    fig = go.Figure(data=go.Heatmap(
        z=similarity_reordered.values,
        x=similarity_reordered.columns,
        y=similarity_reordered.index,
        colorscale='RdYlBu_r',  # Red = similar, Blue = different
        zmid=0.5,               # Center at medium similarity
        zmin=0,
        zmax=1,
        colorbar=dict(title='Cosine<br>Similarity'),
        hovertemplate='%{y} ↔ %{x}<br>Similarity: %{z:.2f}<extra></extra>'
    ))

    # Add macro-region separator lines
    # Boundaries at: North(8), Center(12), South(18)
    boundaries = [8, 12, 18]
    for boundary in boundaries:
        fig.add_hline(y=boundary - 0.5, line_color='white', line_width=3)
        fig.add_vline(x=boundary - 0.5, line_color='white', line_width=3)

    # Update layout
    fig.update_layout(
        title='Regional Culinary Similarity (Cosine Similarity)<br><sub>Grouped by Macro-Region</sub>',
        xaxis_title='',
        yaxis_title='',
        height=700,
        width=800,
        paper_bgcolor='rgba(0,0,0,0)',
        xaxis=dict(tickangle=-45),
        yaxis=dict(autorange='reversed')  # Top-left origin
    )

    return fig


# ==============================================================================
# MAIN EXECUTION
# ==============================================================================

def main():
    """
    Main execution function.

    Loads data, generates all visualizations, and exports as JSON files.
    """
    print("="*70)
    print("ITALIAN CUISINE PLOTLY FIGURE GENERATION")
    print("="*70)

    # Load all data files
    ingredient_stats, regional_ingredients, category_stats, italy_gdf = load_data()

    # Generate all visualizations
    figures = {
        'olive-oil-butter-divide.json': create_oil_butter_diverging_choropleth(
            italy_gdf, regional_ingredients
        ),
        'tomato-usage.json': create_tomato_choropleth(
            italy_gdf, regional_ingredients
        ),
        'cheese-usage.json': create_cheese_choropleth(
            italy_gdf, regional_ingredients
        ),
        'seafood-usage.json': create_seafood_choropleth(
            italy_gdf, regional_ingredients
        ),
        'pasta-rice-polenta-triangle.json': create_pasta_rice_polenta_ternary_map(
            italy_gdf, regional_ingredients
        ),
        'pca-regional-clustering.json': create_pca_clustering_scatter(
            regional_ingredients
        ),
        'ingredient-evolution.json': create_ingredient_evolution_bar(
            ingredient_stats
        ),
        'category-evolution.json': create_category_evolution_stacked(
            category_stats
        ),
        'regional-similarity-heatmap.json': create_regional_similarity_heatmap(
            regional_ingredients
        )
    }

    # Export all figures
    print("\n" + "="*70)
    print("EXPORTING FIGURES")
    print("="*70)

    for filename, fig in figures.items():
        export_figure(fig, filename)

    # Some retained legacy maps are not regenerated above. Credit every JSON
    # artifact that embeds the same Istat-derived boundary geometry.
    credit_all_geometry_artifacts()

    # Print summary
    print("\n" + "="*70)
    print("ALL FIGURES GENERATED SUCCESSFULLY!")
    print("="*70)
    print(f"\nOutput directory: {OUTPUT_DIR.resolve()}")
    print(f"\nGenerated files:")

    total_size = 0
    for json_file in sorted(OUTPUT_DIR.glob('*.json')):
        size_kb = json_file.stat().st_size / 1024
        total_size += size_kb
        print(f"  ✓ {json_file.name} ({size_kb:.1f} KB)")

    print(f"\nTotal size: {total_size:.1f} KB")
    print("\nReady to embed in blog posts and project pages using:")
    print("  ```plotly")
    print("  {% include_relative ../assets/plotly/italian-cuisine/FILENAME.json %}")
    print("  ```")
    print("\n" + "="*70)


if __name__ == '__main__':
    main()
