---
layout: post
title: When CTGAN failed to preserve the correlations that mattered
date: 2025-05-15 09:45:00
description: "A practical synthetic-data decision from an Italian real-estate project: preserving geographic and price correlations mattered more than matching marginal distributions."
tags: machine-learning synthetic-data algorithms
categories: [technical-notes]
technical_kind: note
last_updated: 2026-08-31
featured: true
---

For the [Italian real estate project](/projects/italian-real-estate/), I needed a public-facing dashboard that preserved useful aggregate structures and correlations without displaying source listings.

This constraint was central to the project because I wanted the dashboard to reflect patterns from the study without displaying or distributing the collected records.

The obvious choice was [CTGAN](https://docs.sdv.dev/sdv/single-table-data/modeling/synthesizers/ctgansynthesizer). On paper it looked well suited to the problem:

- purpose-built for tabular data
- widely used
- relatively easy to train
- good at reproducing distributions

The output initially looked plausible. Prices and surface areas stayed within sensible ranges, and categories appeared in roughly the expected proportions. But plausible individual columns were not enough for this project.

## The problem was not distribution shape

My actual constraint was to preserve the relationships that made the later model and dashboard meaningful. With real-estate data, those included relationships between:

- location and price
- surface area and price
- neighborhood context and rent
- property type and geography

In my original comparison, CTGAN preserved the surface–price relationship much more closely than the location-dependent price structure. That was a dealbreaker: a dataset that distorted the relationships used downstream would give the model and dashboard a misleading version of the market.

## The validation that changed the decision

I compared three relationships in the real and synthetic data. The reported location–price R² used raw latitude and longitude as a project-specific diagnostic. It compressed a complex spatial relationship into one number, so it was useful for comparing these outputs but not a complete measure of geographic fidelity. I also reported the relationship between surface and price and the price premium associated with Milan.

The first comparison isolated what CTGAN had and had not preserved:

| Reported metric     | Real data | CTGAN |
| ------------------- | --------: | ----: |
| Location → price R² |      0.62 |  0.03 |
| Surface → price R²  |      0.71 |  0.69 |
| Milan price premium |      +45% |   +2% |

<br>

These results describe the CTGAN configuration I tested on this dataset. They show that it did not preserve the location-dependent structure I needed; they do not establish a general limitation of CTGAN or a definitive cause for the failure.

I therefore built a custom K-nearest-neighbors generator and repeated the comparison:

| Reported metric     | Real data | CTGAN | Custom KNN |
| ------------------- | --------: | ----: | ---------: |
| Location → price R² |      0.62 |  0.03 |       0.58 |
| Surface → price R²  |      0.71 |  0.69 |       0.70 |
| Milan price premium |      +45% |   +2% |       +42% |

<br>

These figures were recorded during the original study. The public repository does not retain the evaluation script, generated datasets, or a versioned result artifact that reproduces the exact values. I therefore treat them as historical project results rather than reproducible benchmarks.

## The simpler alternative was better

The alternative used local interpolation rather than training another generative model. For each synthetic record, the original implementation:

1. selected an anchor listing from the source data;
2. found its five nearest neighbors using price, surface, latitude, and longitude;
3. blended numerical features using weights derived inversely from the distance scores; and
4. selected categorical values through weighted voting.

This made preservation of local price and geographic structure part of the construction of the dataset. TensorFlow-based distance calculations allowed me to generate approximately one million records without making the custom approach impractically slow.

There is an important boundary around that choice. Because price participated in neighbour selection and the method was built from local neighbourhoods in the source data, the generator was not independent evidence that the later rent model generalized to unseen source listings. It was also never subjected to a formal privacy audit. I treat its output as an analytical transformation, not as certified anonymization. The row-level synthetic dataset is not distributed; only aggregate study results remain public.

## The validation question mattered more than the model

The useful lesson was not that custom algorithms are inherently better than established libraries. CTGAN was a reasonable first choice, and a different configuration or dataset might have produced a different result. The mistake would have been allowing plausible marginal distributions to define success when the downstream application depended on specific relationships between features.

Once I tested the structure that mattered, the decision became straightforward: for this project, the simpler local method better preserved the relationships I needed. Choosing the validation question well mattered more than choosing the more sophisticated model.

For the project context, start with the [real estate project page](/projects/italian-real-estate/). The [technical deep dive](/blog/2025/italian-real-estate-deep-dive/) has the full pipeline and modeling details.
