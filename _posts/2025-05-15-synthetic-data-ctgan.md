---
layout: post
title: Why I Replaced CTGAN with a Custom Synthetic Data Generator
date: 2025-05-15 09:00:00
description: The decision to abandon an off-the-shelf tabular generator when it failed on the correlations that actually mattered
tags: machine-learning synthetic-data algorithms
categories: [data-science, learning]
featured: true
---

For the [Italian real estate project](/projects/italian-real-estate/), I needed a public-facing dataset that preserved the useful structure of the original scraped listings without exposing the listings themselves.

The obvious candidate was CTGAN. On paper it looked like the right answer:

- purpose-built for tabular data
- widely used
- easy to train
- good at reproducing distributions

If the project had stopped at histograms, CTGAN would have looked successful.

## The Problem Was Not Distribution Shape

My real constraint was not "make fake data that looks plausible row by row." It was "preserve the relationships that make the later model and dashboard meaningful."

In real estate, that means things like:

- location and price
- surface area and price
- neighborhood context and rent
- property type and geography

CTGAN reproduced the marginal distributions reasonably well. Prices looked like prices. Surface areas looked like surface areas. Categories appeared in roughly the right proportions.

But the relationship between **where** a property was and **what it cost** degraded badly.

That was a dealbreaker, because the downstream model relied on exactly those correlations.

## The Validation That Changed the Decision

The check that mattered was simple: measure whether location could still explain price in the synthetic data.

| Metric | Real Data | CTGAN | Custom KNN |
|--------|-----------|-------|------------|
| Location ↔ Price R² | 0.62 | 0.03 | 0.58 |
| Surface ↔ Price R² | 0.71 | 0.69 | 0.70 |
| Milan price premium | +45% | +2% | +42% |

Those numbers made the decision for me. CTGAN had learned the ingredients of the market, but not the structure of it.

## The Simpler Alternative Was Better

I switched to a custom K-nearest-neighbors generator built around a simple idea: if the point of synthetic data is to preserve local market structure, then synthetic listings should be built from **nearby real listings in feature space**.

For each synthetic record, I would:

1. pick an anchor point
2. find nearby real listings using price, surface, latitude, and longitude
3. blend numerical features by weighted average
4. choose categorical features by weighted voting
5. sample boolean features probabilistically from the same neighborhood

At that point the method stopped being glamorous and started being useful.

```python
weights = {
    "price": 0.25,
    "surface": 0.25,
    "latitude": 0.25,
    "longitude": 0.25,
}
```

The important part was not the exact weighting scheme. It was that the generator preserved correlation by construction instead of hoping a generative model would infer it robustly from scratch.

## Why I Was Willing to Accept the Tradeoff

The custom method was slower and less elegant from a tooling point of view. CTGAN gives you a compact library interface and fast generation once training is done. My approach required more logic, more validation, and GPU acceleration to be practical at scale.

I was fine with that tradeoff because the project needed **credible synthetic data**, not merely convenient synthetic data.

That is the distinction I came away with:

- if the downstream use is exploratory, a generic generator may be enough
- if the downstream use depends on a few critical relationships, you should validate those first and optimize for them explicitly

## The Real Lesson

This post is not really about CTGAN. It is about refusing to let a good-looking tool define success for the project.

What saved me time in the end was not a better model. It was a better validation question.

For the project context, start with the [real estate project page](/projects/italian-real-estate/). The [technical deep dive](/blog/2025/italian-real-estate-deep-dive/) has the full pipeline and modeling details.
