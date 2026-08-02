---
layout: post
title: "Technical appendix: MNIST classifiers, VAEs, and GANs"
date: 2025-02-21 15:30:00
description: The technical appendix to my MNIST image-generation project, covering the experiment setup, architecture choices, and per-model results.
tags: deep-learning GAN VAE CNN
categories: [technical-notes]
chart:
  plotly: true
images:
  photoswipe: true
---

## Overview
This post is the technical appendix to my [image generation project](/projects/image-generation/). I used MNIST because it is simple enough to expose bad assumptions quickly, which made it a good setting for comparing classifier architectures, watching generative models fail in public, and figuring out which improvements were real instead of just fashionable. The project page gives the portfolio-level summary; this page keeps the experiment setup, architecture choices, and per-model results in one place.

---

## At a Glance
- **Dataset**: MNIST (28x28 grayscale digits, 10 classes)
- **Scope**: 7 classifiers (CNN/FCNN), 5 CVAEs, 5 DCGANs
- **Highest classifier accuracy**: CNN-2 at 98.66% test accuracy in about 22.9 CPU minutes
- **Most practical classifier**: CNN-1 at 98.05% test accuracy in about 11.1 CPU minutes
- **Best generator in this comparison**: DCGAN-5, with project-specific Fréchet CNN-3 feature distance 2.29 in ~113 minutes
- **Stack**: TensorFlow/Keras (training and inference), TensorFlow.js (browser demo), Plotly (analysis)

---

## Experiment Setup
- **Classifier split**: seed 42; 54,000 training and 6,000 stratified validation images from the official training split; the official 10,000-image test split remained untouched until one final evaluation per model
- **Model selection**: checkpoint with minimum validation loss; the curves below therefore show training and validation metrics, not repeated test measurements
- **Preprocessing**: No data augmentation for classifiers; MNIST scaled to [-1, 1] for DCGAN-1 (tanh output) and [0, 1] for DCGAN-2+ (sigmoid output)
- **Hyperparameters**: classifiers trained for 100 epochs with batch size 128 (CNN learning rate 0.0001; FCNN learning rate 0.001); CVAEs trained for 50 epochs; DCGANs trained with their recorded Adam configurations for 100 epochs (DCGAN-5: 200 epochs)
- **Timing**: wall-clock measurements from a TensorFlow 2.20 CPU run; useful for this comparison, not portable benchmarks

---

## Classification Models

### Convolutional Neural Networks (CNNs)
I used the CNN family as the clean baseline for the project: standard convolutions, easy-to-read behavior, and a good reference point for the later FCNN and generative experiments.

#### CNN-1 (Baseline)
- **Architecture**: 3 convolutional layers + 1 fully connected layer
- **Performance**: 98.05% test accuracy; 0.0620 test loss
- **Selected checkpoint**: epoch 56
- **Training Time**: ~11.1 CPU minutes

<div class="row">
    <div class="col-sm mt-3 mt-md-0">
        {% include figure.liquid loading="eager" path="assets/img/projects/image-generation/CNN1.png" title="CNN-1 architecture" class="img-fluid rounded z-depth-1" %}
    </div>
</div>

Training curves for CNN-1 (accuracy and loss over epochs).
```plotly
{% include plotly/image-generation/cnn-1-training.json %}
```

#### CNN-2 (More Convolutional Layers)
- **Architecture**: 5 convolutional layers + 1 fully connected layer
- **Performance**: 98.66% test accuracy; 0.0468 test loss (best classifier)
- **Selected checkpoint**: epoch 100
- **Training Time**: ~22.9 CPU minutes

<div class="row">
    <div class="col-sm mt-3 mt-md-0">
        {% include figure.liquid loading="eager" path="assets/img/projects/image-generation/CNN2.png" title="CNN-2 architecture" class="img-fluid rounded z-depth-1" %}
    </div>
</div>

Training curves for CNN-2 (accuracy and loss over epochs).
```plotly
{% include plotly/image-generation/cnn-2-training.json %}
```

#### CNN-3 (More Fully Connected Layers)
- **Architecture**: 3 convolutional layers + 3 fully connected layers
- **Performance**: 98.30% test accuracy; 0.0558 test loss
- **Selected checkpoint**: epoch 45
- **Training Time**: ~12.1 CPU minutes

<div class="row">
    <div class="col-sm mt-3 mt-md-0">
        {% include figure.liquid loading="eager" path="assets/img/projects/image-generation/CNN3.png" title="CNN-3 architecture" class="img-fluid rounded z-depth-1" %}
    </div>
</div>

Training curves for CNN-3 (accuracy and loss over epochs).
```plotly
{% include plotly/image-generation/cnn-3-training.json %}
```

#### CNN comparison
**Conclusion**: CNN-2 has the strongest held-out result. CNN-1 gives up 0.61 percentage points of accuracy while taking roughly half the recorded CPU training time, so it remains the cleaner default when simplicity and iteration speed matter.

Accuracy comparison across the CNN variants.
```plotly
{% include plotly/image-generation/cnn-accuracy-comparison.json %}
```

Training time comparison across the CNN variants.
```plotly
{% include plotly/image-generation/cnn-training-time-comparison.json %}
```

---

### Fully Convolutional Neural Networks (FCNNs)
Unlike the CNN family, these models replace the dense head with global pooling. I included them because they are architecturally cleaner, but I wanted to see how much accuracy that simplicity would cost or recover.

#### FCNN-1 (Baseline)
- **Architecture**: 3 convolutional layers + global pooling
- **Performance**: 79.17% test accuracy; 0.6646 test loss
- **Selected checkpoint**: epoch 100
- **Training Time**: ~13.1 CPU minutes

<div class="row">
    <div class="col-sm mt-3 mt-md-0">
        {% include figure.liquid loading="eager" path="assets/img/projects/image-generation/FCNN1.png" title="FCNN-1 architecture" class="img-fluid rounded z-depth-1" %}
    </div>
</div>

Training curves for FCNN-1 (accuracy and loss over epochs).
```plotly
{% include plotly/image-generation/fcnn-1-training.json %}
```

#### FCNN-2 (More Layers)
- **Architecture**: 5 convolutional layers + global pooling
- **Performance**: 90.62% test accuracy; 0.2982 test loss
- **Selected checkpoint**: epoch 100
- **Training Time**: ~16.2 CPU minutes

<div class="row">
    <div class="col-sm mt-3 mt-md-0">
        {% include figure.liquid loading="eager" path="assets/img/projects/image-generation/FCNN2.png" title="FCNN-2 architecture" class="img-fluid rounded z-depth-1" %}
    </div>
</div>

Training curves for FCNN-2 (accuracy and loss over epochs).
```plotly
{% include plotly/image-generation/fcnn-2-training.json %}
```

#### FCNN-3 (Larger Kernels)
- **Architecture**: 3 convolutional layers (5x5 kernels) + global pooling
- **Performance**: 94.60% test accuracy; 0.1874 test loss (best FCNN)
- **Selected checkpoint**: epoch 95
- **Training Time**: ~18.3 CPU minutes

<div class="row">
    <div class="col-sm mt-3 mt-md-0">
        {% include figure.liquid loading="eager" path="assets/img/projects/image-generation/FCNN3.png" title="FCNN-3 architecture" class="img-fluid rounded z-depth-1" %}
    </div>
</div>

Training curves for FCNN-3 (accuracy and loss over epochs).
```plotly
{% include plotly/image-generation/fcnn-3-training.json %}
```

#### FCNN-4 (More Layers + Larger Kernels)
- **Architecture**: 5 convolutional layers (5x5 kernels) + global pooling
- **Performance**: 78.90% test accuracy; 0.5256 test loss
- **Selected checkpoint**: epoch 52
- **Training Time**: ~24.1 CPU minutes
- **Comments**: The deepest FCNN was unstable in this seeded run and did not reproduce the old optimistic result. I retain the failure because it shows that depth and larger kernels did not make the architecture reliably better.

<div class="row">
    <div class="col-sm mt-3 mt-md-0">
        {% include figure.liquid loading="eager" path="assets/img/projects/image-generation/FCNN4.png" title="FCNN-4 architecture" class="img-fluid rounded z-depth-1" %}
    </div>
</div>

Training curves for FCNN-4 (accuracy and loss over epochs).
```plotly
{% include plotly/image-generation/fcnn-4-training.json %}
```

#### FCNN comparison
**Conclusion**: FCNN-3 improved materially over the first two variants, but none matched the CNN family. FCNN-4 then regressed sharply. A multi-seed study would be needed to separate architecture quality from initialization sensitivity; this single run is evidence against claiming a reliable benefit.

Accuracy comparison across the FCNN variants.
```plotly
{% include plotly/image-generation/fcnn-accuracy-comparison.json %}
```

Training time comparison across the FCNN variants.
```plotly
{% include plotly/image-generation/fcnn-training-time-comparison.json %}
```

---

## Generative Models

### Convolutional Variational Autoencoders (CVAEs)
I tested five CVAE variants with a 2D latent space. The point here was not image quality alone; it was to see how architecture changes affected the interpretability of the latent space.

#### CVAE-1 (Baseline)
- **Architecture**: 3 convolutional layers (encoder + decoder), 100-neuron hidden layer, 2D latent space
- **Median silhouette score**: -0.01
- **Comments**: Marginal separation in latent space (only 0, 1, and 7 are clearly separated)

<div class="row">
    <div class="col-sm mt-3 mt-md-0">
        {% include figure.liquid loading="eager" path="assets/img/projects/image-generation/CVAE1.png" title="CVAE-1 architecture" class="img-fluid rounded z-depth-1" %}
    </div>
</div>

Training curves for CVAE-1 (loss and reconstruction metrics).
```plotly
{% include plotly/image-generation/cvae-1-training.json %}
```

2D latent space projection colored by digit class.
```plotly
{% include plotly/image-generation/cvae-1-latent-space.json %}
```

The grid below shows what the decoder generates at cell centers across a 16x16 division of the latent space (z1: -2 to 13, z2: -3 to 15):

<div class="pswp-gallery d-flex flex-wrap justify-content-center" style="gap: 1px; max-width: 560px; margin: 0 auto;">
{% for row in (0..15) %}{% for col in (0..15) %}{% assign row_padded = row | prepend: '0' | slice: -2, 2 %}{% assign col_padded = col | prepend: '0' | slice: -2, 2 %}<a href="{{ 'assets/img/projects/image-generation/galleries/cvae-1-grid/grid-' | append: row_padded | append: '-' | append: col_padded | append: '.png' | relative_url }}" data-pswp-width="140" data-pswp-height="140" style="width: 34px;"><img src="{{ 'assets/img/projects/image-generation/galleries/cvae-1-grid/grid-' | append: row_padded | append: '-' | append: col_padded | append: '.png' | relative_url }}" alt="CVAE grid cell" style="width: 100%;" loading="lazy" /></a>{% endfor %}{% endfor %}
</div>
<div class="caption">
    16x16 grid of images generated by the CVAE-1 decoder across the latent space. Top-left is near (z1 ~ -1.5, z2 ~ 14.4), bottom-right is near (z1 ~ 12.5, z2 ~ -2.4). Click any image to zoom.
</div>

#### CVAE-2 (Larger Hidden Layer)
- **Architecture**: Same as CVAE-1, but with 200-neuron hidden layer (2x baseline)
- **Median silhouette score**: -0.06
- **Comments**: Even worse latent space separation than CVAE-1

Training curves for CVAE-2.
```plotly
{% include plotly/image-generation/cvae-2-training.json %}
```

2D latent space projection for CVAE-2.
```plotly
{% include plotly/image-generation/cvae-2-latent-space.json %}
```

<div class="pswp-gallery d-flex flex-wrap justify-content-center" style="gap: 1px; max-width: 560px; margin: 0 auto;">
{% for row in (0..15) %}{% for col in (0..15) %}{% assign row_padded = row | prepend: '0' | slice: -2, 2 %}{% assign col_padded = col | prepend: '0' | slice: -2, 2 %}<a href="{{ 'assets/img/projects/image-generation/galleries/cvae-2-grid/grid-' | append: row_padded | append: '-' | append: col_padded | append: '.png' | relative_url }}" data-pswp-width="140" data-pswp-height="140" style="width: 34px;"><img src="{{ 'assets/img/projects/image-generation/galleries/cvae-2-grid/grid-' | append: row_padded | append: '-' | append: col_padded | append: '.png' | relative_url }}" alt="CVAE-2 grid cell" style="width: 100%;" loading="lazy" /></a>{% endfor %}{% endfor %}
</div>
<div class="caption">
    16x16 grid of images generated by the CVAE-2 decoder across the latent space (z1: -8 to 10, z2: -10 to 12). Click any image to zoom.
</div>

#### CVAE-3 (More Convolutional Layers)
- **Architecture**: Same as CVAE-1, but with 5 convolutional layers (encoder + decoder) instead of 3
- **Median silhouette score**: -0.07
- **Comments**: Still marginal separation in latent space (only 1 and 0 are neatly separated)

<div class="row">
    <div class="col-sm mt-3 mt-md-0">
        {% include figure.liquid loading="eager" path="assets/img/projects/image-generation/CVAE3.png" title="CVAE-3 architecture" class="img-fluid rounded z-depth-1" %}
    </div>
</div>

Training curves for CVAE-3.
```plotly
{% include plotly/image-generation/cvae-3-training.json %}
```

2D latent space projection for CVAE-3.
```plotly
{% include plotly/image-generation/cvae-3-latent-space.json %}
```

<div class="pswp-gallery d-flex flex-wrap justify-content-center" style="gap: 1px; max-width: 560px; margin: 0 auto;">
{% for row in (0..15) %}{% for col in (0..15) %}{% assign row_padded = row | prepend: '0' | slice: -2, 2 %}{% assign col_padded = col | prepend: '0' | slice: -2, 2 %}<a href="{{ 'assets/img/projects/image-generation/galleries/cvae-3-grid/grid-' | append: row_padded | append: '-' | append: col_padded | append: '.png' | relative_url }}" data-pswp-width="140" data-pswp-height="140" style="width: 34px;"><img src="{{ 'assets/img/projects/image-generation/galleries/cvae-3-grid/grid-' | append: row_padded | append: '-' | append: col_padded | append: '.png' | relative_url }}" alt="CVAE-3 grid cell" style="width: 100%;" loading="lazy" /></a>{% endfor %}{% endfor %}
</div>
<div class="caption">
    16x16 grid of images generated by the CVAE-3 decoder across the latent space (z1: -3 to 3, z2: -3 to 3). Click any image to zoom.
</div>

#### CVAE-4 and CVAE-5 (More Fully Connected Layers)
- **Architecture**: Same as CVAE-1, but with 3 or 4 connected layers
- **Median silhouette score**: 0.01 and -0.06
- **Comments**: Better latent space separation, but still incomplete (4, 7, 8 and 9 overlap)

<div class="row">
    <div class="col-sm mt-3 mt-md-0">
        {% include figure.liquid loading="eager" path="assets/img/projects/image-generation/CVAE4.png" title="CVAE-4 architecture" class="img-fluid rounded z-depth-1" %}
    </div>
</div>

Training curves for CVAE-4.
```plotly
{% include plotly/image-generation/cvae-4-training.json %}
```

2D latent space projection for CVAE-4.
```plotly
{% include plotly/image-generation/cvae-4-latent-space.json %}
```

<div class="pswp-gallery d-flex flex-wrap justify-content-center" style="gap: 1px; max-width: 560px; margin: 0 auto;">
{% for row in (0..15) %}{% for col in (0..15) %}{% assign row_padded = row | prepend: '0' | slice: -2, 2 %}{% assign col_padded = col | prepend: '0' | slice: -2, 2 %}<a href="{{ 'assets/img/projects/image-generation/galleries/cvae-4-grid/grid-' | append: row_padded | append: '-' | append: col_padded | append: '.png' | relative_url }}" data-pswp-width="140" data-pswp-height="140" style="width: 34px;"><img src="{{ 'assets/img/projects/image-generation/galleries/cvae-4-grid/grid-' | append: row_padded | append: '-' | append: col_padded | append: '.png' | relative_url }}" alt="CVAE-4 grid cell" style="width: 100%;" loading="lazy" /></a>{% endfor %}{% endfor %}
</div>
<div class="caption">
    16x16 grid of images generated by the CVAE-4 decoder across the latent space (z1: -2 to 14, z2: -3 to 16). Click any image to zoom.
</div>

#### CVAE comparison
**Conclusion**: A 2D latent space is visually pleasant but restrictive. None of these CVAEs cleanly separated all ten digits, and extra complexity often made the latent structure harder rather than clearer.

Silhouette score comparison across CVAE variants.
```plotly
{% include plotly/image-generation/cvae-silhouette-comparison.json %}
```

Training time comparison across CVAE variants.
```plotly
{% include plotly/image-generation/cvae-training-time-comparison.json %}
```

---

### Deep Convolutional Generative Adversarial Networks (DCGANs)
I tested five DCGAN configurations in sequence, with each one responding to the failure mode or tradeoff in the previous version.

#### DCGAN-1 (Baseline with Tanh)
- **Architecture**: 3 conv layers (generator + discriminator), tanh activation
- **Result**: Poor; only a few digits recognizable and images are noisy
- **Issue**: Discriminator plateaus, generator loss keeps increasing

Generator and discriminator loss curves for DCGAN-1.
```plotly
{% include plotly/image-generation/dcgan-1-training.json %}
```

<div class="pswp-gallery d-flex flex-wrap justify-content-center" style="gap: 2px; max-width: 500px; margin: 0 auto;">
{% for i in (0..99) %}{% assign padded = i | prepend: '00' | slice: -3, 3 %}<a href="{{ 'assets/img/projects/image-generation/galleries/dcgan-1/img-' | append: padded | append: '.png' | relative_url }}" data-pswp-width="140" data-pswp-height="140" style="width: 48px;"><img src="{{ 'assets/img/projects/image-generation/galleries/dcgan-1/img-' | append: padded | append: '.png' | relative_url }}" alt="DCGAN-1 sample {{ i }}" style="width: 100%;" loading="lazy" /></a>{% endfor %}
</div>
<div class="caption">
    100 digits generated by DCGAN-1. Click any image to zoom.
</div>

#### DCGAN-2 (Sigmoid Activation)
- **Change**: Sigmoid activation instead of tanh
- **Result**: Dramatic improvement; losses oscillate healthily
- **Quality**: Most digits recognizable but still imperfect

**Key insight**: The activation and normalization pairing mattered more than any of the smaller tuning changes I tried earlier.

Generator and discriminator loss curves for DCGAN-2.
```plotly
{% include plotly/image-generation/dcgan-2-training.json %}
```

<div class="pswp-gallery d-flex flex-wrap justify-content-center" style="gap: 2px; max-width: 500px; margin: 0 auto;">
{% for i in (0..99) %}{% assign padded = i | prepend: '00' | slice: -3, 3 %}<a href="{{ 'assets/img/projects/image-generation/galleries/dcgan-2/img-' | append: padded | append: '.png' | relative_url }}" data-pswp-width="140" data-pswp-height="140" style="width: 48px;"><img src="{{ 'assets/img/projects/image-generation/galleries/dcgan-2/img-' | append: padded | append: '.png' | relative_url }}" alt="DCGAN-2 sample {{ i }}" style="width: 100%;" loading="lazy" /></a>{% endfor %}
</div>
<div class="caption">
    100 digits generated by DCGAN-2. Click any image to zoom.
</div>

#### DCGAN-3 (Larger Kernels)
- **Change**: 5x5 kernels (from 3x3), keeping sigmoid
- **Result**: Significant quality improvement, all 10 digits recognizable
- **Training Time**: Minimal increase

Generator and discriminator loss curves for DCGAN-3.
```plotly
{% include plotly/image-generation/dcgan-3-training.json %}
```

<div class="pswp-gallery d-flex flex-wrap justify-content-center" style="gap: 2px; max-width: 500px; margin: 0 auto;">
{% for i in (0..99) %}{% assign padded = i | prepend: '00' | slice: -3, 3 %}<a href="{{ 'assets/img/projects/image-generation/galleries/dcgan-3/img-' | append: padded | append: '.png' | relative_url }}" data-pswp-width="140" data-pswp-height="140" style="width: 48px;"><img src="{{ 'assets/img/projects/image-generation/galleries/dcgan-3/img-' | append: padded | append: '.png' | relative_url }}" alt="DCGAN-3 sample {{ i }}" style="width: 100%;" loading="lazy" /></a>{% endfor %}
</div>
<div class="caption">
    100 digits generated by DCGAN-3. Click any image to zoom.
</div>

#### DCGAN-4 (More Layers)
- **Change**: 4 conv layers (generator + discriminator)
- **Result**: Best visual quality among the 100-epoch runs; all digits clear, fewer artifacts
- **Training Time**: Significantly longer than the earlier variants, but worth it

Generator and discriminator loss curves for DCGAN-4.
```plotly
{% include plotly/image-generation/dcgan-4-training.json %}
```

<div class="pswp-gallery d-flex flex-wrap justify-content-center" style="gap: 2px; max-width: 500px; margin: 0 auto;">
{% for i in (0..99) %}{% assign padded = i | prepend: '00' | slice: -3, 3 %}<a href="{{ 'assets/img/projects/image-generation/galleries/dcgan-4/img-' | append: padded | append: '.png' | relative_url }}" data-pswp-width="140" data-pswp-height="140" style="width: 48px;"><img src="{{ 'assets/img/projects/image-generation/galleries/dcgan-4/img-' | append: padded | append: '.png' | relative_url }}" alt="DCGAN-4 sample {{ i }}" style="width: 100%;" loading="lazy" /></a>{% endfor %}
</div>
<div class="caption">
    100 digits generated by DCGAN-4. Click any image to zoom.
</div>

#### DCGAN-5 (Extended Training)
- **Change**: 200 epochs (from 100), same architecture as DCGAN-4
- **Result**: Lowest project-specific feature distance (2.29 vs DCGAN-4's 3.23); sharper edges and more consistent digits by visual inspection
- **Training Time**: ~113 minutes

Generator and discriminator loss curves for DCGAN-5.
```plotly
{% include plotly/image-generation/dcgan-5-training.json %}
```

<div class="pswp-gallery d-flex flex-wrap justify-content-center" style="gap: 2px; max-width: 500px; margin: 0 auto;">
{% for i in (0..99) %}{% assign padded = i | prepend: '00' | slice: -3, 3 %}<a href="{{ 'assets/img/projects/image-generation/galleries/dcgan-5/img-' | append: padded | append: '.png' | relative_url }}" data-pswp-width="140" data-pswp-height="140" style="width: 48px;"><img src="{{ 'assets/img/projects/image-generation/galleries/dcgan-5/img-' | append: padded | append: '.png' | relative_url }}" alt="DCGAN-5 sample {{ i }}" style="width: 100%;" loading="lazy" /></a>{% endfor %}
</div>
<div class="caption">
    100 digits generated by DCGAN-5 (best model). Click any image to zoom.
</div>

#### DCGAN comparison
For a reproducible relative comparison, I generated 10,000 images per model with seed 42, embedded them and all 10,000 official MNIST test images using the 20-dimensional penultimate layer of the selected CNN-3 classifier, and calculated a Fréchet distance between those feature distributions. Lower is better within this project.

This is **not canonical FID**: it does not use InceptionV3, and the values must not be compared with published FID results. It is a narrow project-specific diagnostic that agrees with the visual progression from the failed DCGAN-1 to the stronger DCGAN-4 and DCGAN-5 outputs.

**Conclusion**: DCGAN-5 produces the strongest samples in the set, but the gains came from iterative architecture work plus extra training time, not from one final tweak.

Fréchet CNN-3 feature-distance comparison across DCGAN variants (lower is better within this project).
```plotly
{% include plotly/image-generation/dcgan-feature-distance-comparison.json %}
```

Training time comparison across DCGAN variants.
```plotly
{% include plotly/image-generation/dcgan-training-time-comparison.json %}
```

---

## Summary
- The most useful classification result was not the single highest-accuracy point; it was realizing how often the simple CNN was the model I would actually choose.
- For generation, the turning points were mostly mundane but consequential: output scaling, architecture, and training time mattered more than cleverness.
- Keeping the plots, galleries, and timing data side by side changed how I reasoned about the models. Without that, I would have overvalued the headline numbers and undervalued the failure modes.

---

## Look at the Code
All code for this project is available on GitHub [here](https://github.com/LeonardoPaccianiMori/portfolio-image-generation).
