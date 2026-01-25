---
layout: post
title: "Image Generation Deep Dive: CNNs, VAEs, and GANs on MNIST"
date: 2026-01-12 10:00:00
description: A full technical breakdown of the architectures, training setups, and results behind my MNIST image generation project.
tags: deep-learning GAN VAE CNN
categories: [data-science, learning]
chart:
  plotly: true
images:
  photoswipe: true
---

## Overview
This post is the technical deep dive for my [Image Generation project](/projects/image-generation-v2/). It covers the full experiment setup, model architectures, and per-model results.

---

## At a Glance
- **Dataset**: MNIST (28x28 grayscale digits, 10 classes)
- **Scope**: 7 classifiers (CNN/FCNN), 5 CVAEs, 5 DCGANs
- **Best classifier**: CNN-1 at ~98% test accuracy in ~106s
- **Best generator**: DCGAN-5 with FID 117.3 in ~113 minutes
- **Stack**: TensorFlow/Keras (training and inference), TensorFlow.js (browser demo), Plotly (analysis)

---

## Experiment Setup
- **Dataset split**: Standard MNIST train/test split; test set used for reported accuracy and loss curves
- **Preprocessing**: No data augmentation for classifiers; MNIST scaled to [-1, 1] for DCGAN-1 (tanh output) and [0, 1] for DCGAN-2+ (sigmoid output)
- **Hyperparameters**: CNN/FCNN trained 100 epochs with fixed learning rate 0.001; CVAEs trained 50 epochs; DCGANs trained with Adam (lr=0.0002, beta_1=0.5), batch size 128, 100 epochs (DCGAN-5: 200 epochs)

---

## Classification Models

### Convolutional Neural Networks (CNNs)
I tested three CNN architectures to understand the impact of depth and layer types on accuracy and training time.

#### CNN-1 (Baseline)
- **Architecture**: 3 convolutional layers + 1 fully connected layer
- **Performance**: 98% accuracy
- **Training Time**: 106s
- **Comments**: Starts slightly overfitting after epoch ~30

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
- **Performance**: 98.6% accuracy (best)
- **Training Time**: 152s
- **Comments**: Less overfitting than CNN-1, and starts later (epoch ~60)

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
- **Performance**: 98% accuracy
- **Training Time**: 110s
- **Comments**: Starts overfitting already at epoch ~10

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
**Conclusion**: Adding convolutional layers costs ~43% more time but does not improve accuracy enough to justify it. CNN-1 is the most efficient choice.

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
Unlike CNNs, FCNNs use only convolutional layers and global pooling (no fully connected layers).

#### FCNN-1 (Baseline)
- **Architecture**: 3 convolutional layers + global pooling
- **Performance**: 80% accuracy
- **Training Time**: 103s
- **Comments**: Slower convergence compared to CNNs

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
- **Performance**: 87% accuracy
- **Training Time**: 134s
- **Comments**: Better than FCNN-1, but still below CNN performance

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
- **Performance**: 92% accuracy
- **Training Time**: 108s
- **Comments**: Kernel size matters more than depth for FCNNs

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
- **Performance**: 98.6% accuracy (best FCNN)
- **Training Time**: 130s
- **Comments**: Overfitting starts at epoch ~20; combining more layers and larger kernels reaches CNN-level performance but with longer training

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
**Conclusion**: FCNNs can match CNN performance but require more depth and larger kernels, leading to longer training times.

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
I tested 5 CVAE architectures using a 2D latent space. Good separation in the latent space generally means better generation.

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
**Conclusion**: CVAEs with 2D latent space struggle to separate all 10 digits, and higher complexity can make separation worse. A higher-dimensional latent space might help.

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
I tested five different DCGAN configurations.

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

**Key insight**: Activation function choice is critical for GANs.

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
- **Result**: Best quality; all digits clear, fewer artifacts
- **Training Time**: Significantly longer, but worth it

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
- **Result**: Best FID score (117.3 vs DCGAN-4's 153.5); sharper edges, more consistent digits
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
Here is the comparison of the [FID scores](https://en.wikipedia.org/wiki/Fr%C3%A9chet_inception_distance) and training times for these 5 models (lower FID is better):
**Conclusion**: DCGAN-5 produces the highest-quality images but requires significantly longer training.

FID comparison across DCGAN variants (lower is better).
```plotly
{% include plotly/image-generation/dcgan-fid-comparison.json %}
```

Training time comparison across DCGAN variants.
```plotly
{% include plotly/image-generation/dcgan-training-time-comparison.json %}
```

---

## Summary
- Model complexity is not automatically better for classification.
- For generation, capacity and training time matter, and training stability is highly sensitive to activation functions and normalization.
- Clear metrics (accuracy, FID, training time) make these tradeoffs visible.

---

## Look at the Code
All code for this project is available on GitHub [here](https://github.com/LeonardoPaccianiMori/portfolio-image-generation).

---

## Disclaimer

The content of this page was originally written by me. I used AI tools for editing and clarity only; the ideas, analysis, and conclusions are mine.
