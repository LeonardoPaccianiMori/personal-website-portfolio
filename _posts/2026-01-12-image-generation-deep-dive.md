---
layout: post
title: "Technical appendix: MNIST classifiers, VAEs, and GANs"
date: 2025-02-21 15:30:00
description: The technical appendix to my MNIST image-generation project, covering the experiment setup, architecture choices, and per-model results.
tags: deep-learning GAN VAE CNN
categories: [technical-notes]
technical_kind: appendix
chart:
  plotly: true
last_updated: 2026-09-06
project_slug: image-generation
toc:
  beginning: true
---

## Overview

This is the technical appendix to my [image generation project](/projects/image-generation/). The project compared seven classifiers, five convolutional variational autoencoders (CVAEs), and five deep convolutional GANs (DCGANs) on MNIST.

The original project ran in November–December 2024 on a laptop GPU. A later Codex-assisted audit retrained the classifiers on CPU and corrected the generator comparison. The classifier scores and CPU times here come from that audited run.

Four comparisons organize the results:

1. CNN-1 offered a strong accuracy–training-cost tradeoff, while CNN-2 reached the highest classifier accuracy.
2. Additional FCNN depth did not produce a reliable improvement in the audited run.
3. A two-dimensional CVAE space was easy to inspect, but none of the five variants separated all ten digits cleanly.
4. The DCGAN results improved across sequential configurations that changed output scaling, architecture, and training duration.

## Experiment at a glance

- **Dataset**: MNIST (28x28 grayscale digits, 10 classes)
- **Scope**: 7 classifiers (CNN/FCNN), 5 CVAEs, 5 DCGANs
- **Highest classifier accuracy**: CNN-2 at 98.66% test accuracy in about 22.9 CPU minutes
- **Most practical classifier**: CNN-1 at 98.05% test accuracy in about 11.1 CPU minutes
- **Best generator in this comparison**: DCGAN-5, with project-specific Fréchet CNN-3 feature distance 2.29 in ~113 minutes
- **Stack**: TensorFlow/Keras (training and inference), TensorFlow.js (browser demo), Plotly (analysis)

## Experiment setup

- **Classifier split**: seed 42; 54,000 training and 6,000 stratified validation images from the official training split; the official 10,000-image test split remained untouched until one final evaluation per model
- **Model selection**: checkpoint with minimum validation loss; the curves below therefore show training and validation metrics, not repeated test measurements
- **Preprocessing**: No data augmentation for classifiers; MNIST scaled to [-1, 1] for DCGAN-1 (tanh output) and [0, 1] for DCGAN-2+ (sigmoid output)
- **Hyperparameters**: classifiers trained for 100 epochs with batch size 128 (CNN learning rate 0.0001; FCNN learning rate 0.001); CVAEs trained for 50 epochs; DCGANs trained with their recorded Adam configurations for 100 epochs (DCGAN-5: 200 epochs)
- **Classifier timing**: wall-clock measurements from the audited TensorFlow 2.20 CPU run; generator training times belong to the original experiment. These are not portable benchmarks

## Classifiers: accuracy was not the only useful result

The CNN family provided the reference point for the project. CNN-2 reached the highest test accuracy, but CNN-1 remained the more practical architecture for quick iteration: it gave up 0.61 percentage points while taking roughly half the recorded CPU training time.

| Model | Main change                          | Test accuracy | Test loss | Selected epoch | CPU time |
| ----- | ------------------------------------ | ------------: | --------: | -------------: | -------: |
| CNN-1 | Three convolutional layers           |        98.05% |    0.0620 |             56 | 11.1 min |
| CNN-2 | Five convolutional layers            |        98.66% |    0.0468 |            100 | 22.9 min |
| CNN-3 | Three dense layers after convolution |        98.30% |    0.0558 |             45 | 12.1 min |

```plotly
{% include plotly/image-generation/cnn-accuracy-comparison.json %}
```

The fully convolutional family replaced the dense head with global pooling. FCNN-3 improved substantially over the first two variants, but none matched the CNN family. The deeper FCNN-4 then regressed sharply.

| Model  | Main change                     | Test accuracy | Test loss | Selected epoch | CPU time |
| ------ | ------------------------------- | ------------: | --------: | -------------: | -------: |
| FCNN-1 | Three layers and global pooling |        79.17% |    0.6646 |            100 | 13.1 min |
| FCNN-2 | Five layers                     |        90.62% |    0.2982 |            100 | 16.2 min |
| FCNN-3 | Larger 5x5 kernels              |        94.60% |    0.1874 |             95 | 18.3 min |
| FCNN-4 | Five layers and 5x5 kernels     |        78.90% |    0.5256 |             52 | 24.1 min |

```plotly
{% include plotly/image-generation/fcnn-accuracy-comparison.json %}
```

This was one deterministic split and seed. It does not establish that FCNN-4 is generally unstable or that FCNN-3 is always better. A multi-seed study would be needed to separate architecture quality from initialization sensitivity.

<details markdown="1">
<summary><strong>Classifier training record</strong></summary>

```plotly
{% include plotly/image-generation/cnn-1-training.json %}
```

```plotly
{% include plotly/image-generation/cnn-2-training.json %}
```

```plotly
{% include plotly/image-generation/cnn-3-training.json %}
```

```plotly
{% include plotly/image-generation/fcnn-1-training.json %}
```

```plotly
{% include plotly/image-generation/fcnn-2-training.json %}
```

```plotly
{% include plotly/image-generation/fcnn-3-training.json %}
```

```plotly
{% include plotly/image-generation/fcnn-4-training.json %}
```

</details>

## CVAEs: an inspectable latent space with overlapping classes

I tested five CVAE variants with a two-dimensional latent space. That made the latent geometry directly inspectable, but none of the variants separated all ten digits cleanly.

| Model  | Main change               | Median silhouette score | Main observation                                  |
| ------ | ------------------------- | ----------------------: | ------------------------------------------------- |
| CVAE-1 | Baseline                  |                   -0.01 | Only a few classes separated clearly              |
| CVAE-2 | Larger hidden layer       |                   -0.06 | Separation became worse                           |
| CVAE-3 | More convolutional layers |                   -0.07 | Limited separation remained                       |
| CVAE-4 | More dense layers         |                    0.01 | Best score, but several classes still overlapped  |
| CVAE-5 | Additional dense layer    |                   -0.06 | Added complexity did not preserve the CVAE-4 gain |

```plotly
{% include plotly/image-generation/cvae-silhouette-comparison.json %}
```

All five variants used a two-dimensional latent space. Additional depth did not reliably separate the classes, and the experiment did not test whether a larger latent space would resolve their overlap.

<details markdown="1">
<summary><strong>CVAE curves and latent projections</strong></summary>

```plotly
{% include plotly/image-generation/cvae-1-training.json %}
```

```plotly
{% include plotly/image-generation/cvae-1-latent-space.json %}
```

```plotly
{% include plotly/image-generation/cvae-2-latent-space.json %}
```

```plotly
{% include plotly/image-generation/cvae-3-latent-space.json %}
```

```plotly
{% include plotly/image-generation/cvae-4-latent-space.json %}
```

```plotly
{% include plotly/image-generation/cvae-training-time-comparison.json %}
```

The complete latent-space grids and model assets remain in the repository even though the page no longer loads every image.

</details>

## DCGANs: the sequence of changes mattered

The five DCGAN configurations changed in sequence. DCGAN-1 produced noisy, weakly recognizable outputs. The change in output scaling and activation in DCGAN-2 coincided with the largest visible step. Later configurations also changed kernel size, depth, and training duration as the observed feature distance continued to fall.

| Model   | Main change            | Project-specific feature distance | Main observation                          |
| ------- | ---------------------- | --------------------------------: | ----------------------------------------- |
| DCGAN-1 | Tanh baseline          |                           1846.67 | Noisy outputs and unstable loss behaviour |
| DCGAN-2 | Sigmoid output scaling |                             12.38 | Large improvement in recognizable digits  |
| DCGAN-3 | Larger kernels         |                              8.80 | Further visual improvement                |
| DCGAN-4 | Additional depth       |                              3.23 | Strongest 100-epoch result                |
| DCGAN-5 | 200 epochs             |                              2.29 | Lowest feature distance in the study      |

For a reproducible relative comparison, I generated 10,000 images per model with seed 42, embedded them and all 10,000 official MNIST test images using the 20-dimensional penultimate layer of the selected CNN-3 classifier, and calculated a Fréchet distance between those feature distributions. Lower is better within this project.

This is **not canonical FID**: it does not use InceptionV3, and the values must not be compared with published FID results. It is a narrow project-specific diagnostic that agrees with the visual progression from the failed DCGAN-1 to the stronger DCGAN-4 and DCGAN-5 outputs.

DCGAN-5 produced the strongest samples in this set. Because the configurations changed in sequence rather than as isolated ablations, the comparison cannot separate the effects of activation, scaling, kernel size, depth, and training duration.

```plotly
{% include plotly/image-generation/dcgan-feature-distance-comparison.json %}
```

<details markdown="1">
<summary><strong>DCGAN training curves</strong></summary>

```plotly
{% include plotly/image-generation/dcgan-1-training.json %}
```

```plotly
{% include plotly/image-generation/dcgan-2-training.json %}
```

```plotly
{% include plotly/image-generation/dcgan-3-training.json %}
```

```plotly
{% include plotly/image-generation/dcgan-4-training.json %}
```

```plotly
{% include plotly/image-generation/dcgan-5-training.json %}
```

```plotly
{% include plotly/image-generation/dcgan-training-time-comparison.json %}
```

</details>

## What the comparison supports

- The most useful classification result was not the single highest-accuracy point; it was realizing how often the simple CNN was the model I would actually choose.
- For generation, the strongest results appeared in later configurations that changed output scaling, architecture, and training time, but the experiment did not isolate their effects.
- Sample galleries and timing data expose differences that a headline accuracy or distance value cannot describe alone.
- The classifier results come from one deterministic split and seed. The generator metric uses a project-specific 20-dimensional representation and is not canonical FID.

MNIST made these comparisons inexpensive and inspectable. It does not establish that the same architecture ranking would hold for more complex image domains or different hardware.

## Architecture reference

<details markdown="1">
<summary><strong>Model architecture guide</strong></summary>

The 17 models were sequential configurations, not isolated ablations. This guide defines each name before the results use it.

### Classifiers

**CNN-1** is the baseline classifier: three convolutional layers followed by one fully connected output layer.

{% include figure.liquid loading="lazy" path="assets/img/projects/image-generation/CNN1.svg" title="CNN-1 architecture" alt="CNN-1 architecture with three convolutional layers and one fully connected output layer" class="img-fluid rounded z-depth-1" %}

**CNN-2** expands the baseline to five convolutional layers while keeping one fully connected output layer.

{% include figure.liquid loading="lazy" path="assets/img/projects/image-generation/CNN2.svg" title="CNN-2 architecture" alt="CNN-2 architecture with five convolutional layers and one fully connected output layer" class="img-fluid rounded z-depth-1" %}

**CNN-3** returns to three convolutional layers and expands the classifier head to three fully connected layers.

{% include figure.liquid loading="lazy" path="assets/img/projects/image-generation/CNN3.svg" title="CNN-3 architecture" alt="CNN-3 architecture with three convolutional layers and three fully connected layers" class="img-fluid rounded z-depth-1" %}

**FCNN-1** replaces the dense classifier head with global average pooling after three convolutional layers.

{% include figure.liquid loading="lazy" path="assets/img/projects/image-generation/FCNN1.svg" title="FCNN-1 architecture" alt="FCNN-1 architecture with three convolutional layers and global average pooling" class="img-fluid rounded z-depth-1" %}

**FCNN-2** uses five convolutional layers followed by global average pooling.

{% include figure.liquid loading="lazy" path="assets/img/projects/image-generation/FCNN2.svg" title="FCNN-2 architecture" alt="FCNN-2 architecture with five convolutional layers and global average pooling" class="img-fluid rounded z-depth-1" %}

**FCNN-3** uses three convolutional layers with 5 × 5 kernels, then global average pooling.

{% include figure.liquid loading="lazy" path="assets/img/projects/image-generation/FCNN3.svg" title="FCNN-3 architecture" alt="FCNN-3 architecture with three five-by-five convolutional layers and global average pooling" class="img-fluid rounded z-depth-1" %}

**FCNN-4** combines five convolutional layers, 5 × 5 kernels, and global average pooling.

{% include figure.liquid loading="lazy" path="assets/img/projects/image-generation/FCNN4.svg" title="FCNN-4 architecture" alt="FCNN-4 architecture with five five-by-five convolutional layers and global average pooling" class="img-fluid rounded z-depth-1" %}

### Convolutional variational autoencoders

All five CVAEs use a two-dimensional latent space. **CVAE-1** is the baseline, with three hidden convolutional stages in the encoder and decoder, a 100-unit connected layer around the latent representation, and a final decoder output layer.

{% include figure.liquid loading="lazy" path="assets/img/projects/image-generation/CVAE1.svg" title="CVAE-1 architecture" alt="CVAE-1 architecture with a three-stage convolutional path, a 100-unit connected layer, and a two-dimensional latent space" class="img-fluid rounded z-depth-1" %}

**CVAE-2** keeps the CVAE-1 convolutional path and increases the connected layer from 100 to 200 units.

{% include figure.liquid loading="lazy" path="assets/img/projects/image-generation/CVAE2.svg" title="CVAE-2 architecture" alt="CVAE-2 architecture with the baseline convolutional path, a 200-unit connected layer, and a two-dimensional latent space" class="img-fluid rounded z-depth-1" %}

**CVAE-3** expands the encoder and decoder to five hidden convolutional stages, followed by the decoder output layer, while keeping the two-dimensional latent space.

{% include figure.liquid loading="lazy" path="assets/img/projects/image-generation/CVAE3.svg" title="CVAE-3 architecture" alt="CVAE-3 architecture with deeper convolutional encoder and decoder paths and a two-dimensional latent space" class="img-fluid rounded z-depth-1" %}

**CVAE-4** keeps the baseline convolutional path and uses three hidden connected layers in the encoder, mirrored by three hidden connected layers in the decoder.

{% include figure.liquid loading="lazy" path="assets/img/projects/image-generation/CVAE4.svg" title="CVAE-4 architecture" alt="CVAE-4 architecture with three mirrored hidden connected layers on each side of a two-dimensional latent space" class="img-fluid rounded z-depth-1" %}

**CVAE-5** extends both connected paths to four hidden layers.

{% include figure.liquid loading="lazy" path="assets/img/projects/image-generation/CVAE5.svg" title="CVAE-5 architecture" alt="CVAE-5 architecture with four mirrored hidden connected layers on each side of a two-dimensional latent space" class="img-fluid rounded z-depth-1" %}

### Deep convolutional GANs

Each DCGAN pairs a generator with a discriminator. **DCGAN-1** is the three-stage baseline, with tanh generator output and MNIST scaled to [-1, 1].

{% include figure.liquid loading="lazy" path="assets/img/projects/image-generation/DCGAN1.svg" title="DCGAN-1 architecture" alt="DCGAN-1 generator and discriminator architecture with three convolutional stages and tanh output" class="img-fluid rounded z-depth-1" %}

**DCGAN-2** keeps the same three-stage architecture but uses sigmoid output and MNIST scaled to [0, 1].

{% include figure.liquid loading="lazy" path="assets/img/projects/image-generation/DCGAN2.svg" title="DCGAN-2 architecture" alt="DCGAN-2 generator and discriminator architecture with three convolutional stages and sigmoid output" class="img-fluid rounded z-depth-1" %}

**DCGAN-3** keeps sigmoid output and changes the convolution kernels to 5 × 5.

{% include figure.liquid loading="lazy" path="assets/img/projects/image-generation/DCGAN3.svg" title="DCGAN-3 architecture" alt="DCGAN-3 generator and discriminator architecture with five-by-five kernels and sigmoid output" class="img-fluid rounded z-depth-1" %}

**DCGAN-4** expands both the generator and discriminator to four convolutional stages.

{% include figure.liquid loading="lazy" path="assets/img/projects/image-generation/DCGAN4.svg" title="DCGAN-4 architecture" alt="DCGAN-4 generator and discriminator architecture with four convolutional stages" class="img-fluid rounded z-depth-1" %}

**DCGAN-5** uses the DCGAN-4 architecture and extends training from 100 to 200 epochs.

{% include figure.liquid loading="lazy" path="assets/img/projects/image-generation/DCGAN5.svg" title="DCGAN-5 architecture" alt="DCGAN-5 architecture matching DCGAN-4, with training extended to 200 epochs" class="img-fluid rounded z-depth-1" %}

</details>

## Code and retained evidence

The [public repository](https://github.com/LeonardoPaccianiMori/portfolio-image-generation) contains the code and audited evidence. The website repository retains the full model diagrams, training plots, latent-space grids, and generator galleries even where this appendix no longer embeds every asset.
