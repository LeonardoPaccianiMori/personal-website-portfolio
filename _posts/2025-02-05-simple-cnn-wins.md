---
layout: post
title: "When Simpler Models Win: Comparing 7 CNN Architectures"
date: 2025-02-05 11:00:00
description: Testing 7 different neural network architectures taught me that more layers doesn't mean better results—sometimes the baseline is the best choice
tags: deep-learning CNN optimization
categories: data-science
thumbnail: assets/img/blog/cnn-comparison/thumbnail.jpg  # TODO: Add thumbnail
featured: false
---

## The Experiment: How Many Layers Do You Really Need?

For my [Image Generation project](/projects/image-generation/), before diving into GANs, I wanted to build a solid understanding of Convolutional Neural Networks (CNNs).

**The task:** Classify handwritten digits (MNIST dataset) - the "Hello World" of deep learning.

**The question:** How much architectural complexity do you actually need to get good results?

I tested **7 different architectures**:
- 3 traditional CNNs (varying depth and layer types)
- 4 Fully Convolutional Networks (FCNNs)

**The surprising result?** The simplest model (CNN-1) achieved the best accuracy-to-training-time ratio.

This post shares what I learned from systematically comparing these architectures.

---

## The Architectures

### CNN Family: Traditional Convolutional Networks

All CNNs follow this pattern:
```
Convolutional Layers → Pooling → Flatten → Fully Connected → Output
```

#### CNN-1 (Baseline)

**Architecture:**
```python
model = Sequential([
    Conv2D(32, (3,3), activation='relu', input_shape=(28,28,1)),
    MaxPooling2D((2,2)),

    Conv2D(64, (3,3), activation='relu'),
    MaxPooling2D((2,2)),

    Conv2D(64, (3,3), activation='relu'),

    Flatten(),
    Dense(64, activation='relu'),
    Dense(10, activation='softmax')
])
```

**Parameters:** ~100K
**Training time:** 12 minutes (100 epochs)
**Accuracy:** **98.0%**

**Design philosophy:** Keep it simple. Three conv layers, one fully connected layer.

---

#### CNN-2 (More Convolutional Layers)

**Change:** 3 conv layers → 5 conv layers

**Architecture:**
```python
model = Sequential([
    Conv2D(32, (3,3), activation='relu', input_shape=(28,28,1)),
    MaxPooling2D((2,2)),

    Conv2D(64, (3,3), activation='relu'),
    Conv2D(64, (3,3), activation='relu'),
    MaxPooling2D((2,2)),

    Conv2D(128, (3,3), activation='relu'),
    Conv2D(128, (3,3), activation='relu'),

    Flatten(),
    Dense(64, activation='relu'),
    Dense(10, activation='softmax')
])
```

**Parameters:** ~250K
**Training time:** 19 minutes (+58% vs CNN-1)
**Accuracy:** **98.6%**

<div class="row">
    <div class="col-sm mt-3 mt-md-0">
        {% include figure.liquid loading="eager" path="assets/img/projects/image-generation/CNN2-training.png" title="CNN-2 training curves" class="img-fluid rounded z-depth-1" %}
    </div>
</div>
<div class="caption">
    CNN-2 training curves showing overfitting starting around epoch 40
</div>

**Observations:**
- ✅ **Best accuracy** of all models (98.6%)
- ⚠️ **Overfitting** starts around epoch 40 (validation loss increases)
- ⚠️ **60% longer training** for only 0.6% accuracy gain

**Is it worth it?** Depends on your use case. If you need that extra 0.6%, yes. If not, CNN-1 is better.

---

#### CNN-3 (More Fully Connected Layers)

**Change:** 1 FC layer → 3 FC layers

**Architecture:**
```python
model = Sequential([
    Conv2D(32, (3,3), activation='relu', input_shape=(28,28,1)),
    MaxPooling2D((2,2)),

    Conv2D(64, (3,3), activation='relu'),
    MaxPooling2D((2,2)),

    Conv2D(64, (3,3), activation='relu'),

    Flatten(),
    Dense(128, activation='relu'),
    Dense(64, activation='relu'),
    Dense(32, activation='relu'),
    Dense(10, activation='softmax')
])
```

**Parameters:** ~150K
**Training time:** 13 minutes (+8% vs CNN-1)
**Accuracy:** **98.0%**

<div class="row">
    <div class="col-sm mt-3 mt-md-0">
        {% include figure.liquid loading="eager" path="assets/img/projects/image-generation/CNN3-training.png" title="CNN-3 training curves" class="img-fluid rounded z-depth-1" %}
    </div>
</div>
<div class="caption">
    CNN-3 overfits earlier than CNN-2 (starts around epoch 15)
</div>

**Observations:**
- ✅ **Same accuracy** as CNN-1 (98.0%)
- ⚠️ **Overfits earliest** of all CNNs (epoch 15)
- ⚠️ **More parameters** but no accuracy gain

**Conclusion:** Adding FC layers doesn't help for this task.

---

### FCNN Family: Fully Convolutional Networks

FCNNs replace fully connected layers with global pooling:

```
Convolutional Layers → Global Average Pooling → Output
```

**Why try FCNNs?**
- Fewer parameters (no dense layers)
- More robust to input size changes
- Popular in modern architectures (ResNet, EfficientNet)

---

#### FCNN-1 (Baseline)

**Architecture:**
```python
model = Sequential([
    Conv2D(32, (3,3), activation='relu', input_shape=(28,28,1)),
    MaxPooling2D((2,2)),

    Conv2D(64, (3,3), activation='relu'),
    MaxPooling2D((2,2)),

    Conv2D(64, (3,3), activation='relu'),

    GlobalAveragePooling2D(),
    Dense(10, activation='softmax')
])
```

**Parameters:** ~50K (half of CNN-1)
**Training time:** 11 minutes
**Accuracy:** **96.0%**

**Observations:**
- ⚠️ **2% worse** than CNN-1 despite same conv structure
- ✅ **Fewer parameters** (50% reduction)
- ⚠️ **Slower convergence** (needs more epochs)

**Why lower accuracy?** Global pooling loses spatial information that FC layers preserve.

---

#### FCNN-2 (More Layers)

**Change:** 3 conv layers → 5 conv layers

**Parameters:** ~120K
**Training time:** 15 minutes
**Accuracy:** **97.0%**

**Observations:**
- ✅ **Better than FCNN-1** (adding depth helps)
- ⚠️ **Still worse than CNN-1** (97% vs 98%)

**Conclusion:** More layers partially compensates for lack of FC layers, but doesn't fully close the gap.

---

#### FCNN-3 (Larger Kernels)

**Change:** 3×3 kernels → 5×5 kernels

**Architecture:**
```python
model = Sequential([
    Conv2D(32, (5,5), activation='relu', input_shape=(28,28,1)),  # Larger kernels
    MaxPooling2D((2,2)),

    Conv2D(64, (5,5), activation='relu'),
    MaxPooling2D((2,2)),

    Conv2D(64, (5,5), activation='relu'),

    GlobalAveragePooling2D(),
    Dense(10, activation='softmax')
])
```

**Parameters:** ~85K
**Training time:** 13 minutes
**Accuracy:** **97.5%** (best FCNN!)

<div class="row">
    <div class="col-sm mt-3 mt-md-0">
        {% include figure.liquid loading="eager" path="assets/img/projects/image-generation/FCNN-accuracy-comparison.png" title="FCNN comparison" class="img-fluid rounded z-depth-1" %}
    </div>
</div>
<div class="caption">
    Accuracy comparison across all 4 FCNN architectures
</div>

**Observations:**
- ✅ **Best FCNN performance** (97.5%)
- ✅ **Minimal training time increase** (only +2 minutes vs FCNN-1)
- 💡 **Key insight:** Kernel size matters more than depth for FCNNs

**Why does this work?** Larger kernels capture more spatial context, partially compensating for global pooling's information loss.

---

#### FCNN-4 (More Layers + Larger Kernels)

**Change:** Combine both improvements (5 layers + 5×5 kernels)

**Parameters:** ~150K
**Training time:** 18 minutes
**Accuracy:** **97.0%**

**Observations:**
- ❌ **Worse than FCNN-3** despite more complexity!
- ⚠️ **Overfitting** starts around epoch 20
- ⚠️ **Diminishing returns** from added complexity

**Conclusion:** More complexity doesn't always help. FCNN-3 found the sweet spot.

---

## Side-by-Side Comparison

<div class="row">
    <div class="col-sm mt-3 mt-md-0">
        {% include figure.liquid loading="eager" path="assets/img/projects/image-generation/Accuracy-and-training-time-comparison.png" title="All models comparison" class="img-fluid rounded z-depth-1" %}
    </div>
</div>
<div class="caption">
    Accuracy vs training time for all 7 architectures. Top-left corner is best (high accuracy, low time).
</div>

| **Model** | **Type** | **Params** | **Time** | **Accuracy** | **Efficiency** |
|-----------|----------|------------|----------|--------------|----------------|
| **CNN-1** | Baseline | 100K | 12 min | **98.0%** | ⭐⭐⭐⭐⭐ |
| CNN-2 | Deep CNN | 250K | 19 min | **98.6%** | ⭐⭐⭐ |
| CNN-3 | Deep FC | 150K | 13 min | 98.0% | ⭐⭐⭐⭐ |
| FCNN-1 | Baseline | 50K | 11 min | 96.0% | ⭐⭐ |
| FCNN-2 | Deep | 120K | 15 min | 97.0% | ⭐⭐⭐ |
| **FCNN-3** | Large kernels | 85K | 13 min | **97.5%** | ⭐⭐⭐⭐ |
| FCNN-4 | Deep + Large | 150K | 18 min | 97.0% | ⭐⭐ |

**Winner by accuracy:** CNN-2 (98.6%)
**Winner by efficiency:** **CNN-1 (98.0% in 12 minutes)**
**Best FCNN:** FCNN-3 (97.5%)

---

## Key Insights

### 1. The Baseline Often Wins

CNN-1 (the simplest model) achieved 98% accuracy—only 0.6% worse than the best model, but **60% faster to train**.

For most applications, **this tradeoff favors the baseline.**

**When to use simple models:**
- Prototyping (iterate faster)
- Resource-constrained deployment (mobile, edge devices)
- "Good enough" accuracy (98% vs 98.6% doesn't matter for many tasks)

**When to invest in complexity:**
- Every 0.1% matters (medical diagnosis, safety-critical)
- Have abundant compute resources
- Need state-of-the-art results

### 2. Adding Layers ≠ Better Results

**Adding convolutional layers** (CNN-2): ✅ Helped (+0.6% accuracy)
**Adding fully connected layers** (CNN-3): ❌ No improvement (same 98%, more overfitting)
**Adding both to FCNN** (FCNN-4): ❌ Made it worse (97.5% → 97.0%)

**Lesson:** More layers help when they address a bottleneck. Otherwise, they just overfit.

### 3. Kernel Size Is Underrated

FCNN-3 (larger kernels) outperformed FCNN-2 (more layers):
- **FCNN-2:** 5 layers, 3×3 kernels → 97.0%
- **FCNN-3:** 3 layers, 5×5 kernels → 97.5%

**Why?** Larger kernels capture more spatial context per layer. For small images (28×28), this matters.

**Tradeoff:** 5×5 kernels have ~2.8× more parameters than 3×3, but training time only increased 15%.

### 4. FCNNs Need More Capacity Than CNNs

For the same convolutional structure:
- **CNN-1** (with FC layers): 98.0%
- **FCNN-1** (without FC layers): 96.0%

**Why?** Global pooling discards spatial information. FC layers recover some of it through dense connections.

**To match CNN performance, FCNNs need:**
- More convolutional layers (FCNN-2)
- Larger kernels (FCNN-3)
- Or both (but watch for overfitting)

### 5. Training Time Scales Nonlinearly

| **Complexity** | **Params** | **Time** | **Time per 1K Params** |
|----------------|------------|----------|------------------------|
| FCNN-1 | 50K | 11 min | 0.22 min |
| CNN-1 | 100K | 12 min | 0.12 min |
| CNN-3 | 150K | 13 min | 0.09 min |
| CNN-2 | 250K | 19 min | 0.08 min |

**Observation:** Doubling parameters doesn't double training time. Factors matter:
- **Layer type** (conv vs dense)
- **Batch size** (GPU utilization)
- **Data throughput** (I/O bottlenecks)

---

## Practical Recommendations

### For MNIST-Like Tasks (Small Images, Simple Patterns)

**Start with:**
```python
Conv2D(32) → MaxPool → Conv2D(64) → MaxPool → Conv2D(64) → Flatten → Dense(64) → Output
```

This is CNN-1. It's fast, simple, and gets 98%.

**Only add complexity if:**
- 98% isn't good enough
- You have compute budget to spare
- You've exhausted other improvements (data augmentation, regularization)

### For Larger Images / Complex Tasks

**Modern best practices:**
- Use residual connections (ResNet)
- Batch normalization (not tested here, but helps)
- Data augmentation (critical for preventing overfitting)
- Transfer learning (if applicable)

But the principle holds: **Start simple, add complexity only when needed.**

### For Resource-Constrained Deployment

**Consider FCNNs:**
- Fewer parameters (FCNN-1: 50K vs CNN-1: 100K)
- No input size restrictions (can process variable-sized images)
- Faster inference on some hardware

**But accept the accuracy tradeoff:** ~1-2% worse than equivalent CNNs.

---

## What I Wish I'd Done Differently

### 1. Test with Data Augmentation

All models were tested **without data augmentation**. This likely led to:
- Earlier overfitting
- Lower final accuracy

**Data augmentation would have:**
- Reduced overfitting (especially for CNN-2, CNN-3)
- Potentially closed the gap between complex and simple models

### 2. Use Learning Rate Schedules

I used a fixed learning rate (0.001). **Learning rate decay** would have:
- Improved final accuracy
- Helped models converge better

### 3. Test Batch Normalization

Modern CNNs use batch normalization between conv layers. This would have:
- Allowed deeper models without vanishing gradients
- Potentially made CNN-2 train faster
- Reduced overfitting

**Without BN, comparing "deep" models isn't entirely fair.**

### 4. Measure Inference Time, Not Just Training Time

I focused on training time, but for deployment, **inference time** matters more.

**Hypothesis:** FCNNs might be faster at inference (no dense layers), even if training is similar.

---

## Code & Reproducibility

All 7 architectures and training code in my [Image Generation repository](https://github.com/LeonardoPaccianiMori/image-generation):
- `notebooks/cnn_comparison.ipynb` - All experiments
- `models/cnn_baseline.py` - CNN-1 implementation
- `models/fcnn_variants.py` - FCNN implementations

**To reproduce:**
```bash
git clone https://github.com/LeonardoPaccianiMori/image-generation
cd image-generation
pip install -r requirements.txt
jupyter notebook notebooks/cnn_comparison.ipynb
```

---

## Related Work

This isn't a new finding! Lots of research shows simpler models can match complex ones:

- **"Do We Need Hundreds of Classifiers?"** ([Fernández-Delgado et al., 2014](https://jmlr.org/papers/v15/delgado14a.html)) - Random Forests beat many complex models
- **"The Lottery Ticket Hypothesis"** ([Frankle & Carbin, 2019](https://arxiv.org/abs/1803.03635)) - Large networks contain smaller subnetworks that perform equally well
- **"Rethinking the Inception Architecture"** ([Szegedy et al., 2016](https://arxiv.org/abs/1512.00567)) - Factorized convolutions (smaller kernels) can be more efficient

**My contribution:** Systematic comparison on a specific task (MNIST) with practical insights for practitioners.

---

## Key Takeaways

1. **Start with simple baselines** - CNN-1 (98% in 12 min) beats complex models in efficiency
2. **More layers ≠ better results** - CNN-3 had 3 FC layers but same accuracy as 1 FC layer
3. **Kernel size matters** - FCNN-3 (5×5 kernels) beat FCNN-2 (more layers) with less training time
4. **Measure what matters** - Accuracy alone doesn't tell the story; consider training time, parameters, overfitting
5. **Complex models need careful tuning** - Without data augmentation and proper regularization, they just overfit
6. **FCNNs trade accuracy for simplicity** - 1-2% worse than CNNs, but fewer parameters

**The meta-lesson:** Don't default to complexity. Simple models, properly trained, often win.

Have you been surprised by a simple model outperforming a complex one? What's your approach to choosing architectures? Let me know!
