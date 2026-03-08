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

## Summary
I used MNIST as a controlled environment because I wanted a problem small enough to make architectural choices visible instead of burying them under dataset complexity. I was less interested in chasing the single best number than in figuring out what extra model complexity actually buys you, how fragile generative training becomes once you have to debug it yourself, and how to make those tradeoffs legible to another practitioner.

---

## What I Wanted to Learn
I did not choose this project because handwritten digits are inherently exciting. I chose it because MNIST is simple enough to expose bad assumptions quickly. What I cared about was seeing which ideas genuinely improved the result, which ones only sounded sophisticated, and where "best practice" stopped being useful once the training dynamics became unstable.

---

## What I Built
- A comparison of **7 classifiers** and **10 generative configurations** on MNIST.
- A consistent evaluation setup using **accuracy**, **FID**, and **training time**.
- Plotly visualizations to make model tradeoffs easy to scan.
- Two in-browser demos built with **TensorFlow.js**, so the project ends in something interactive rather than only notebooks and plots.

---

## Results
- The baseline CNN reached **about 98.3% test accuracy** while remaining the clearest speed/complexity tradeoff; the highest raw classifier accuracy came from a deeper FCNN variant.
- The strongest generator was **DCGAN-5**, which produced the best FID after combining a better architecture with longer training.
- The most important debugging lesson was that **activation and normalization choices strongly affected training stability**. A small change in the output layer turned a failing GAN into a working one.

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

---

## Technical Approach
- **Classification**: I compared CNN and FCNN variants to see whether extra layers or different heads paid off enough to justify the added training cost.
- **Generation**: I used CVAEs for latent-space exploration and DCGANs for image quality, evaluating them with both metrics and visual inspection.
- **Presentation**: I exported selected models to TensorFlow.js so visitors could interact with the project directly in the browser.

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
Generate your own handwritten digits using DCGAN-5. Select a digit and click Generate to create a new image.

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

**Note**: This demo uses pre-discovered seed vectors that reliably produce specific digits, which lets me approximate conditional generation without changing the underlying DCGAN-5 architecture.

---

What I still like most about this project is that it does not hide behind a final score. The useful part was learning where the simple baseline was already enough, where generative models became fragile, and how much easier those tradeoffs are to discuss once the outputs are visible in the browser instead of trapped in a notebook.

---

## Limitations
- MNIST is a small dataset; the results do not generalize directly to complex image domains.
- Training ran on a personal laptop with limited compute[^1].

---

## Deep Dive
Full experiment details, architecture diagrams, and per-model results are in [Image Generation: Full Technical Deep Dive](/blog/2025/image-generation-deep-dive/).

---

## Related Blog Posts
- [Activation Functions Killed My GAN: A Debugging Story](/blog/2025/gan-activation-functions/): How changing one line of code in my MNIST GAN turned a failing model into one that finally produced recognizable digits.

---

## View the Code
All code for this project is available on GitHub [here](https://github.com/LeonardoPaccianiMori/portfolio-image-generation).

---

## Footnotes

[^1]: This project was executed on my personal laptop, a [System76 Kudu](https://tech-docs.system76.com/models/kudu6/README.html).
