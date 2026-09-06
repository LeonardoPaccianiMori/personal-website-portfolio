---
layout: post
title: When CTGAN failed to preserve the correlations that mattered
date: 2025-05-15 09:45:00
description: "A practical synthetic-data decision from an Italian real-estate project: preserving geographic and price correlations mattered more than matching marginal distributions."
tags: machine-learning synthetic-data algorithms
categories: [technical-notes]
technical_kind: note
featured: true
last_updated: 2026-09-07
project_slug: italian-real-estate
reading_minutes: 4
---

The CTGAN output looked plausible: prices and surface areas stayed within sensible ranges, and categories appeared in roughly the expected proportions. But location-dependent prices were badly distorted. For the [real-estate dashboard](/projects/italian-real-estate/), that relationship mattered more than the appearance of individual columns.

I had chosen [CTGAN](https://docs.sdv.dev/sdv/single-table-data/modeling/synthesizers/ctgansynthesizer) because it was designed for tabular data and was straightforward to try. The question was whether its output preserved the relationships the later model and dashboard would use.

## Choosing what to check

The downstream questions involved rent, purchase price, and geography. I therefore checked relationships between fields, including location and price, surface area and price, and the price premium associated with Milan.

The tested CTGAN output preserved the surface–price relationship much more closely than the location-dependent price structure. That difference was enough to reject it for this study: the dashboard depended on comparing places.

## The validation that changed the decision

I compared three relationships in the real and synthetic data. The reported location–price R² used raw latitude and longitude as a project-specific diagnostic. It compressed a complex spatial relationship into one number, so it was useful for comparing these outputs but not a complete measure of geographic fidelity. I also reported the relationship between surface and price and the price premium associated with Milan.

The location comparison was enough to reject the tested CTGAN output for this study. I then built a custom K-nearest-neighbors generator and repeated the diagnostics:

| Reported metric     | Real data | CTGAN | Custom KNN |
| ------------------- | --------: | ----: | ---------: |
| Location → price R² |      0.62 |  0.03 |       0.58 |
| Surface → price R²  |      0.71 |  0.69 |       0.70 |
| Milan price premium |      +45% |   +2% |       +42% |

<br>

These are historical results for the CTGAN configuration I tested, not a general benchmark for the method. The public repository does not retain the evaluation script, generated datasets, or a versioned result artifact reproducing these exact figures.

## Building local structure into the generator

The alternative used local interpolation rather than training another generative model. For each synthetic record, the original implementation:

1. selected an anchor listing from the source data;
2. found its five nearest neighbors using price, surface, latitude, and longitude;
3. blended numerical features using weights derived inversely from the distance scores; and
4. selected categorical values through weighted voting.

This made preservation of local price and geographic structure part of the construction of the dataset. TensorFlow-based distance calculations allowed me to generate approximately one million records without making the custom approach impractically slow.

Price participated in neighbour selection, so preserving its local relationships was partly built into the method. The later rent model was evaluated on generated study data; that does not establish how it would perform on unseen source listings. The generator also received no formal privacy audit. Its output is an analytical transformation, not certified anonymization, and the row-level synthetic dataset is not distributed.

## What this comparison supports

The comparison changed which data I used for the study. Local interpolation better retained the measured relationships, while the original checks exposed a problem that plausible individual columns had hidden.

The procedure above describes the original experiment. The later public release does not reproduce its original neighbour selection, so this historical comparison cannot be rerun from the published artifacts alone.

For the project context, start with the [real estate project page](/projects/italian-real-estate/). The [technical deep dive](/blog/2025/italian-real-estate-deep-dive/) has the full pipeline and modeling details.
