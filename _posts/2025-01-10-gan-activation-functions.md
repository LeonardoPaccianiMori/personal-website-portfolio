---
layout: post
title: "Activation Functions Killed My GAN: A Debugging Story"
date: 2025-01-10 14:00:00
description: How changing one line of code (tanh → sigmoid) took my GAN from complete failure to generating realistic digits
tags: deep-learning GAN debugging
categories: data-science
thumbnail: assets/img/projects/image-generation/image-generation-thumbnail.png
featured: true
---

## The Goal: Generate Handwritten Digits with GANs

For my [Image Generation project](/projects/image-generation/), I wanted to train a Deep Convolutional GAN (DCGAN) to generate realistic handwritten digits from the MNIST dataset.

**The architecture** was straightforward:
- **Generator**: Takes random noise → Produces 28×28 digit images
- **Discriminator**: Takes images → Classifies as real or fake
- **Training**: Adversarial process where both networks improve

I followed the standard DCGAN architecture from the [original paper](https://arxiv.org/abs/1511.06434), implemented it carefully in TensorFlow/Keras, and hit train.

**The result?** Complete garbage.

<div class="row">
    <div class="col-sm mt-3 mt-md-0">
        {% include figure.liquid loading="eager" path="assets/img/projects/image-generation/DCGAN1-examples.png" title="DCGAN-1 failed outputs" class="img-fluid rounded z-depth-1" %}
    </div>
</div>
<div class="caption">
    DCGAN-1 results: Only vague shapes resembling 0s and 9s. Everything else is noise.
</div>

After 100 epochs of training, the generator could *barely* produce recognizable 0s and 9s. Everything else looked like static.

**This post is the story of how I debugged this failure** and discovered that a single activation function choice was sabotaging everything.

---

## DCGAN-1: The "By-the-Book" Implementation

### Architecture

I followed the DCGAN guidelines religiously:

**Generator:**
```python
def build_generator():
    model = Sequential([
        Dense(7 * 7 * 128, input_dim=100),
        Reshape((7, 7, 128)),

        Conv2DTranspose(128, (3, 3), strides=2, padding='same'),
        BatchNormalization(),
        LeakyReLU(alpha=0.2),

        Conv2DTranspose(64, (3, 3), strides=2, padding='same'),
        BatchNormalization(),
        LeakyReLU(alpha=0.2),

        Conv2DTranspose(1, (3, 3), strides=1, padding='same'),
        Activation('tanh')  # ← THE PROBLEM WAS HERE
    ])
    return model
```

**Discriminator:**
```python
def build_discriminator():
    model = Sequential([
        Conv2D(64, (3, 3), strides=2, padding='same', input_shape=(28, 28, 1)),
        LeakyReLU(alpha=0.2),

        Conv2D(128, (3, 3), strides=2, padding='same'),
        BatchNormalization(),
        LeakyReLU(alpha=0.2),

        Flatten(),
        Dense(1, activation='sigmoid')
    ])
    return model
```

**Training setup:**
- Optimizer: Adam (lr=0.0002, beta_1=0.5)
- Loss: Binary crossentropy
- Batch size: 128
- Epochs: 100

All standard choices from DCGAN papers and tutorials.

### Training Behavior: Red Flags Everywhere

<div class="row">
    <div class="col-sm mt-3 mt-md-0">
        {% include figure.liquid loading="eager" path="assets/img/projects/image-generation/DCGAN1-training.png" title="DCGAN-1 training curves" class="img-fluid rounded z-depth-1" %}
    </div>
</div>
<div class="caption">
    DCGAN-1 training curves showing discriminator plateauing and generator loss diverging.
</div>

**What I observed:**
- **Discriminator loss**: Quickly dropped to ~0.1 and plateaued
- **Generator loss**: Steadily increased throughout training
- **Generated images**: Barely improved after epoch 20

**Classic signs of:**
- Generator couldn't fool discriminator at all
- Discriminator became "too good" too fast
- Training collapsed into a failure mode

### Initial Hypotheses (All Wrong)

I tried everything I could think of:

1. **Learning rate tweaking**
   - Tried 0.0001, 0.00005, 0.0003
   - Result: No meaningful improvement

2. **Label smoothing**
   - Used 0.9 instead of 1.0 for "real" labels
   - Result: Slightly more stable, still terrible output

3. **Discriminator regularization**
   - Added dropout
   - Reduced discriminator training steps (1 D update per 2 G updates)
   - Result: Marginally better, but fundamentally broken

4. **More data augmentation**
   - Random shifts, rotations
   - Result: No change

5. **Architecture changes**
   - More/fewer filters
   - Different kernel sizes
   - Result: Same problem persists

**Nothing worked.** I was stuck with a GAN that could barely generate two digits out of ten.

---

## The Breakthrough: One Line of Code

After days of frustration, I decided to question **every single architectural choice**, including the ones that seemed "obviously correct."

One thing caught my eye: **Why `tanh` activation in the generator output?**

**The standard reasoning:**
- DCGAN paper uses `tanh`
- `tanh` outputs [-1, 1] range
- MNIST images are normalized to [-1, 1]
- Seems logical, right?

But then I thought: **What if the problem is actually the activation function?**

### DCGAN-2: The One-Line Change

I changed **exactly one line**:

```python
# Before (DCGAN-1)
Conv2DTranspose(1, (3, 3), strides=1, padding='same'),
Activation('tanh')

# After (DCGAN-2)
Conv2DTranspose(1, (3, 3), strides=1, padding='same'),
Activation('sigmoid')  # ← CHANGED THIS
```

And re-normalized the input images to [0, 1] instead of [-1, 1].

**Everything else stayed the same**: architecture, optimizer, hyperparameters, training procedure.

### The Results: Night and Day Difference

<div class="row">
    <div class="col-sm mt-3 mt-md-0">
        {% include figure.liquid loading="eager" path="assets/img/projects/image-generation/DCGAN2-training.png" title="DCGAN-2 training curves" class="img-fluid rounded z-depth-1" %}
    </div>
</div>
<div class="caption">
    DCGAN-2 training curves showing healthy oscillation between generator and discriminator losses.
</div>

**Training behavior:**
- ✅ **Losses oscillate healthily** - Neither network dominates
- ✅ **Generator loss stays bounded** - No divergence
- ✅ **Discriminator challenged** - Accuracy hovers around 70-80%
- ✅ **Visible improvement** - Images get better every 10 epochs

<div class="row">
    <div class="col-sm mt-3 mt-md-0">
        {% include figure.liquid loading="eager" path="assets/img/projects/image-generation/DCGAN2-examples.png" title="DCGAN-2 outputs" class="img-fluid rounded z-depth-1" %}
    </div>
</div>
<div class="caption">
    DCGAN-2 results: Most digits (0-9) are now recognizable! Not perfect, but a massive improvement.
</div>

**Generated images:**
- ✅ All 10 digits visible (0-9)
- ✅ Recognizable handwritten style
- ⚠️ Still some artifacts and unclear digits
- ⚠️ Quality varies across different digits

**Bottom line:** Changing `tanh` → `sigmoid` transformed a complete failure into a working GAN.

---

## Why Did This Work? The Technical Explanation

### The Problem with Tanh

`tanh` activation outputs values in **[-1, 1]**.

**Issues for image generation:**

1. **Saturation at extremes**
   - For very dark pixels (0 in [0, 1] scale), generator needs to output -1
   - For very bright pixels (1 in [0, 1] scale), generator needs to output +1
   - Both are at the extremes where `tanh` gradient vanishes

2. **Gradient flow problems**
   - When generator output saturates (near -1 or +1), gradient ≈ 0
   - Generator can't learn effectively
   - Discriminator wins easily because generator is "stuck"

3. **Training dynamics**
   - Early in training, generator outputs random noise around 0
   - To produce valid images, needs to push outputs to extremes (-1 or +1)
   - This is hard because of saturation issues
   - Generator gets "trapped" producing mediocre outputs

### Why Sigmoid Works Better

`sigmoid` activation outputs values in **[0, 1]**.

**Advantages for this task:**

1. **Direct mapping to pixel values**
   - Output 0.0 → Black pixel (0)
   - Output 1.0 → White pixel (255 after scaling)
   - No need for range transformation

2. **Better gradient flow**
   - Black pixels (0) don't require extreme saturation
   - Generator can comfortably output 0.01 (nearly black) with good gradients
   - White pixels (1) similarly accessible

3. **Easier optimization**
   - Generator can make incremental progress
   - Discriminator doesn't immediately dominate
   - Training reaches equilibrium naturally

### A Note on "Best Practices"

**Why do DCGAN papers use `tanh`?**

Many DCGAN implementations use `tanh` because:
- The original DCGAN paper used it
- Works well for some datasets (ImageNet, CelebA with careful tuning)
- Historical momentum (everyone copies it)

**But it's not universal.**

For MNIST specifically, with its high-contrast black-and-white images, `sigmoid` is actually better suited.

**Lesson:** Question "best practices" when they don't work for your specific problem.

---

## Further Improvements: DCGAN-3 and DCGAN-4

After fixing the activation function, I made two more improvements:

### DCGAN-3: Larger Kernels (3×3 → 5×5)

```python
Conv2DTranspose(128, (5, 5), strides=2, padding='same'),  # Was (3, 3)
```

**Result:**
- ✅ **Smoother images** - Less pixelation
- ✅ **Better digit quality** - All 10 digits clearly visible
- ✅ **Training time** - Only ~10% longer

<div class="row">
    <div class="col-sm mt-3 mt-md-0">
        {% include figure.liquid loading="eager" path="assets/img/projects/image-generation/DCGAN3-examples.png" title="DCGAN-3 outputs" class="img-fluid rounded z-depth-1" %}
    </div>
</div>
<div class="caption">
    DCGAN-3 with 5×5 kernels: Noticeably smoother and more realistic digits.
</div>

### DCGAN-4: One More Convolutional Layer

Added a 4th convolutional layer to both generator and discriminator:

**Result:**
- ✅ **Best quality yet** - Sharpest, most realistic digits
- ✅ **Fewer artifacts** - Cleaner backgrounds
- ⚠️ **Longer training** - ~40% more time per epoch

<div class="row">
    <div class="col-sm mt-3 mt-md-0">
        {% include figure.liquid loading="eager" path="assets/img/projects/image-generation/DCGAN4-examples.png" title="DCGAN-4 outputs" class="img-fluid rounded z-depth-1" %}
    </div>
</div>
<div class="caption">
    DCGAN-4 (final model): 100 generated digits showing consistent quality across all numbers 0-9.
</div>

---

## Side-by-Side Comparison

| **Model** | **Key Change** | **Digits Recognizable** | **Quality Rating** | **Training Time** |
|-----------|----------------|-------------------------|---------------------|-------------------|
| DCGAN-1 | Baseline (tanh) | 2/10 (only 0, 9) | ⭐ | 100% (baseline) |
| DCGAN-2 | **tanh → sigmoid** | 10/10 | ⭐⭐⭐ | 100% |
| DCGAN-3 | Larger kernels | 10/10 | ⭐⭐⭐⭐ | 110% |
| DCGAN-4 | +1 conv layer | 10/10 | ⭐⭐⭐⭐⭐ | 140% |

**The activation function change (DCGAN-1 → DCGAN-2) was the critical breakthrough.** Everything else was incremental improvement.

---

## Lessons Learned

### 1. One Line of Code Can Make or Break Your Model

I spent days tweaking hyperparameters, adjusting learning rates, modifying architectures. **None of it mattered** until I fixed the activation function.

**Takeaway:** When debugging, don't just tune; question fundamental architectural choices.

### 2. "Best Practices" Are Context-Dependent

Using `tanh` for GAN generators is common advice, but it wasn't right for my specific task (MNIST digit generation).

**Takeaway:** Understand *why* a best practice exists, not just *what* it is. Adapt to your problem.

### 3. Training Curves Tell a Story

The DCGAN-1 training curves clearly showed:
- Discriminator plateauing (too easy)
- Generator loss diverging (can't improve)

I should have recognized this pattern earlier as **a fundamental architecture problem**, not just a hyperparameter issue.

**Takeaway:** Learn to read training curves. Divergence often means architectural mismatch.

### 4. Systematic Experimentation Pays Off

After the initial failures, I created a methodical testing framework:
1. Change ONE thing at a time
2. Train for 100 epochs
3. Compare training curves + generated samples
4. Document results

**This process led me to the solution.**

**Takeaway:** When stuck, slow down and experiment systematically.

### 5. GANs Are Sensitive

GANs are notoriously finicky. Small changes can have dramatic effects:
- Activation function: Failure → Success
- Kernel size: OK → Great
- One more layer: Great → Excellent

**Takeaway:** Don't give up on GANs too quickly. A small tweak might unlock everything.

---

## Code & Resources

Full implementation in my [Image Generation repository](https://github.com/LeonardoPaccianiMori/image-generation):
- `notebooks/dcgan_experiments.ipynb` - All 4 DCGAN variations
- `models/dcgan_final.py` - Best-performing model (DCGAN-4)

**Related posts:**
- [Full Image Generation Project](/projects/image-generation/) - Context and other models (VAEs, CNNs)

**Recommended reading:**
- [Original DCGAN Paper](https://arxiv.org/abs/1511.06434)
- [GAN Training Tips](https://github.com/soumith/ganhacks) - Community best practices

---

## Key Takeaways

1. **Activation functions matter more than you think** - One change (tanh → sigmoid) can transform results
2. **Debug systematically** - Change one variable at a time, document everything
3. **Training curves reveal architectural problems** - Learn to recognize unhealthy patterns
4. **Question "best practices"** - What works for ImageNet might not work for MNIST
5. **Small architectural tweaks compound** - Activation + kernels + depth = big improvement

Have you debugged a stubborn model and found a surprising fix? What was your "one line of code" moment? Let me know in the comments!

---

## Appendix: Full Training Parameters

For reproducibility, here are the exact settings for DCGAN-4 (final model):

```python
# Architecture
generator_layers = 4
discriminator_layers = 4
kernel_size = (5, 5)
latent_dim = 100

# Training
optimizer = Adam(learning_rate=0.0002, beta_1=0.5)
batch_size = 128
epochs = 100

# Data preprocessing
image_range = [0, 1]  # Sigmoid output
normalization = 'min-max'  # Not mean-std

# Activation functions
generator_output = 'sigmoid'  # KEY CHOICE
generator_hidden = LeakyReLU(alpha=0.2)
discriminator_hidden = LeakyReLU(alpha=0.2)
discriminator_output = 'sigmoid'
```
