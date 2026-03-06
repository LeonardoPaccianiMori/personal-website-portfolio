---
layout: page
title: Teaching Computers to Create Images
description: Exploring how neural networks learn to generate handwritten digits
img: assets/img/projects/image-generation/image-generation-thumbnail.png
importance: 1
category: foundations
chart:
  plotly: true
images:
  photoswipe: true
---

<div class="row justify-content-sm-center">
    <div class="col-sm-6 mt-3 mt-md-0">
        {% include figure.liquid loading="eager" path="assets/img/projects/image-generation/image-generation-thumbnail.png" title="Generated digits" class="img-fluid rounded z-depth-1" %}
    </div>
</div>
<div class="caption">
    Handwritten digits created by the best model developed in this project (DCGAN-5)
</div>

**November - December 2024**

## Abstract
I built and compared neural networks for two tasks on MNIST: recognizing digits and generating new ones. The focus is on understanding tradeoffs in model complexity, training time, and output quality, not on chasing state-of-the-art results. I evaluated 7 classifiers and 10 generative setups, then summarized the results with plots and interactive demos.

---

## Objective
Measure how model complexity changes performance and training cost for image classification and image generation.

---

## Data and Methods
- **Dataset**: MNIST (28x28 grayscale digits, 10 classes).
- **Models**: 3 CNNs, 4 FCNNs, 5 CVAEs, 5 DCGANs.
- **Metrics**: test accuracy and training time for classifiers; FID and training time for generators.
- **Stack**: TensorFlow/Keras, Plotly, TensorFlow.js for in-browser demos.

---

## Key Results
- The simplest CNN reached 98% accuracy while training about 30% faster than deeper models.
- Generation quality improved with more capacity and longer training; DCGAN-5 produced the best FID.
- Training stability depended heavily on activation functions and normalization choices.

### Evidence: Classification tradeoff
```plotly
{% include plotly/image-generation/accuracy-training-time-comparison.json %}
```
<div class="caption">
    Comparing 7 architectures for classification. The simplest model (CNN-1) is the best speed/accuracy tradeoff.
</div>

### Evidence: Generation quality vs training time
```plotly
{% include plotly/image-generation/dcgan-fid-training-time-comparison.json %}
```
<div class="caption">
    Comparing 5 GAN configurations for image generation. Lower FID is better; DCGAN-5 is best but slowest.
</div>

### Example outputs from the best generator
<div class="pswp-gallery d-flex flex-wrap justify-content-center" style="gap: 2px; max-width: 500px; margin: 0 auto;">
{% for i in (0..99) %}{% assign padded = i | prepend: '00' | slice: -3, 3 %}<a href="{{ 'assets/img/projects/image-generation/galleries/dcgan-5/img-' | append: padded | append: '.png' | relative_url }}" data-pswp-width="140" data-pswp-height="140" style="width: 48px;"><img src="{{ 'assets/img/projects/image-generation/galleries/dcgan-5/img-' | append: padded | append: '.png' | relative_url }}" alt="DCGAN-5 sample {{ i }}" style="width: 100%;" loading="lazy" /></a>{% endfor %}
</div>
<div class="caption">
    100 artificial handwritten digits created by the best GAN model (DCGAN-5). Click any image to zoom.
</div>

For full architecture details and per-model results, see the deep dive linked below.

---

## Interactive Demos

### CVAE-1
Click or drag anywhere in the latent space of CVAE-1 to generate a digit. A red X marker will show the currently selected position. Scatter point colors indicate the digit class of each encoded point.
<div id="cvae-explorer" class="my-3">
    <div class="row align-items-start">
        <div class="col-md-8">
            <div id="cvae-latent-plot" style="width: 100%; height: 400px;"></div>
        </div>
        <div class="col-md-4">
            <div class="text-center">
                <p class="mb-2 small text-muted">Generated Image</p>
                <canvas id="cvae-output-canvas" width="140" height="140" class="border rounded" style="image-rendering: pixelated;"></canvas>
                <p id="cvae-coords-text" class="mt-2 small text-muted"></p>
                <p id="cvae-status-text" class="small text-muted"></p>
                <div id="cvae-loading" class="small text-muted" style="display: none;">Loading model...</div>
            </div>
        </div>
    </div>
</div>
<script src="{{ '/assets/js/cvae-explorer.js' | relative_url }}"></script>

### DCGAN-5
Generate your own handwritten digits using DCGAN-5 (the best model). Select a digit and click Generate to create a new image.

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
        <button id="generate-btn" class="btn btn-primary">
            Generate
        </button>
        <button id="random-btn" class="btn btn-outline-secondary">
            Random
        </button>
    </div>
    <div id="loading-indicator" class="text-muted mb-2" style="display: none;">Loading model...</div>
    <canvas id="output-canvas" width="140" height="140" class="border rounded"></canvas>
    <div id="status-text" class="text-muted mt-2 small"></div>
</div>

<script src="https://cdn.jsdelivr.net/npm/@tensorflow/tfjs@4.22.0"></script>
<script src="{{ '/assets/js/digit-generator.js' | relative_url }}"></script>

The DCGAN-5 model runs entirely in your browser using TensorFlow.js. The first generation may take a few seconds while the model loads.

**Note**: This uses DCGAN-5 with pre-discovered "seed vectors", i.e. noise inputs that reliably produce each digit class. This way we simulate using a conditional GAN with the unchanged DCGAN-5 architecture.

---

## Takeaways
- Match model complexity to task complexity; deeper models are not always better.
- Generation quality depends on capacity, training time, and stability tricks.
- Clear evaluation criteria (accuracy, FID, training time) make tradeoffs visible.

---

## Limitations
- MNIST is a small dataset; results do not generalize to complex images.
- Training ran on a personal laptop with limited compute[^1].

---

## Deep Dive
Full experiment details, architecture diagrams, and per-model results are in [Image Generation: Full Technical Deep Dive](/blog/2026/image-generation-deep-dive/).

---

## View the Code
All code for this project is available on GitHub [here](https://github.com/LeonardoPaccianiMori/portfolio-image-generation).

**Note**: This project's code was originally written by me and later reorganized in December 2025 using Codex 5.2, in order to make it tidier and better organized.

---

## Disclaimer

The content of this page was originally written by me. I used AI tools for editing and clarity only; the ideas, analysis, and conclusions are mine.

---

## Footnotes

[^1]: This project was executed on my personal laptop, a [System76 Kudu](https://tech-docs.system76.com/models/kudu6/README.html).

