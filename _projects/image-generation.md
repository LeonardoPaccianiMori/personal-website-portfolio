---
layout: page
title: Teaching Computers to Create Images
description: Exploring how neural networks learn to generate handwritten digits
img: assets/img/projects/image-generation/image-generation-thumbnail.png
importance: 2
category: portfolio
---

<div class="row justify-content-sm-center">
    <div class="col-sm-6 mt-3 mt-md-0">
        {% include figure.liquid loading="eager" path="assets/img/projects/image-generation/image-generation-thumbnail.png" title="Generated digits" class="img-fluid rounded z-depth-1" %}
    </div>
</div>
<div class="caption">
    Handwritten digits created by the best model developed in this project
</div>

**November - December 2024**

I wanted to understand how image generation works at a fundamental level, building the actual neural networks that create images from scratch. Unfortunately, since image generation requires a lot of computational power and at the time when I was working on this project I only had my personal laptop available, I simply used the MNIST dataset. It's not a very original choice, but I just wanted to get hands-on experience with image generation.

The project has two parts: first, training networks to recognize handwritten digits (classification), then training them to generate brand new digits that never existed (generation). I tested 7 different architectures for classification and multiple approaches for generation to see what actually works.

Main finding: the simplest CNN model performed just as well as much more complex architectures, but trained 60% faster. Turns out more layers doesn't always mean better results.

## What I Built

### Part 1: Classification - Recognizing Digits

I tested 7 different neural network architectures to see which one best recognizes handwritten digits:

<div class="row">
    <div class="col-sm mt-3 mt-md-0">
        {% include figure.liquid loading="eager" path="assets/img/projects/image-generation/Accuracy-and-training-time-comparison.png" title="Model comparison" class="img-fluid rounded z-depth-1" %}
    </div>
</div>
<div class="caption">
    Comparing 7 different neural network architectures. The simplest model (CNN-1) is actually the best choice!
</div>

The simplest model (CNN-1) hit 98% accuracy in half the training time of the deeper networks. For such a relatively simple task, adding more layers didn't improve accuracy, it just made training slower.

### Part 2: Generation - Creating New Digits

This is the harder part: instead of just recognizing digits, can we generate brand new ones?

I tried two approaches:

**Variational Autoencoders (VAEs)**
These work by compressing a digit into a "compressed" representation and then reconstructing it. The idea is that once the network learns this representation, you can sample random points to generate new digits. Problem: the models struggled to generate all 10 digits clearly.

**Generative Adversarial Networks (GANs)**
Two networks compete: one (generator) creates fake digits, the other (discriminator) tries to spot fakes. They improve through competition: the generator gets better at faking, the discriminator gets better at detecting. After tuning hyperparameters (especially switching from `tanh` to `sigmoid` activation), the GAN created realistic digits for all 10 numbers.

<div class="row justify-content-sm-center">
    <div class="col-sm-8 mt-3 mt-md-0">
        {% include figure.liquid loading="eager" path="assets/img/projects/image-generation/DCGAN4-examples.png" title="Generated digits grid" class="img-fluid rounded z-depth-1" %}
    </div>
</div>
<div class="caption">
    100 completely artificial handwritten digits, created by the best GAN model
</div>

## What I Learned

The biggest lesson: complexity for the sake of complexity doesn't help. The simplest CNN matched or beat the deeper networks while training way faster. That applies to both classification (where CNN-1 was best) and generation (where simpler architectures converged better).

For GANs specifically, activation functions matter **a lot**: `sigmoid` worked way better `than` for the discriminator. Also, batch normalization helped stabilize training, which makes sense given how sensitive GANs are to parameter changes.

These techniques (VAEs and GANs) are the same ones used in modern image generators like DALL-E or Stable Diffusion, just scaled up **massively** with more data and compute. The fundamentals are identical.

---

<details markdown="1">
<summary><strong>Classification Models</strong></summary>

## Convolutional Neural Networks (CNNs)

I tested three CNN architectures to understand the impact of network depth and layer types:

### CNN-1 (Baseline)
- **Architecture**: 3 convolutional layers + 1 fully connected layer
- **Performance**: 98% accuracy
- **Training Time**: Baseline (100 epochs)

<div class="row">
    <div class="col-sm mt-3 mt-md-0">
        {% include figure.liquid loading="eager" path="assets/img/projects/image-generation/CNN1.png" title="CNN 1 architecture" class="img-fluid rounded z-depth-1" %}
    </div>
</div>

<div class="row">
    <div class="col-sm mt-3 mt-md-0">
        {% include figure.liquid loading="eager" path="assets/img/projects/image-generation/CNN1-training.png" title="CNN 1 training" class="img-fluid rounded z-depth-1" %}
    </div>
</div>

### CNN-2 (More Convolutional Layers)
- **Architecture**: 5 convolutional layers + 1 fully connected layer
- **Performance**: 98.6% accuracy (best!)
- **Training Time**: +60% vs baseline
- **Overfitting**: Starts around epoch 40

<div class="row">
    <div class="col-sm mt-3 mt-md-0">
        {% include figure.liquid loading="eager" path="assets/img/projects/image-generation/CNN2-training.png" title="CNN 2 training" class="img-fluid rounded z-depth-1" %}
    </div>
</div>

### CNN-3 (More Fully Connected Layers)
- **Architecture**: 3 convolutional layers + 3 fully connected layers
- **Performance**: 98% accuracy
- **Training Time**: +10% vs baseline
- **Overfitting**: Starts around epoch 15 (earliest!)

**Conclusion**: Adding convolutional layers costs 60% more time but adding FC layers only costs 10% more. However, neither significantly improves accuracy, making CNN-1 the most efficient choice.

---

## Fully Convolutional Neural Networks (FCNNs)

Unlike CNNs, FCNNs use only convolutional layers (no fully connected layers at the end). They use global pooling instead.

### FCNN-1 (Baseline)
- **Architecture**: 3 convolutional layers + global pooling
- **Performance**: ~96% accuracy (lower than CNNs)
- **Observation**: Slower convergence

### FCNN-2 (More Layers)
- **Architecture**: 5 convolutional layers + global pooling
- **Performance**: ~97% accuracy
- **Improvement**: Better than FCNN-1, approaching CNN performance

### FCNN-3 (Larger Kernels)
- **Architecture**: 3 convolutional layers (5×5 kernels) + global pooling
- **Performance**: ~97.5% accuracy (best FCNN!)
- **Key Insight**: Kernel size matters more than depth for FCNNs

### FCNN-4 (More Layers + Larger Kernels)
- **Architecture**: 5 convolutional layers (5×5 kernels) + global pooling
- **Performance**: ~97% accuracy
- **Overfitting**: Starts around epoch 20
- **Observation**: Diminishing returns from added complexity

<div class="row">
    <div class="col-sm mt-3 mt-md-0">
        {% include figure.liquid loading="eager" path="assets/img/projects/image-generation/FCNN-accuracy-comparison.png" title="FCNN comparison" class="img-fluid rounded z-depth-1" %}
    </div>
</div>

**Conclusion**: FCNNs can achieve competitive performance (~97.5%) but CNNs are simpler and faster for this task.

</details>

---

<details markdown="1">
<summary><strong>Generative Models</strong></summary>

## Convolutional Variational Autoencoders (CVAEs)

CVAEs learn to compress images into a "latent space" (2D in our case) and then reconstruct them. Good separation in the latent space = good generation.

### CVAE-1 (Baseline)
- **Architecture**: 3 conv layers (encoder + decoder), 100-neuron hidden layer, 2D latent space
- **Latent Space Separation**: Marginal (only 0, 1, 3, 7, 9 clearly separated)
- **Silhouette Score**: ~0.15

<div class="row">
    <div class="col-sm mt-3 mt-md-0">
        {% include figure.liquid loading="eager" path="assets/img/projects/image-generation/CVAE1-latent-space-implicit.png" title="CVAE 1 latent space" class="img-fluid rounded z-depth-1" %}
    </div>
</div>

<div class="row">
    <div class="col-sm mt-3 mt-md-0">
        {% include figure.liquid loading="eager" path="assets/img/projects/image-generation/CVAE1-latent-space-explicit.png" title="CVAE 1 generation" class="img-fluid rounded z-depth-1" %}
    </div>
</div>

### CVAE-2 (Larger Hidden Layer)
- **Change**: 200-neuron hidden layer (2× baseline)
- **Result**: Similar performance to CVAE-1

### CVAE-3 (More Convolutional Layers)
- **Change**: 5 conv layers (encoder + decoder)
- **Result**: Slight improvement, some digits (like 5) now visible

### CVAE-4 & CVAE-5 (More Fully Connected Layers)
- **Change**: 3-4 fully connected layers
- **Result**: Moderate improvement, but still incomplete digit separation

<div class="row">
    <div class="col-sm mt-3 mt-md-0">
        {% include figure.liquid loading="eager" path="assets/img/projects/image-generation/CVAE-silhouette-comparison.png" title="CVAE comparison" class="img-fluid rounded z-depth-1" %}
    </div>
</div>

**Conclusion**: CVAEs with 2D latent space struggle to separate all 10 digits. Higher-dimensional latent space might help, but GANs perform better for this task.

---

## Deep Convolutional Generative Adversarial Networks (DCGANs)

GANs use two competing networks:
- **Generator**: Creates fake images
- **Discriminator**: Tries to detect fakes

They improve through adversarial training.

### DCGAN-1 (Baseline with Tanh)
- **Architecture**: 3 conv layers (generator + discriminator), `tanh` activation
- **Result**: Poor! Only 0s and 9s barely recognizable
- **Issue**: Discriminator plateaus, generator loss keeps increasing

<div class="row">
    <div class="col-sm mt-3 mt-md-0">
        {% include figure.liquid loading="eager" path="assets/img/projects/image-generation/DCGAN1-training.png" title="DCGAN 1 training" class="img-fluid rounded z-depth-1" %}
    </div>
</div>

<div class="row">
    <div class="col-sm mt-3 mt-md-0">
        {% include figure.liquid loading="eager" path="assets/img/projects/image-generation/DCGAN1-examples.png" title="DCGAN 1 examples" class="img-fluid rounded z-depth-1" %}
    </div>
</div>

### DCGAN-2 (Sigmoid Activation)
- **Change**: `sigmoid` activation instead of `tanh`
- **Result**: Dramatic improvement! Losses oscillate healthily
- **Quality**: Most digits recognizable but still imperfect

<div class="row">
    <div class="col-sm mt-3 mt-md-0">
        {% include figure.liquid loading="eager" path="assets/img/projects/image-generation/DCGAN2-training.png" title="DCGAN 2 training" class="img-fluid rounded z-depth-1" %}
    </div>
</div>

**Key Insight**: Activation function choice is CRITICAL for GANs!

### DCGAN-3 (Larger Kernels)
- **Change**: 5×5 kernels (from 3×3), keeping sigmoid
- **Result**: Significant quality improvement, all 10 digits recognizable!
- **Training Time**: Minimal increase

<div class="row">
    <div class="col-sm mt-3 mt-md-0">
        {% include figure.liquid loading="eager" path="assets/img/projects/image-generation/DCGAN3-examples.png" title="DCGAN 3 examples" class="img-fluid rounded z-depth-1" %}
    </div>
</div>

### DCGAN-4 (More Layers)
- **Change**: 4 conv layers (generator + discriminator)
- **Result**: Best quality! All digits clear, fewer artifacts
- **Training Time**: Significantly longer, but worth it

<div class="row">
    <div class="col-sm mt-3 mt-md-0">
        {% include figure.liquid loading="eager" path="assets/img/projects/image-generation/DCGAN4-training.png" title="DCGAN 4 training" class="img-fluid rounded z-depth-1" %}
    </div>
</div>

**Final Model**: DCGAN-4 produces the highest-quality generated images!

<div class="row">
    <div class="col-sm mt-3 mt-md-0">
        {% include figure.liquid loading="eager" path="assets/img/projects/image-generation/DCGAN-training-time-comparison.png" title="DCGAN training time" class="img-fluid rounded z-depth-1" %}
    </div>
</div>

</details>

---

## View the Code

All code for this project is available on [GitHub](https://github.com/LeonardoPaccianiMori/image-generation).

The code is shared to demonstrate:
- Programming skills and clean code practices
- Systematic experimentation methodology
- Technical implementation abilities

**Note**: Due to computational constraints (personal laptop), models here are simpler than state-of-the-art systems. However, the principles scale to more complex architectures.

---