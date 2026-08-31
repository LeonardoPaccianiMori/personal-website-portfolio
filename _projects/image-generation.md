---
layout: page
title: Teaching computers to create images
description: Comparing neural-network classifiers and generators on handwritten digits
img: assets/img/projects/image-generation/image-generation-thumbnail.png
importance: 1
category: experimental
github: https://github.com/LeonardoPaccianiMori/portfolio-image-generation
chart:
  plotly: true
project_overview:
  status: Completed
  period: November–December 2024
  role: Original project implementation followed by a Codex-assisted evidence audit
  outcome: CNN-2 reached 98.66% test accuracy; DCGAN-5 had the best result under the project-specific generator feature-distance comparison.
  evidence: Browser demo, code, and technical appendix; the generator metric is not canonical FID.
project_actions:
  - label: Try the generator
    url: "#dcgan-5"
    style: primary
    external: false
  - label: View code
    url: https://github.com/LeonardoPaccianiMori/portfolio-image-generation
    style: secondary
    external: true
  - label: Read technical appendix
    url: /blog/2025/image-generation-deep-dive/
    style: secondary
    external: false
---

<div class="row justify-content-sm-center">
  <div class="col-sm-6 mt-3 mt-md-0">
    {% include figure.liquid loading="eager" path="assets/img/projects/image-generation/image-generation-thumbnail.png" title="Generated digits" class="img-fluid rounded z-depth-1" %}
  </div>
</div>
<div class="caption">
  Handwritten digits created by DCGAN-5
</div>

## When more complexity helped—and when it did not

This project compared seven image classifiers and ten generative configurations on MNIST. The study asked when a more complex architecture produced a useful improvement, when it made training less stable, and what those differences looked like when the output could be inspected directly.

The experiments ran within the limits of one personal laptop. CNN-2 produced the strongest classifier result, and DCGAN-5 led the project-specific generator comparison. I exported DCGAN-5 so that it could run as an interactive demonstration in the browser.

## Seven classifiers, with different trade-offs

I used separate training, validation, and untouched test splits. CNN-2 achieved the strongest result, with 98.66% test accuracy. The smaller CNN-1 reached 98.05% while taking roughly half as much CPU training time.

Additional depth did not always help. Among the fully convolutional models, FCNN-3 reached 94.60%, while the deeper FCNN-4 fell to 78.90%. The failure was part of the result: architectural complexity did not remove the need for careful comparison.

For generation, I compared conditional variational autoencoders with deep convolutional GANs. Changes to activation and normalization had a strong effect on training stability. DCGAN-5 produced the best result under the feature-distance measure defined for this project.

## Choosing the generator

```plotly
{% include plotly/image-generation/dcgan-feature-distance-comparison.json %}
```

<div class="caption">
  Fréchet distance between 10,000 generated images and the official MNIST test split in CNN-3's 20-dimensional feature space. Lower is better within this project; this is not canonical FID.
</div>

DCGAN-5 reached a project-specific feature distance of 2.29, ahead of DCGAN-4 at 3.23. This measure supports comparison inside the experiment, but it is not canonical Fréchet inception distance.

## Try DCGAN-5

<div id="dcgan-5">
  <p>Generate handwritten digits in your browser. Select a digit, then create a new image.</p>
</div>

<div id="digit-generator" class="my-4 p-3 border rounded text-center">
  <div class="d-flex align-items-center justify-content-center gap-3 mb-3 flex-wrap">
    <label for="digit-select" class="mb-0">Select digit:</label>
    <select id="digit-select" class="form-select" style="width: auto;">
      <option value="0">0</option>
      <option value="1">1</option>
      <option value="2">2</option>
      <option value="3">3</option>
      <option value="4">4</option>
      <option value="5">5</option>
      <option value="6">6</option>
      <option value="7">7</option>
      <option value="8">8</option>
      <option value="9">9</option>
    </select>
    <button id="generate-btn" class="btn btn-primary">Generate</button>
    <button id="random-btn" class="btn btn-outline-secondary">Random</button>
  </div>
  <div id="loading-indicator" class="text-muted mb-2" style="display: none;">Loading model...</div>
  <canvas id="output-canvas" width="140" height="140" class="border rounded"></canvas>
  <div id="status-text" class="text-muted mt-2 small"></div>
</div>

<script src="https://cdn.jsdelivr.net/npm/@tensorflow/tfjs@4.22.0"></script>
<script src="{{ '/assets/js/digit-generator.js' | relative_url }}"></script>

The model runs entirely in the browser. DCGAN-5 was not trained to accept a digit label directly, so the demonstration uses saved starting points in its latent space that often lead to the selected class. This provides an approximate form of class selection without changing the trained architecture.

## Why a small dataset was useful

MNIST provided a controlled environment in which architectural choices were visible and the complete experiment could run on one GeForce RTX 3060 laptop GPU. The purpose was to compare behaviour under a practical compute limit, not to claim a state-of-the-art digit result.

## Boundaries of the comparison

- MNIST is small, so the results do not generalize directly to complex image domains.
- Training ran on one personal laptop and recorded times are hardware-specific.
- The classifier comparison used one deterministic split and seed, not a multi-seed stability study.
- The generator metric uses a project-specific 20-dimensional CNN-3 representation and is not canonical FID.

The [technical appendix](/blog/2025/image-generation-deep-dive/) contains the architecture diagrams and per-model results. The [public repository](https://github.com/LeonardoPaccianiMori/portfolio-image-generation) contains the code and evidence from the later audit.
