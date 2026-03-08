---
layout: post
title: "Activation Functions Killed My GAN: A Debugging Story"
date: 2025-01-14 14:00:00
description: How changing one line of code in my MNIST GAN turned a failing model into one that finally produced recognizable digits
tags: deep-learning GAN debugging
categories: [data-science, learning]
thumbnail: assets/img/projects/image-generation/image-generation-thumbnail.png
featured: true
chart:
  plotly: true
images:
  photoswipe: true
---

When I started my [image generation project](/projects/image-generation/), I assumed the hard part would be inventing something clever. What actually slowed me down was more embarrassing: I had built a GAN that looked standard enough to avoid suspicion, including from me.

I had a DCGAN that looked reasonable on paper, followed familiar tutorials, and trained without crashing. That combination was almost worse than an obvious bug, because it let me spend too long treating a broken setup like a normal tuning problem.

## The Failure Looked Stable Enough to Fool Me

The model was trained on MNIST, so the bar was not high. I did not need photorealism. I needed digits that looked like digits.

What I got from the first version was mostly noise plus the occasional vague `0` or `9`:

<div class="pswp-gallery d-flex flex-wrap justify-content-center" style="gap: 2px; max-width: 500px; margin: 0 auto;">
{% for i in (0..99) %}{% assign padded = i | prepend: '00' | slice: -3, 3 %}<a href="{{ 'assets/img/projects/image-generation/galleries/dcgan-1/img-' | append: padded | append: '.png' | relative_url }}" data-pswp-width="140" data-pswp-height="140" style="width: 48px;"><img src="{{ 'assets/img/projects/image-generation/galleries/dcgan-1/img-' | append: padded | append: '.png' | relative_url }}" alt="DCGAN-1 sample {{ i }}" style="width: 100%;" loading="lazy" /></a>{% endfor %}
</div>
<div class="caption">
    DCGAN-1 results after training: some vague shapes, very little control, and almost no improvement past the early epochs.
</div>

The loss curves were the clearest sign that something fundamental was wrong:

```plotly
{% include plotly/image-generation/dcgan-1-training.json %}
```
<div class="caption">
    DCGAN-1 training curves. The discriminator settles quickly while the generator keeps getting worse.
</div>

At first I treated this like a normal tuning problem. I tried learning-rate changes, a bit of label smoothing, small architecture tweaks, and regularization on the discriminator. None of those changed the basic story.

That was the useful lesson. When several "reasonable" tweaks do nothing, it is usually a sign that the problem is not in the knobs. It is in one of the assumptions.

## The One Assumption I Had Stopped Questioning

The generator ended with a `tanh` activation because that is what you see in many DCGAN examples:

```python
Conv2DTranspose(1, (3, 3), strides=1, padding="same"),
Activation("tanh")
```

My images were normalized to `[-1, 1]` to match. It felt internally consistent, which is why I had not revisited it.

Eventually I changed that output layer to `sigmoid` and renormalized the images to `[0, 1]`:

```python
Conv2DTranspose(1, (3, 3), strides=1, padding="same"),
Activation("sigmoid")
```

That was the main turning point.

## The Difference Was Immediate

After that one change, the training curves stopped looking like a one-sided collapse:

```plotly
{% include plotly/image-generation/dcgan-2-training.json %}
```
<div class="caption">
    DCGAN-2 training curves. The adversarial dynamics are still noisy, but they now look like a live contest instead of a one-sided failure.
</div>

And the samples finally started to look like digits:

<div class="pswp-gallery d-flex flex-wrap justify-content-center" style="gap: 2px; max-width: 500px; margin: 0 auto;">
{% for i in (0..99) %}{% assign padded = i | prepend: '00' | slice: -3, 3 %}<a href="{{ 'assets/img/projects/image-generation/galleries/dcgan-2/img-' | append: padded | append: '.png' | relative_url }}" data-pswp-width="140" data-pswp-height="140" style="width: 48px;"><img src="{{ 'assets/img/projects/image-generation/galleries/dcgan-2/img-' | append: padded | append: '.png' | relative_url }}" alt="DCGAN-2 sample {{ i }}" style="width: 100%;" loading="lazy" /></a>{% endfor %}
</div>
<div class="caption">
    DCGAN-2 results after switching to sigmoid and renormalizing the data. Still imperfect, but now the model is actually learning.
</div>

It was not a full solution by itself. I still made later improvements with larger kernels, more depth, and longer training. But none of that would have mattered if the generator had stayed stuck in the original failure mode.

## Why I Think It Helped

I do **not** think this means `tanh` is wrong for GANs in general. The interesting point is narrower than that.

For this setup, `sigmoid` was simply a better fit for the output range and the optimization behavior I was seeing. With MNIST, most pixels are near black or white, and the model seemed to train more comfortably when the output layer matched the natural image scale directly instead of mapping through `[-1, 1]`.

More importantly, switching the activation forced me to revisit the full preprocessing pipeline. That is what I had really missed the first time: the output layer, data normalization, and training dynamics were coupled.

## What I Took From It

Three habits came out of this debugging session that I still trust:

1. Do not keep treating a structural problem like a hyperparameter problem.
2. When a model feels "almost standard," check the assumptions you stopped noticing.
3. Save the plots and sample outputs. They make it much easier to tell the difference between a noisy model and a broken one.

I still like this episode because the fix was small but the mistake was conceptual. It reminded me that debugging deep learning often means questioning the part of the pipeline that has become invisible to you.

If you want the broader context, the [project page](/projects/image-generation/) gives the portfolio-level summary, and the [full technical deep dive](/blog/2025/image-generation-deep-dive/) has the rest of the experiment set.
