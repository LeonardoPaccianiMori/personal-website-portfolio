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
    Handwritten digits created by the best model developed in this project (DCGAN5)
</div>

**November - December 2024**

Ever since generative AI became popular in late 2022 with the first release of chatGPT and then the first text-to-image generators, I became deeply fascinated with generative AI. It was only natural then that when I started studying the basics of Machine Learning I also wanted to get started with generative AI. In particular, I wanted to understand how image generation works at a fundamental level, building the *actual* neural networks that create images from scratch. Unfortunately, since state-of-the-art image generation requires *a lot* of computational power (which was not available to me[^1]), I simply used the MNIST dataset for this project. It's not a very original choice, but I just wanted to get hands-on experience with image generation.

The project has two parts: first, training networks to *recognize* handwritten digits (classification), then training them to generate those images of handwritten digits (generation). I tested 7 different architectures for classification and multiple approaches for generation to see what actually works better.

Main finding: the simplest CNN model performed just as well as much more complex architectures, but trained ~30% faster. Turns out less really is more, sometimes.

## What I Built

### Part 1: Classification - Recognizing Digits

I tested 7 different neural network architectures (3 **C**onvolutional **N**eural **N**etworks and 4 **F**ully **C**onvolutional **N**eural **N**etworks) to see which one can achieve the highest classification accuracy with the shortest training time:

```plotly
{% include plotly/image-generation/accuracy-training-time-comparison.json %}
```
<div class="caption">
    Comparing 7 different neural network architectures. The simplest model (CNN-1) is actually the best choice!
</div>

The simplest model (CNN-1) hit 98% accuracy while training ~30% faster than the deeper networks. For such a relatively simple task, adding more layers didn't improve accuracy, it just made training slower.

### Part 2: Generation - Creating New Digits

For image generation, I tried building both [Variational Autoencoders](https://en.wikipedia.org/wiki/Variational_autoencoder) (VAEs) and [Generative Adversarial Network](https://en.wikipedia.org/wiki/Generative_adversarial_network). While VAEs could generate *some* digits realistically, they struggled with all 10. On the other hand, GANs could generate realistic digits after some tweaking (see also [this blog post](_posts/2025-01-10-gan-activation-functions.md)).

<div class="pswp-gallery d-flex flex-wrap justify-content-center" style="gap: 2px; max-width: 500px; margin: 0 auto;">
{% for i in (0..99) %}{% assign padded = i | prepend: '00' | slice: -3, 3 %}<a href="{{ 'assets/img/projects/image-generation/galleries/dcgan-5/img-' | append: padded | append: '.png' | relative_url }}" data-pswp-width="140" data-pswp-height="140" style="width: 48px;"><img src="{{ 'assets/img/projects/image-generation/galleries/dcgan-5/img-' | append: padded | append: '.png' | relative_url }}" alt="DCGAN-5 sample {{ i }}" style="width: 100%;" loading="lazy" /></a>{% endfor %}
</div>
<div class="caption">
    100 completely artificial handwritten digits, created by the best GAN model (DCGAN5). Click any image to zoom.
</div>

## What I Learned

The most important lesson: complexity for the sake of complexity doesn't help. The simplest CNN matched or beat the deeper networks while training way faster. That applies to both classification (where the simplest CNN was best) and generation (where simpler architectures converged better).

For GANs specifically, activation functions matter **a lot**: `sigmoid` worked way better `than` for the discriminator. Also, batch normalization helped stabilize training, which makes sense given how sensitive GANs are to parameter changes.

These techniques (VAEs and GANs) are the same ones used in modern image generators like DALL-E or Stable Diffusion, just scaled up ***massively*** with more data and compute power. The fundamentals are, however, identical.

## Technical deep dive
For the curious, here is a deeper dive into the more techical aspects of each part of this project:

<details markdown="1">
<summary><strong>Classification Models</strong></summary>

## Convolutional Neural Networks (CNNs)

I tested three CNN architectures to understand the impact of network depth and layer types on both classification accuracy and training time:

<details markdown="1">
<summary><strong>CNN-1 (Baseline)</strong></summary>

- **Architecture**: 3 convolutional layers + 1 fully connected layer
- **Performance**: 98% accuracy
- **Training Time**: 106s
- **Comments**: Starts slightly overfitting after epoch ~30

<div class="row">
    <div class="col-sm mt-3 mt-md-0">
        {% include figure.liquid loading="eager" path="assets/img/projects/image-generation/CNN1.png" title="CNN-1 architecture" class="img-fluid rounded z-depth-1" %}
    </div>
</div>

```plotly
{% include plotly/image-generation/cnn-1-training.json %}
```

</details>

<details markdown="1">
<summary><strong>CNN-2 (More Convolutional Layers)</strong></summary>

- **Architecture**: 5 convolutional layers + 1 fully connected layer
- **Performance**: 98.6% accuracy (best!)
- **Training Time**: 152s
- **Comments**: Less overfitting compared to CNN-1, and starting later (epoch ~60)

<div class="row">
    <div class="col-sm mt-3 mt-md-0">
        {% include figure.liquid loading="eager" path="assets/img/projects/image-generation/CNN2.png" title="CNN-2 architecture" class="img-fluid rounded z-depth-1" %}
    </div>
</div>

```plotly
{% include plotly/image-generation/cnn-2-training.json %}
```

</details>

<details markdown="1">
<summary><strong>CNN-3 (More Fully Connected Layers)</strong></summary>

- **Architecture**: 3 convolutional layers + 3 fully connected layers
- **Performance**: 98% accuracy
- **Training Time**: 110s
- **Comments**: Starts overfitting already at epoch ~10

<div class="row">
    <div class="col-sm mt-3 mt-md-0">
        {% include figure.liquid loading="eager" path="assets/img/projects/image-generation/CNN3.png" title="CNN-3 architecture" class="img-fluid rounded z-depth-1" %}
    </div>
</div>

```plotly
{% include plotly/image-generation/cnn-3-training.json %}
```
</details>

<details markdown="1">
<summary><strong>CNN comparison</strong></summary>
Here is the comparison of accuracies and training times for these 3 models:
```plotly
{% include plotly/image-generation/cnn-accuracy-comparison.json %}
```

```plotly
{% include plotly/image-generation/cnn-training-time-comparison.json %}
```
</details>

<details markdown="1">
<summary><strong>Conclusions</strong></summary>
Adding convolutional layers costs ~43% more time but adding FC layers only costs ~4% more. However, neither significantly improves accuracy, making CNN-1 the most efficient choice.
</details>

<br>
## Fully Convolutional Neural Networks (FCNNs)

Unlike CNNs, FCNNs use only convolutional layers (no fully connected layers at the end), and they use global pooling instead.

<details markdown="1">
<summary><strong>FCNN-1 (Baseline)</strong></summary>

- **Architecture**: 3 convolutional layers + global pooling
- **Performance**: 80% accuracy (lower than CNNs)
- **Training Time**: 103s
- **Comments**: Slower convergence compared to CNNs

<div class="row">
    <div class="col-sm mt-3 mt-md-0">
        {% include figure.liquid loading="eager" path="assets/img/projects/image-generation/FCNN1.png" title="FCNN-1 architecture" class="img-fluid rounded z-depth-1" %}
    </div>
</div>

```plotly
{% include plotly/image-generation/fcnn-1-training.json %}
```

</details>

<details markdown="1">
<summary><strong>FCNN-2 (More Layers)</strong></summary>

- **Architecture**: 5 convolutional layers + global pooling
- **Performance**: 87% accuracy
- **Training Time**: 134s
- **Comments**: Better than FCNN-1, but still below CNN performance

<div class="row">
    <div class="col-sm mt-3 mt-md-0">
        {% include figure.liquid loading="eager" path="assets/img/projects/image-generation/FCNN2.png" title="FCNN-2 architecture" class="img-fluid rounded z-depth-1" %}
    </div>
</div>

```plotly
{% include plotly/image-generation/fcnn-2-training.json %}
```

</details>

<details markdown="1">
<summary><strong>FCNN-3 (Larger Kernels)</strong></summary>

- **Architecture**: 3 convolutional layers (5×5 kernels) + global pooling
- **Performance**: 92% accuracy
- **Training Time**: 108s
- **Comments**: Kernel size matters more than depth for FCNNs

<div class="row">
    <div class="col-sm mt-3 mt-md-0">
        {% include figure.liquid loading="eager" path="assets/img/projects/image-generation/FCNN1.png" title="FCNN-3 architecture" class="img-fluid rounded z-depth-1" %}
    </div>
</div>

```plotly
{% include plotly/image-generation/fcnn-3-training.json %}
```

</details>

<details markdown="1">
<summary><strong>FCNN-4 (More Layers + Larger Kernels)</strong></summary>

- **Architecture**: 5 convolutional layers (5×5 kernels) + global pooling
- **Performance**: 98.6% accuracy (best FCNN!)
- **Training Time**: 130s
- **Comments**: Overfitting starts at epoch ~20; combining more layers with larger kernels achieves CNN-level performance (but with longer training time)

<div class="row">
    <div class="col-sm mt-3 mt-md-0">
        {% include figure.liquid loading="eager" path="assets/img/projects/image-generation/FCNN4.png" title="FCNN-4 architecture" class="img-fluid rounded z-depth-1" %}
    </div>
</div>

```plotly
{% include plotly/image-generation/fcnn-4-training.json %}
```
</details>

<details markdown="1">
<summary><strong>FCNN comparison</strong></summary>
Here is the comparison of accuracies and training times for these 4 models:
```plotly
{% include plotly/image-generation/fcnn-accuracy-comparison.json %}
```

```plotly
{% include plotly/image-generation/fcnn-training-time-comparison.json %}
```
</details>

<details markdown="1">
<summary><strong>Conclusions</strong></summary>
FCNNs can achieve CNN-level performance (~98.6% with FCNN-4), but require more layers and larger kernels to do so, and take longer times to train. CNNs remain simpler and faster for this task.
</details>

</details>

---

<details markdown="1">
<summary><strong>Generative Models</strong></summary>

## Convolutional Variational Autoencoders (CVAEs)

I tested 5 different architectures of CVAEs using a 2D latent space. Good separation in the latent space = good generation.

<details markdown="1">
<summary><strong>CVAE-1 (Baseline)</strong></summary>

- **Architecture**: 3 convolutional layers (encoder + decoder), 100-neuron hidden layer, 2D latent space
- **Median silhouette Score**: -0.01
- **Comments**: Marginal separation in latent space (only 0, 1, and 7 are clearly separated)

<div class="row">
    <div class="col-sm mt-3 mt-md-0">
        {% include figure.liquid loading="eager" path="assets/img/projects/image-generation/CVAE1.png" title="CVAE-1 architecture" class="img-fluid rounded z-depth-1" %}
    </div>
</div>

```plotly
{% include plotly/image-generation/cvae-1-training.json %}
```

```plotly
{% include plotly/image-generation/cvae-1-latent-space.json %}
```

The grid below shows what the decoder generates at cell centers across a 16×16 division of the latent space (z1: -2 to 13, z2: -3 to 15):

<div class="pswp-gallery d-flex flex-wrap justify-content-center" style="gap: 1px; max-width: 560px; margin: 0 auto;">
{% for row in (0..15) %}{% for col in (0..15) %}{% assign row_padded = row | prepend: '0' | slice: -2, 2 %}{% assign col_padded = col | prepend: '0' | slice: -2, 2 %}<a href="{{ 'assets/img/projects/image-generation/galleries/cvae-1-grid/grid-' | append: row_padded | append: '-' | append: col_padded | append: '.png' | relative_url }}" data-pswp-width="140" data-pswp-height="140" style="width: 34px;"><img src="{{ 'assets/img/projects/image-generation/galleries/cvae-1-grid/grid-' | append: row_padded | append: '-' | append: col_padded | append: '.png' | relative_url }}" alt="CVAE grid cell" style="width: 100%;" loading="lazy" /></a>{% endfor %}{% endfor %}
</div>
<div class="caption">
    16×16 grid of images generated by the CVAE-1 decoder across the latent space. Top-left is near (z1≈-1.5, z2≈14.4), bottom-right is near (z1≈12.5, z2≈-2.4). Click any image to zoom.
</div>

</details>

<details markdown="1">
<summary><strong>CVAE-2 (Larger Hidden Layer)</strong></summary>

- **Architecture**: Same as CVAE-1, but with 200-neuron hidden layer (2× baseline)
- **Median silhouette Score**: -0.06
- **Comments**: Even worse latent space separation than CVAE-1

```plotly
{% include plotly/image-generation/cvae-2-training.json %}
```

```plotly
{% include plotly/image-generation/cvae-2-latent-space.json %}
```

<div class="pswp-gallery d-flex flex-wrap justify-content-center" style="gap: 1px; max-width: 560px; margin: 0 auto;">
{% for row in (0..15) %}{% for col in (0..15) %}{% assign row_padded = row | prepend: '0' | slice: -2, 2 %}{% assign col_padded = col | prepend: '0' | slice: -2, 2 %}<a href="{{ 'assets/img/projects/image-generation/galleries/cvae-2-grid/grid-' | append: row_padded | append: '-' | append: col_padded | append: '.png' | relative_url }}" data-pswp-width="140" data-pswp-height="140" style="width: 34px;"><img src="{{ 'assets/img/projects/image-generation/galleries/cvae-2-grid/grid-' | append: row_padded | append: '-' | append: col_padded | append: '.png' | relative_url }}" alt="CVAE-2 grid cell" style="width: 100%;" loading="lazy" /></a>{% endfor %}{% endfor %}
</div>
<div class="caption">
    16×16 grid of images generated by the CVAE-2 decoder across the latent space (z1: -8 to 10, z2: -10 to 12). Click any image to zoom.
</div>

</details>

<details markdown="1">
<summary><strong>CVAE-3 (More Convolutional Layers)</strong></summary>

- **Architecture**: Same as CVAE-1, but with 5 convolutional layers (encoder + decoder) instead of 3
- **Median silhouette Score**: -0.07
- **Comments**: Still marginal separation in latent space (basically only 1 and 0 are neatly separated)

<div class="row">
    <div class="col-sm mt-3 mt-md-0">
        {% include figure.liquid loading="eager" path="assets/img/projects/image-generation/CVAE3.png" title="CVAE-3 architecture" class="img-fluid rounded z-depth-1" %}
    </div>
</div>

```plotly
{% include plotly/image-generation/cvae-3-training.json %}
```

```plotly
{% include plotly/image-generation/cvae-3-latent-space.json %}
```

<div class="pswp-gallery d-flex flex-wrap justify-content-center" style="gap: 1px; max-width: 560px; margin: 0 auto;">
{% for row in (0..15) %}{% for col in (0..15) %}{% assign row_padded = row | prepend: '0' | slice: -2, 2 %}{% assign col_padded = col | prepend: '0' | slice: -2, 2 %}<a href="{{ 'assets/img/projects/image-generation/galleries/cvae-3-grid/grid-' | append: row_padded | append: '-' | append: col_padded | append: '.png' | relative_url }}" data-pswp-width="140" data-pswp-height="140" style="width: 34px;"><img src="{{ 'assets/img/projects/image-generation/galleries/cvae-3-grid/grid-' | append: row_padded | append: '-' | append: col_padded | append: '.png' | relative_url }}" alt="CVAE-3 grid cell" style="width: 100%;" loading="lazy" /></a>{% endfor %}{% endfor %}
</div>
<div class="caption">
    16×16 grid of images generated by the CVAE-3 decoder across the latent space (z1: -3 to 3, z2: -3 to 3). Click any image to zoom.
</div>

</details>

<details markdown="1">
<summary><strong>CVAE-4 & CVAE-5 (More Fully Connected Layers)</strong></summary>

- **Architecture**: Same as CVAE-1, but with 3 or 4 (repectively) connected layers
- **Median silhouette Score**: 0.01 and -0.06
- **Comments**: Better latent space separation, but still incomplete (4, 7, 8 and 9 overlap with each other)

<div class="row">
    <div class="col-sm mt-3 mt-md-0">
        {% include figure.liquid loading="eager" path="assets/img/projects/image-generation/CVAE4.png" title="CVAE-4 architecture" class="img-fluid rounded z-depth-1" %}
    </div>
</div>

```plotly
{% include plotly/image-generation/cvae-4-training.json %}
```

```plotly
{% include plotly/image-generation/cvae-4-latent-space.json %}
```

<div class="pswp-gallery d-flex flex-wrap justify-content-center" style="gap: 1px; max-width: 560px; margin: 0 auto;">
{% for row in (0..15) %}{% for col in (0..15) %}{% assign row_padded = row | prepend: '0' | slice: -2, 2 %}{% assign col_padded = col | prepend: '0' | slice: -2, 2 %}<a href="{{ 'assets/img/projects/image-generation/galleries/cvae-4-grid/grid-' | append: row_padded | append: '-' | append: col_padded | append: '.png' | relative_url }}" data-pswp-width="140" data-pswp-height="140" style="width: 34px;"><img src="{{ 'assets/img/projects/image-generation/galleries/cvae-4-grid/grid-' | append: row_padded | append: '-' | append: col_padded | append: '.png' | relative_url }}" alt="CVAE-4 grid cell" style="width: 100%;" loading="lazy" /></a>{% endfor %}{% endfor %}
</div>
<div class="caption">
    16×16 grid of images generated by the CVAE-4 decoder across the latent space (z1: -2 to 14, z2: -3 to 16). Click any image to zoom.
</div>

</details>

<details markdown="1">
<summary><strong>CVAE comparison</strong></summary>
Here is the comparison of silhouette scores and training times for these 5 models:
```plotly
{% include plotly/image-generation/cvae-silhouette-comparison.json %}
```

```plotly
{% include plotly/image-generation/cvae-training-time-comparison.json %}
```
</details>

<details markdown="1">
<summary><strong>Conclusions</strong></summary>
CVAEs with 2D latent space struggle to separate all 10 digits, and increasing the model's complexity can actually make things *worse*. Using a latent space with a larger number of dimensions might help (but it was not tested in this project).
</details>

---

## Deep Convolutional Generative Adversarial Networks (DCGANs)

GANs use two competing networks:
- **Generator**: Creates fake images
- **Discriminator**: Tries to detect fakes

They improve through adversarial training, and in the end .

<details markdown="1">
<summary><strong>DCGAN-1 (Baseline with Tanh)</strong></summary>

- **Architecture**: 3 conv layers (generator + discriminator), `tanh` activation
- **Result**: Poor! Only 0s and 9s barely recognizable
- **Issue**: Discriminator plateaus, generator loss keeps increasing

```plotly
{% include plotly/image-generation/dcgan-1-training.json %}
```

<div class="pswp-gallery d-flex flex-wrap justify-content-center" style="gap: 2px; max-width: 500px; margin: 0 auto;">
{% for i in (0..99) %}{% assign padded = i | prepend: '00' | slice: -3, 3 %}<a href="{{ 'assets/img/projects/image-generation/galleries/dcgan-1/img-' | append: padded | append: '.png' | relative_url }}" data-pswp-width="140" data-pswp-height="140" style="width: 48px;"><img src="{{ 'assets/img/projects/image-generation/galleries/dcgan-1/img-' | append: padded | append: '.png' | relative_url }}" alt="DCGAN-1 sample {{ i }}" style="width: 100%;" loading="lazy" /></a>{% endfor %}
</div>
<div class="caption">
    100 digits generated by DCGAN-1. Click any image to zoom.
</div>

</details>

<details markdown="1">
<summary><strong>DCGAN-2 (Sigmoid Activation)</strong></summary>

- **Change**: `sigmoid` activation instead of `tanh`
- **Result**: Dramatic improvement! Losses oscillate healthily
- **Quality**: Most digits recognizable but still imperfect

```plotly
{% include plotly/image-generation/dcgan-2-training.json %}
```

**Key Insight**: Activation function choice is CRITICAL for GANs!

<div class="pswp-gallery d-flex flex-wrap justify-content-center" style="gap: 2px; max-width: 500px; margin: 0 auto;">
{% for i in (0..99) %}{% assign padded = i | prepend: '00' | slice: -3, 3 %}<a href="{{ 'assets/img/projects/image-generation/galleries/dcgan-2/img-' | append: padded | append: '.png' | relative_url }}" data-pswp-width="140" data-pswp-height="140" style="width: 48px;"><img src="{{ 'assets/img/projects/image-generation/galleries/dcgan-2/img-' | append: padded | append: '.png' | relative_url }}" alt="DCGAN-2 sample {{ i }}" style="width: 100%;" loading="lazy" /></a>{% endfor %}
</div>
<div class="caption">
    100 digits generated by DCGAN-2. Click any image to zoom.
</div>

</details>

<details markdown="1">
<summary><strong>DCGAN-3 (Larger Kernels)</strong></summary>

- **Change**: 5×5 kernels (from 3×3), keeping sigmoid
- **Result**: Significant quality improvement, all 10 digits recognizable!
- **Training Time**: Minimal increase

```plotly
{% include plotly/image-generation/dcgan-3-training.json %}
```

<div class="pswp-gallery d-flex flex-wrap justify-content-center" style="gap: 2px; max-width: 500px; margin: 0 auto;">
{% for i in (0..99) %}{% assign padded = i | prepend: '00' | slice: -3, 3 %}<a href="{{ 'assets/img/projects/image-generation/galleries/dcgan-3/img-' | append: padded | append: '.png' | relative_url }}" data-pswp-width="140" data-pswp-height="140" style="width: 48px;"><img src="{{ 'assets/img/projects/image-generation/galleries/dcgan-3/img-' | append: padded | append: '.png' | relative_url }}" alt="DCGAN-3 sample {{ i }}" style="width: 100%;" loading="lazy" /></a>{% endfor %}
</div>
<div class="caption">
    100 digits generated by DCGAN-3. Click any image to zoom.
</div>

</details>

<details markdown="1">
<summary><strong>DCGAN-4 (More Layers)</strong></summary>

- **Change**: 4 conv layers (generator + discriminator)
- **Result**: Best quality! All digits clear, fewer artifacts
- **Training Time**: Significantly longer, but worth it

```plotly
{% include plotly/image-generation/dcgan-4-training.json %}
```

<div class="pswp-gallery d-flex flex-wrap justify-content-center" style="gap: 2px; max-width: 500px; margin: 0 auto;">
{% for i in (0..99) %}{% assign padded = i | prepend: '00' | slice: -3, 3 %}<a href="{{ 'assets/img/projects/image-generation/galleries/dcgan-4/img-' | append: padded | append: '.png' | relative_url }}" data-pswp-width="140" data-pswp-height="140" style="width: 48px;"><img src="{{ 'assets/img/projects/image-generation/galleries/dcgan-4/img-' | append: padded | append: '.png' | relative_url }}" alt="DCGAN-4 sample {{ i }}" style="width: 100%;" loading="lazy" /></a>{% endfor %}
</div>
<div class="caption">
    100 digits generated by DCGAN-4. Click any image to zoom.
</div>

</details>

<details markdown="1">
<summary><strong>DCGAN-5 (Extended Training)</strong></summary>

- **Change**: 200 epochs (from 100), same architecture as DCGAN-4
- **Result**: Best FID score of all models (117.3 vs DCGAN-4's 153.5)! Sharper edges, more consistent digits
- **Training Time**: ~113 minutes (doubled from DCGAN-4, but with significant quality gains)

```plotly
{% include plotly/image-generation/dcgan-5-training.json %}
```

<div class="pswp-gallery d-flex flex-wrap justify-content-center" style="gap: 2px; max-width: 500px; margin: 0 auto;">
{% for i in (0..99) %}{% assign padded = i | prepend: '00' | slice: -3, 3 %}<a href="{{ 'assets/img/projects/image-generation/galleries/dcgan-5/img-' | append: padded | append: '.png' | relative_url }}" data-pswp-width="140" data-pswp-height="140" style="width: 48px;"><img src="{{ 'assets/img/projects/image-generation/galleries/dcgan-5/img-' | append: padded | append: '.png' | relative_url }}" alt="DCGAN-5 sample {{ i }}" style="width: 100%;" loading="lazy" /></a>{% endfor %}
</div>
<div class="caption">
    100 digits generated by DCGAN-5 (best model). This is the same gallery shown at the top of this page. Click any image to zoom.
</div>

</details>

**Final Model**: DCGAN-5 produces the highest-quality generated images based on FID score!

```plotly
{% include plotly/image-generation/dcgan-fid-comparison.json %}
```

```plotly
{% include plotly/image-generation/dcgan-training-time-comparison.json %}
```

</details>

---

## Try It Yourself

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
<div class="caption">
    Click or drag anywhere in the latent space to generate a digit. The red X marker shows the current position. Colors indicate the digit class of each encoded point.
</div>
<script src="{{ '/assets/js/cvae-explorer.js' | relative_url }}"></script>


Generate your own handwritten digits using DCGAN-5 (the best model)! Select a digit and click Generate to create a new image.

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

**Note**: This uses DCGAN-5 with pre-discovered "seed vectors" - noise inputs that reliably produce each digit class. This technique (latent space inversion) allows you to choose which digit to create, similar to a Conditional GAN but using the same unconditional DCGAN architecture from above.

---

## View the Code

All code for this project is available on [GitHub](https://github.com/LeonardoPaccianiMori/image-generation).

The code is shared to demonstrate:
- Programming skills and clean code practices
- Systematic experimentation methodology
- Technical implementation abilities

**Note**: Due to computational constraints (personal laptop), models here are simpler than state-of-the-art systems. However, the principles scale to more complex architectures.

---

[^1]: This project was executed on my personal laptop, a [System76 Kudu](https://tech-docs.system76.com/models/kudu6/README.html).