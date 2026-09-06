---
layout: post
title: When CTGAN failed to preserve the correlations that mattered
date: 2025-05-15 09:45:00
description: "A practical synthetic-data decision from an Italian real-estate project: preserving geographic and price correlations mattered more than matching marginal distributions."
tags: machine-learning synthetic-data algorithms
categories: [technical-notes]
technical_kind: note
featured: true
last_updated: 2026-09-06
project_slug: italian-real-estate
reading_minutes: 4
---

The CTGAN output looked plausible: prices and surface areas stayed within sensible ranges, and categories appeared in roughly the expected proportions. But location-dependent prices were badly distorted. For the [real-estate dashboard](/projects/italian-real-estate/), that relationship mattered more than the appearance of individual columns.

I had chosen [CTGAN](https://docs.sdv.dev/sdv/single-table-data/modeling/synthesizers/ctgansynthesizer) because it was designed for tabular data and was straightforward to try. The question was whether its output preserved the relationships the later model and dashboard would use.

## The problem was not distribution shape

My actual constraint was to preserve the relationships that made the later model and dashboard meaningful. With real-estate data, those included relationships between:

- location and price
- surface area and price
- neighborhood context and rent
- property type and geography

In my original comparison, CTGAN preserved the surface–price relationship much more closely than the location-dependent price structure. That was a dealbreaker: a dataset that distorted the relationships used downstream would give the model and dashboard a misleading version of the market.

## The validation that changed the decision

I compared three relationships in the real and synthetic data. The reported location–price R² used raw latitude and longitude as a project-specific diagnostic. It compressed a complex spatial relationship into one number, so it was useful for comparing these outputs but not a complete measure of geographic fidelity. I also reported the relationship between surface and price and the price premium associated with Milan.

The location comparison was enough to reject the tested CTGAN output for this study. I then built a custom K-nearest-neighbors generator and repeated the diagnostics:

| Reported metric     | Real data | CTGAN | Custom KNN |
| ------------------- | --------: | ----: | ---------: |
| Location → price R² |      0.62 |  0.03 |       0.58 |
| Surface → price R²  |      0.71 |  0.69 |       0.70 |
| Milan price premium |      +45% |   +2% |       +42% |

<br>

These results describe the CTGAN configuration I tested, not a general limitation of CTGAN or a definitive explanation of its failure.

These figures were recorded during the original study. The public repository does not retain the evaluation script, generated datasets, or a versioned result artifact that reproduces the exact values. I therefore treat them as historical project results rather than reproducible benchmarks.

## Building local structure into the generator

The alternative used local interpolation rather than training another generative model. For each synthetic record, the original implementation:

1. selected an anchor listing from the source data;
2. found its five nearest neighbors using price, surface, latitude, and longitude;
3. blended numerical features using weights derived inversely from the distance scores; and
4. selected categorical values through weighted voting.

This made preservation of local price and geographic structure part of the construction of the dataset. TensorFlow-based distance calculations allowed me to generate approximately one million records without making the custom approach impractically slow.

There is an important boundary around that choice. Because price participated in neighbour selection and the method was built from local neighbourhoods in the source data, the generator was not independent evidence that the later rent model generalized to unseen source listings. It was also never subjected to a formal privacy audit. I treat its output as an analytical transformation, not as certified anonymization. The row-level synthetic dataset is not distributed; only aggregate study results remain public.

## What this comparison supports

For this project, local interpolation better retained the measured relationships. That was sufficient to choose a study dataset, but it did not validate the later rent model on unseen source listings.

The procedure above describes the original experiment. The later public release does not reproduce its original neighbour selection, and the historical comparison cannot be rerun from the published artifacts alone. The useful result is the diagnostic that changed the decision: matching individual columns was insufficient when the application depended on their relationships.

For the project context, start with the [real estate project page](/projects/italian-real-estate/). The [technical deep dive](/blog/2025/italian-real-estate-deep-dive/) has the full pipeline and modeling details.
