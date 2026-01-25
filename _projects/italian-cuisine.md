---
layout: page
title: Italian Cuisine
description: Understanding the historical evolution and geographical diversity of italian cuisine with Data Science
img: assets/img/projects/italian-cuisine/italian-cuisine.jpg
importance: 1
category: portfolio
chart:
  plotly: true
vis_network: true
---

<div class="row">
    <div class="col-sm mt-3 mt-md-0">
        {% include figure.liquid loading="eager" path="assets/img/projects/italian-cuisine/italian-cuisine.jpg" title="Italian regional cuisine" class="img-fluid rounded z-depth-1" %}
    </div>
</div>
<div class="caption">
    <a href="https://pxhere.com/en/photo/1000518">Image source</a>
</div>

**October - November 2025**

## Intro
Italian cuisine is globally famous and loved, so much so that it was [recognized by Unesco](https://ich.unesco.org/en/decisions/20.COM/7.B.27) as an Intangible Cultural Heritage of Humanity in December 2025, shortly after I finished working on this project.

One defining characteristic of italian cuisine is its diversity: each of the twenty [italian regions](https://en.wikipedia.org/wiki/Regions_of_Italy) has its own traditions, unique ingredients, techniques and flavors, shaped by geography and history; a recipe from Sicily tastes nothing like one from Tuscany. In this project, I built from scratch two datasets from two different sources: a historical one (Pellegrino Artusi's *"La Scienza in cucina e l'arte di mangiar bene"* or *Science in the Kitchen and the Art of Eating Well"*, a book from the late 19th century) and a more contemporary one (Italian Academy of Cuisine).

This allowed me to study italian cuisine over both time and geography: by analyzing the data, I was able to see how italian cuisine has evolved from the late 19th century to today, but also how today's cuisine is geographically diverse.

The two databases I built store recipes as [graphs](https://en.wikipedia.org/wiki/Graph_(discrete_mathematics)) (networks of relationships between ingredients, cooking steps, and techniques). This allowed me to retain the maximum amount of information possible for each recipe by storing its entire **structure** (i.e., not only which ingredients and tools are used, but also how each is processed and in what order).

This also allowed me to use [Graph Neural Networks](https://en.wikipedia.org/wiki/Graph_neural_network) to see if we can use ML to distinguish recipes from different areas of Italy.

#### Main findings in a nutshell
- There have been *significant* changes in italian cuisine from the late 19th century to today, particularly in terms of ingredients used (e.g., olive oil has become more common and butter has become less frequent)
- In temporary italian cuisine there are *a lot* of interesting geographical patters, with a distinct North-South divide clear across the data
- Within contemporary cuisine, it is *much* easier to distinguish recipes across *macro-regions* (North, Center, South, Islands) instead of single *regions*. This is a direct consequence of Italian history, and the fact that the cultural aspects that historically influenced cuisine trascended contemporary regional boundaries (e.g., Southern Italy was under a unified rule for *centuries* before the unification of Italy)

---

## Technologies Used

| **Area** | **Tools** |
|----------|-----------|
| Graph Database | Neo4j, Cypher |
| Data Extraction | Gemini 2.5 Pro |
| Data Processing | Python, Pandas |
| Deep Learning | PyTorch, PyTorch Geometric |
| GNN Architecture | GAT (Graph Attention Networks) |
| Visualization | Plotly, Matplotlib |
| Infrastructure | Neo4j Docker, CUDA (GPU training) |

---

## Historical Context

In 1891, barely 30 years after Italy had been united under a unique kingdom, italian businessman and writer Pellegrino Artusi published *"La Scienza in cucina e l'arte di mangiar bene"*, a collection of 790 recipes. The historical and cultural relevance of this book has been substantial: this was more than just a collection of recipes, but a **national identity-building project**, aimed at creating a shared Italian identity for the new country through food[^1].

Even though the book contains recipe from all over Italy, Tuscany and Emilia-Romagna have a central place in this collection of recipes. This is mostly due to the fact that these were the regions that Artusi knew best (he was from Emilia-Romagna, but lived in Florence most of his life). The centrality of Tuscany in Artusi's new "standard italian cuisine" coincidentially reflected the centrality of the Tuscanian language in the building of modern italian: a few decades earlier, writer Alessandro Manzoni used Florence's dialect as the base on which to build *modern* standard italian[^2].

Today's "Italian cuisine" emerged **beyond** Artusi: southern foods achieved global recognition through emigration, economic development, and cultural shifts during the 20th century.

The modern dataset (2,599 recipes from the Italian Academy of Cuisine) includes the full geographic spectrum Artusi excluded, and my analysis reveals genuine geographic patterns that transcend Artusi's project.

---

## What I Built

### Data Collection
I assembled **two complementary datasets**:

1. **Historical baseline**: Pellegrino Artusi's 1891 cookbook
   - 790 recipes (mostly from Central/Northern Italy)
   - Represents late 19th-century Italian cooking

2. **Modern recipes**: 2,599 traditional regional recipes
   - Covers all 20 Italian regions
   - Represents contemporary regional cuisine

In both datasets, recipes are represented by **graphs**:
<div
  class="neo4j-graph"
  data-neo4j-graph
  data-graph-src="{{ '/assets/data/italian-cuisine/recipe-76-example-graph.json' | relative_url }}"
>
  <div class="neo4j-graph__canvas" data-neo4j-graph-canvas></div>
  <div class="neo4j-graph__panel" data-neo4j-graph-panel>
    <div class="neo4j-graph__panel-title" data-neo4j-graph-title>Graph details</div>
    <div class="neo4j-graph__panel-body" data-neo4j-graph-body>
      Zoom in for more detail. Click a node or relationship to inspect metadata. Drag nodes to rearrange the graph.
    </div>
  </div>
</div>
<div class="caption">
  Graph representation of recipe #76 from Artusi's book (mushroom risotto). Zoom in for more detail, drag around the nodes,
  and hover or click on a node or relationship to show its metadata.
</div>
This allows us to retain the entire recipe's **structure** and not lose fundamental information (e.g., the order of preparation steps).

### Data Extraction
Both datasets are purely text-based, so they contain completely unstructured. The data was extracted in graph (i.e., structured) form as follows:
- I isolated recipes from each collection
- I used Gemini 2.5 Pro to transform each recipe inro a JSON file following a precise schema
- I normalized terms in the JSON files (e.g., ingredients and tools name) to avoid for example having different but similar expressions for the same ingredients, like "garlic clove" and "garlic *cloves*" (the amounts of each ingredients are stored in the graphs)
- I loaded the JSON files into a local instance of Neo4j

I also aggregated data from this Neo4j database to facilitate the analysis for this project.

Here are the prompts used for Gemini 2.5 Pro (placeholders like `{recipe['id']}`, `{recipe['tile']}` or `{recipe['text']}` are filled by the code for each recipe):
<details markdown="1">
<summary><strong>Artusi extraction prompt</strong></summary>
{%raw%}
```text
You are parsing recipe #{recipe['id']} from Pellegrino Artusi's 19th-century Italian cookbook "La scienza in cucina e l'arte di mangiar bene".

Recipe #{recipe['id']}: {recipe['title']}
Category: {recipe['category']}

Recipe Text:
{recipe['text']}

Parse this recipe and return ONLY a valid JSON object (no markdown, no explanation) with this exact structure:
{
    "name": "Recipe name in English (keep specific Italian terms like 'ossobuco', 'risotto' if no clear translation)",
    "ingredients": [
        {
            "name": "ingredient name in English (lowercase, singular)",
            "quantity": "numeric value, range like '1-2', or 'to taste'",
            "unit": "metric unit - MUST convert old units: bicchiere→200ml, cucchiaino→5ml, cucchiaio/cucchiaiata→15ml, libbra→340g, mestolo/ramaiuolo→100ml, tazza→250ml, oncia→28g,
dito→2cm, dramma→3.5g",
            "notes": "preparation notes if any"
        }
    ],
    "tools": ["list of ALL cooking tools/equipment mentioned, lowercase: pot, pan, oven, knife, whisk, mold, sieve, mortar, etc."],
    "steps": [
        {
            "action": "single cooking verb (chop, boil, mix, sauté, bake, fry, combine, etc.)",
            "instruction": "detailed step in English",
            "duration_minutes": numeric value if time specified (null otherwise),
            "temperature_celsius": numeric value if temp specified (null otherwise),
            "inputs": ["what goes INTO this step - raw ingredients OR intermediate products from previous steps like 'chopped_onions', 'the_mixture', 'cooked_pasta'"],
            "outputs": ["what comes OUT - intermediate products like 'roux', 'the_sauce', 'cooked_meat' OR the final dish name"],
            "ingredients_used": ["raw ingredients used in THIS step"],
            "tools_used": ["tools used in THIS step"]
        }
    ],
    "comment": "VERY brief summary (1-2 sentences max) if recipe has cultural/historical notes or comments, otherwise null",
    "referenced_recipes": [list of recipe numbers if this recipe cites others - look for 'n. 123', 'vedi n. 456', 'ricetta 789', etc.],
    "servings": number if mentioned (null otherwise - if range like 4-5, use minimum value 4),
    "prep_time_minutes": number if mentioned (null otherwise - if range like 10-15, use minimum value 10),
    "cook_time_minutes": number if mentioned (null otherwise - if range like 30-45, use minimum value 30)
}

CRITICAL JSON FORMATTING RULES:
- servings, prep_time_minutes, cook_time_minutes MUST be either a single number or null
- If you see a range (e.g., "4-5 servings"), use the MINIMUM value (4)
- All strings must be properly quoted
- All field names must be in double quotes

CRITICAL RULES:
1. Extract EVERY ingredient mentioned, even if not in a formal list
2. Convert ALL measurements to metric (grams, ml, pieces, cm)
3. Identify ALL tools (pentola=pot, cazzaruola=pan, tegame=pan, forno=oven, gratella=grill, mortaio=mortar, etc.)
4. Break instructions into clear sequential steps
5. Extract recipe references carefully (pattern: "n. NUMBER" or "vedi n. NUMBER" or "ricetta NUMBER")
6. Translate 19th-century terms: "diaccia"=cold/ice-cold, "adagino"=slowly, "schiumare"=skim, etc.
7. Keep Italian terms ONLY when no clear English equivalent exists
8. Be thorough - this is for a data science portfolio analyzing Italian cuisine

Return ONLY the JSON object, nothing else.
```
{%endraw%}
</details>

<details markdown="1">
<summary><strong>AIC extraction prompt</strong></summary>

{%raw%}
```text
You are parsing a recipe from the Italian Academy of Cuisine (Accademia Italiana della Cucina) database.

Recipe: {recipe['name']}
Region: {recipe['region']}
Category: {recipe['category']}
{city_line}

Ingredients:
{ingredients_text}

Procedure:
{recipe['procedure']}

Parse this recipe and return ONLY a valid JSON object (no markdown, no explanation) with this exact structure:
{
    "name": "Recipe name in English (keep specific Italian terms like 'ossobuco', 'risotto' if no clear translation)",
    "ingredients": [
        {
            "name": "ingredient name in English (lowercase, singular)",
            "quantity": "numeric value, range like '1-2', or 'to taste'",
            "unit": "metric unit - MUST convert: bicchiere→200ml, cucchiaino→5ml, cucchiaio→15ml, manciata→50g, pizzico→2g",
            "notes": "preparation notes if any"
        }
    ],
    "tools": ["list of ALL cooking tools/equipment mentioned, lowercase: pot, pan, oven, knife, whisk, etc."],
    "steps": [
        {
            "action": "single cooking verb (chop, boil, mix, sauté, bake, fry, combine, etc.)",
            "instruction": "detailed step in English",
            "duration_minutes": numeric value if time specified (null otherwise),
            "temperature_celsius": numeric value if temp specified (null otherwise),
            "inputs": ["what goes INTO this step - raw ingredients OR intermediate products from previous steps like 'chopped_onions', 'the_mixture', 'cooked_pasta'"],
            "outputs": ["what comes OUT - intermediate products like 'roux', 'the_sauce', 'cooked_meat' OR the final dish name"],
            "ingredients_used": ["ingredients used in THIS step"],
            "tools_used": ["tools used in THIS step"]
        }
    ],
    "comment": "VERY brief summary (1-2 sentences max) if recipe has cultural/historical notes or comments, otherwise null",
    "servings": number if mentioned (null otherwise - if range like 4-5, use minimum value 4),
    "prep_time_minutes": number if mentioned (null otherwise - if range, use minimum),
    "cook_time_minutes": number if mentioned (null otherwise - if range, use minimum)
}

CRITICAL RULES:
1. Extract servings from the FIRST ingredient (often says "Ingredienti per X persone") - do NOT include this as an ingredient
2. Convert ALL measurements to metric (grams, ml, pieces)
3. Identify ALL tools mentioned in the procedure
4. Break procedure into clear sequential steps
5. Keep Italian culinary terms when no clear English equivalent exists
6. Use MINIMUM value from ranges (e.g., "4-5" → 4)
7. All strings must be properly quoted
8. servings, prep_time_minutes, cook_time_minutes MUST be either a single number or null

Return ONLY the JSON object, nothing else.
```
{%endraw%}
</details>
<br>

### Data Analysis
The collected data was analyzed in two ways:
- comparing Artusi's and AIC's datasets to evaluate how italian cuisine has evolved since the late 19th century
- analyzing AIC's dataset to identify interesting geographical patterns

A deep dive into the results of this analysis can be found [below](#the-results).
 
### Neo4j Graph Database

As already stated, instead of treating recipes as flat lists I modeled them as **graphs** in Neo4j in order to capture the structure of **relationships** that ingredient lists miss (e.g., *how* ingredients are used, *when* they're added, *which* techniques transform them). For example:

#### Nodes
- `Recipe`: contains metadata like name, category, servings
- `Ingredient`: normalized across recipes
- `Tool`: normalized across recipes
- `Step`: with the actual textual instructions
- `IntermediateProduct`: processed ingredients used in the following steps
Optional nodes:
- `City` (for AIC only): specifies the city the recipe is from, if this information is in the original recipe
- `Comment` (for both): additional comments for the recipe (e.g., Artusi often wrote anecdotes on how he came to know a given recipe, or gives advice on how to modify the recipe if necessary)

#### Relationships
- `(Recipe)-[HAS_STEP]->(Step)`
- `(Recipe)-[REQUIRES]->(Ingredient)`
- `(Recipe)-[NEEDS]->(Tool)`
- `(Step)-[USES_INGREDIENT]->(Ingredient)`
- `(Step)-[USES_TOOL]->(Tool)`
- `(Step)-[PRODUCES]->(IntermediateProduct)`
- `(IntermediateProduct)-[INPUT_TO]->(Step)`
- `(Recipe)-[HAS_COMMENT]->(Comment)`
- `(Recipe)-[INCLUDES_SUBRECIPE]->(Recipe)`
- `(Recipe)-[FROM_REGION]->(Region)`
- `(Recipe)-[CITY_STYLE]->(City)`
- `(Step)-[NEXT_STEP]->(Step)`

#### Notes
- `INCLUDES_SUBRECIPE` is found only in Artusi's data: several recipes in the book, in fact, mention other recipes as previous steps (e.g., a recipe for a specific type of ravioli might mention a separate recipe for the dough)
- `FROM_REGION` and `CITY_STYLE` are found only in AIC data


### Graph Neural Networks

When using ML to learn the differences between different geographical areas, I built a **heterogeneous Graph Attention Network** (GAT) that learns from the entire graph structure:

#### Architecture
- Multi-relational message passing between different node types
- Attention mechanisms weight important connections
- Hierarchical pooling aggregates graph-level representations
- Final classifier predicts regional origin

#### Three approaches tested
1. **Fine-grained (20 regions)**: Direct classification into all 20 Italian regions
2. **Macro-region (4 classes)**: Classification into geographic areas (North, Center, South, Islands)
3. **Hierarchical (two-level)**: First we predict the macro-region, then specific region within that area

---

## The Results

### Temporal Evolution
The biggest change in italian cuisine since the late 19th century has been with the ingredient usage frequency, with some ingredients (e.g., garlic, onion and parsley) becoming more common in contemporary cuisine, while others (like butter) becoming markedly less frequently used.

<details markdown="1">
<summary><strong>Deep dive</strong></summary>
The first thing we can to is to compare the two datasets with each other to understand how italian cuisine has evolved since the late 19th century (keeping in mind the fact that Artusi's book is somewhat geographically limited, while the modern dataset contains data from all 20 regions).

#### Recipe Complexity
For example, by looking at the distribution of numbers of steps/ingredients/tools per recipe we can see that there haven't been significant changes since the late 19th century:
```plotly
{% include plotly/italian-cuisine/recipe-complexity.json %}
```

#### Category Evolution
We can also look at the difference in the distribution of recipe categories (i.e., appetizers, pasta, desserts etc.) between the two datasets:
```plotly
{% include plotly/italian-cuisine/category-evolution.json %}
```

There are definitely interesting differences. The most striking is the absense of "Pizzas and savory pies" from Artusi's dataset. In Artusi's book there are in fact only **three** recipes that contain the name "pizza", and they are all *desserts*. This is because at the end of the 19th century the word "pizza" in standard italian meant something different compared to today: it was used for any kind of baked pie (both sweet and savory). The "pizza" as we know it today (i.e., neapolitan pizza) at the time was only a regional southern dish, and was not part of the national culinary canon that Artusi was trying to codify with his book. It was eaten mostly by poor people using leftover ingredients that would have otherwise be wasted.

##### Small Digression on the Word "Pizza"
It is very interesting to see how the word "pizza" drastically changed meaning in italian cuisine. The etymology of the word "pizza" is still debated, but there is a whole family of similar words across the Mediterranean that clearly mean some kind of flat, baked product:
- *πίτα* (pita) in Greece
- *pide* in Turkey
- *pite* in Albania
- *pita* also in many other balkan countries
In all cases these are either flat breads or quiches.

Historically, the first mention of "pizza" (meant more generally as bread or baked product) appears in a document written in latin from 997 CE from Gaeta, Lazio.

#### Ingredient Evolution
Let's look at the evolution of ingredient frequency over time:
```plotly
{% include plotly/italian-cuisine/top-ingredients-scatter.json %}
```
There's definitely a few interesting trends:
- In modern italian cuisine there is a *sharp* increase in the use of olive oil, marked by a concurrent decrease in the use of butter
- Salt also seems to be more mentioned in modern recipes
- Garlic, onion and parsley (staples of modern italian cuisine) seem to not have been as frequently used in the past
- The use of chili peppers is basically *completely absent* in Artusi's book (it appears only *once* in the whole book, for the recipe of Cacciucco). This is due to the fact that chili peppers are abundantly used in Southern Italy but not in Northern and Central Italy

We can also look at which ingredients have disappeared from the "historical" cuisine and which have appeared in the modern one:
```plotly
{% include plotly/italian-cuisine/new-vs-disappeared-ingredients.json %}
```
We can see how some markedly southern ingredients like tomato have made their appearance in the modern dataset (again, likely because Artusi's book was more centered in Central and Northern Italy's recipes), while lardon (not lard!) for example seems to have disappeared.

</details>
<br>

### Geographical Diversity
When looking at contemporary cuisine across region, a clear North-South divide appears in the usage of many of the most common ingredients (olive oil/butter, tomato, cheese etc.). This divide is also clear in the usage of different starches, with the North preferring rice and polenta while the Center and South using pasta more commonly.

<details markdown="1">
<summary><strong>Deep dive</strong></summary>

#### Data Distribution
Beyond temporal evolution, we can use the AIC data to look at the following general geographic patterns in the data:
- recipe abundance (i.e., how many recipes there are in the database per region)
- recipe complexity (i.e., average number of steps per recipe per region)
- recipe variety (i.e., average number of ingredients per recipe per region)
- ingredient variety (i.e., total number of unique ingredients per region)
- recipe size (i.e., average number of servings per recipe per region)
```plotly
{% include plotly/italian-cuisine/regional-characteristics-choropleth.json %}
```

#### Signature Regional Ingredients
We can also perform a TF-IDF analysis to determine each region's signature ingredients:
```plotly
{% include plotly/italian-cuisine/regional-signature-ingredients-map.json %}
```
```plotly
{% include plotly/italian-cuisine/regional-signature-ingredients-bar.json %}
```
Despite being an extremely simple approach, it really captures the characteristic ingredients for each region

We can also look at the distribution of the usage frequency for the 10 most common ingredients:
```plotly
{% include plotly/italian-cuisine/ingredient-usage-choropleth.json %}
```
This map shows several interesting geographical patterns that we will look at in more detail below.

#### Regional Similarity Analysis
In order to better understand the relationships between regional cuisines, we can compute how *similar* they are to each other in terms of ingredients used. If we take the matrix showing the usage of ALL ingredients across ALL regions, and compute the cosine similarity between regions:
```plotly
{% include plotly/italian-cuisine/regional-similarity-choropleth.json %}
```
The same data plotted as a heatmap immediately shows interesting patterns:
```plotly
{% include plotly/italian-cuisine/regional-similarity-heatmap-macro.json %}
```
We can immediately notice the folliwing things:
- regions within the same macroregion are generally more similar to each other
- regions belonging to different macroregions are less similar to each other
- Valle d'Aosta is a *striking outlier*, being less similar to the other northern italian regions and completely different from the other regions. This is not entirely surprising: Valle d'Aosta is a highly mountainous region, and culturally very "isolated" from Italy and closer to France
- Liguria is also striking: despite being in Northern Italy its cuisine is more similar to Central/Southern Italy

Similar conclusions can be reached if we perform hierarchical clustering on the data:
{% include figure.liquid loading="lazy" path="assets/img/projects/italian-cuisine/italian-cuisine-hierarchical-clustering.png" title="Hierarchical Clustering of Italian Regional Cuisines" class="img-fluid rounded z-depth-1" %}

##### The Olive Oil vs Butter Line

The most striking geographic divide in the data is withot doubt the **oil-butter line**:

```plotly
{% include plotly/italian-cuisine/olive-oil-butter-divide.json %}
```

<div class="caption">
    Diverging choropleth map showing fat preference by region: green = olive oil dominant, red = butter dominant. Hover for details, zoom/pan to explore.
</div>

This is a fundamental agricultural/climatic divide that the GNN learns to recognize: historically, Central and Southern Italy has had a more favorable climate for growing olive trees, while in Northern Italy cattle farming has been more prominent, leading to a higher usage of butter.

##### The Tomato Gradient
Tomato usage increases as you move south:

```plotly
{% include plotly/italian-cuisine/tomato-usage.json %}
```

<div class="caption">
    Tomato usage intensity across regions. Southern regions show dramatically higher usage due to Mediterranean climate and historical Arab/Spanish influence.
</div>

Mediterranean climate and Spanish/Arab influences in the South made tomatoes central to cuisine, while Northern regions adopted them more slowly.

##### Cheese and Seafood Patterns
Two more ingredient patterns reveal regional specialization:

```plotly
{% include plotly/italian-cuisine/cheese-usage.json %}
```

<div class="caption">
    Cheese usage across regions. Note: This shows cheese used in recipes, <i>not</i> the diversity of cheese production.
</div>

```plotly
{% include plotly/italian-cuisine/seafood-usage.json %}
```

<div class="caption">
    Seafood usage clearly follows Italy's coastline, with landlocked regions showing minimal usage.
</div>

We can see how Emilia-Romagna, Lombardy and Campania lead in the usage of cheese (they are, respectively, the regions of origin of Parmigiano, Gorgonzola and Mozzarella).

For seafood, we see that (unsurprisingly) coastal regions dominate, while Alpine regions use almost none.lmost none


##### The Starch Triangle
Different regions favor different starches (pasta, rice, polenta), but again a North-South divide is visible:

```plotly
{% include plotly/italian-cuisine/pasta-rice-polenta-triangle.json %}
```

<div class="caption">
    RGB ternary visualization: Red = Pasta, Green = Rice, Blue = Polenta. Each region colored by proportional usage. Hover to see exact percentages.
</div>

While some regions have one clear preference for a single starch (e.g., Trentino-Alto Adige primarily using polenta, or Puglia using almost exclusively pasta), there are also regions where a more mixed approached is used for starch usage (e.g., Sardinia, and less markedly Tuscany).
</details>
<br>

### ML Classification
The highest F1-score (60%) is reached when classifying recipes across *macro-regions*, not regions (where the F1-score does not go significantly above 20%). The more fine-grained regional model is also cursed by overfitting, since the F1-score drops from ~80% in the train split to ~20% in the test split.

#### Why macro-regions win
- **More data per class**: we have 200-400 recipes per macro-region vs 50-150 per individual region
- **Clearer boundaries**: Geographic and historical factors create more cohesive culinary traditions within macro-regions, instead of within single regions
- **Less confusion**: Neighboring regions share ingredients, while macro-regions don't

#### Per-macro-region performance
The predictive performance is not uniform across macro-regions:
- **North**: 81% F1-score (excellent); uses several distinctive ingredients like rice and butter
- **Islands**: 52% F1-score (good); geographic isolation preserved unique traditions
- **South**: 44% F1-score (moderate); some overlap/confusion with Center
- **Center**: 35% F1-score (challenging); the Center has traditionally been an area of transition between North and South, so its cuisine has aspects of both 

<details markdown="1">
<summary><strong>Deep dive</strong></summary>

#### What the model learned: regional clustering
PCA visualization reveals the model learns genuine geographic patterns:

```plotly
{% include plotly/italian-cuisine/pca-regional-clustering.json %}
```

<div class="caption">
    PCA projection of recipe embeddings colored by macro-region. Clear clustering shows the model learns geographic patterns, not random correlations. Hover to see region names.
</div>

#### Key observations
- **North** (red) forms a tight cluster, a sign of homogeneous culinary traditions
- **Islands** (yellow) are well-separated, a consequence of geographic isolation
- **South** (green) and **Center** (blue) overlap, as these cuisines share elements
- **Liguria**, despite belonging to Northern Italy, has a cuisine more similar to Central-Southern Italy
- Clustering follows **geography**, not administrative boundaries
</details>

---

## What I Learned

### 1. LLMs are *Great* at Extracting Unstructured Data

LLMs (like Gemini 2.5 Pro used here) are *phenomenal* tools when extraction of text-based unstructured data into structured data is needed. They of course need to be properly prompted, and the results need to be verified for accuracy of content and form, but they make this type of data extraction **incredibly** easier.

### 2. Graph Structure Matters

Traditional recipe ML projects use bag-of-ingredients or text embeddings. By modeling recipes as **graphs**, the GNN learns:
- **Ingredient combinations**: which ingredients commonly appear together
- **Cooking sequences**: order of operations matters (sauté onions *before* adding tomatoes)
- **Technique-ingredient associations**: frying vs boiling transforms ingredients differently

The attention mechanism weights important relationships: the model learns that *risotto* (rice + broth + butter) is a Northern signature, while *pasta* + *tomato* + *chili* signals Southern cuisine.

### 3. Model Complexity Does Not Make Up for Bad Data Quality

With the region-based model, I tried:
- Deeper networks (more GAT layers)
- Different architectures (hierarchical, multi-task learning)
- Hyperparameter tuning (learning rates, dropout, batch sizes)

**None of it helped** overcome the overfitting issue. The problem, therefore, is that **the data is not enough**.

### 4. Geographic Patterns Are Real

The macro-region classifier's 60% F1-score reflects genuine culinary geography:

**North** (81% F1):
- **Signatures**: Rice, butter, cream, polenta
- **History**: Alpine influence, dairy farming, rice paddies (Po Valley)

**Islands** (52% F1):
- **Signatures**: Seafood, capers, almonds, citrus
- **History**: Geographic isolation, Arab/Greek influences

**South** (44% F1):
- **Signatures**: Tomatoes, olive oil, chili, seafood
- **History**: Mediterranean climate, Greek/Spanish influences

**Center** (35% F1):
- **Signatures**: Olive oil, pork, beans, bread
- **History**: Transitional zone, mix of North/South elements

The model struggles with Center because it's a **culinary transition zone**: recipes there blend Northern and Southern elements.

---

## View the Code

All code for this project is available on [GitHub](https://github.com/LeonardoPaccianiMori/portfolio-italian-cuisine).

**Note**: This project's code was originally written by my and later reorganized in January 2026 using Codex 5.2, in order to make it tidier and better organized.

---

## Footnotes
[^1]: Keep in mind that at the time of unification, what is now considered "standard italian" was only a written and literary language that was used daily as a spoken language only by the educated minority (aristocrats, urban middle class, clergy, bureaucrats, teachers, lawyers etc.): the general population spoke their [regional language](https://en.wikipedia.org/wiki/Languages_of_Italy), nowadays improperly called *dialects*: these are languages that evolved *independently* from latin (their common ancestor), and *not* from standard italian itself (as would be the case with *proper* dialects). These languages are not mutually intelligible: for example, the sicilian language is strongly influenced by spanish and arabic (due to *centuries* of arab and spanish dominion over the island), while the piedmontese language is strongly influenced by french (due to historical and cultural proximity with France). Therefore, at the time of unification the majority of people from different parts of Italy would *not* have been able to understand each other. Thus, Artusi wrote his book also as a way to create a shared national identity through cuisine (since the educated minority would still have their own regional cultures and cuisines).

[^2]: Italy is one of just a few European countries, another notable example being Germany, whose standard language does *not* come from the capital's dialect. Note how both Italy and Germany have had a history of being divided into smaller countries or city-states for *centuries* before being unified in the 19th century (contrarily to, for example, France, Spain, or the UK, which have existed as a unitary entity for *centuries*).
