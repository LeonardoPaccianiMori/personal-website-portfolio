---
layout: page
title: Teaching computers to create images
description: Exploring how neural networks learn to generate handwritten digits
img: assets/img/projects/image-generation/image-generation-thumbnail.png
importance: 1
category: experimental
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
- A comparison of **7 classifiers** and **10 generative configurations** on
  MNIST, plus a separate conditional GAN implementation.
- A classifier protocol with a separate training, validation, and untouched test split.
- A project-specific **Fréchet CNN-3 feature distance** for relative generator comparison, clearly separated from canonical FID.
- Accuracy, validation curves, feature distance, and hardware-specific training-time comparisons.
- Plotly visualizations to make model tradeoffs easy to scan.
- Two in-browser demos built with **TensorFlow.js**, so the project ends in something interactive rather than only notebooks and plots.

---

## Results
- **CNN-2 reached 98.66% test accuracy**, the strongest classifier result. CNN-1 reached 98.05% in roughly half the CPU training time, making it the clearer speed/complexity tradeoff.
- FCNN-3 was the strongest fully convolutional variant at 94.60%. The deeper FCNN-4 fell to 78.90% in the seeded run, a useful warning that added capacity did not make this family reliably better.
- **DCGAN-5 had the lowest project-specific feature distance at 2.29**, ahead of DCGAN-4 at 3.23, while also taking the longest recorded training time.
- The most important debugging lesson was that **activation and normalization choices strongly affected training stability**. A small change in the output layer turned a failing GAN into a working one.

### Evidence: Classification tradeoff
```plotly
{% include plotly/image-generation/accuracy-training-time-comparison.json %}
```
<div class="caption">
    One seeded CPU run across 7 architectures. CNN-2 has the highest test accuracy; CNN-1 offers the clearest speed/accuracy tradeoff. Times are hardware-specific.
</div>

### Evidence: Relative generation quality
```plotly
{% include plotly/image-generation/dcgan-feature-distance-comparison.json %}
```
<div class="caption">
    Fréchet distance between 10,000 generated images and the official MNIST test split in CNN-3's 20-dimensional feature space. Lower is better within this project; this is not canonical FID.
</div>

### Evidence: Generator training time
```plotly
{% include plotly/image-generation/dcgan-training-time-comparison.json %}
```
<div class="caption">
    Historical wall-clock training times. DCGAN-5's 200-epoch run took about 113 minutes, roughly twice DCGAN-4's 100-epoch run.
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
- **Classification**: I reserved 6,000 images from the official training set for model selection, selected the minimum-validation-loss checkpoint, and evaluated the untouched official test split once per model.
- **Generation**: I used CVAEs for latent-space exploration and DCGANs for image quality. For a relative quantitative check, I compared 10,000 generated samples per DCGAN with the official test split in a fixed CNN-3 feature space, alongside visual inspection.
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
- The classifier comparison is one deterministic split and seed, not a multi-seed stability study; FCNN-4 in particular should not be generalized from one run.
- The generator metric uses a project-specific 20-dimensional CNN-3 representation. It is useful only for relative comparison inside this project and is not canonical InceptionV3 FID.

---

## Deep Dive
Full experiment details, architecture diagrams, and per-model results are in [Technical Appendix: MNIST Classifiers, VAEs, and GANs](/blog/2025/image-generation-deep-dive/).

---

## View the Code
All code for this project is available on GitHub [here](https://github.com/LeonardoPaccianiMori/portfolio-image-generation).

---

## Footnotes

[^1]: This project was executed on my personal laptop, a [System76 Kudu](https://tech-docs.system76.com/models/kudu6/README.html).
