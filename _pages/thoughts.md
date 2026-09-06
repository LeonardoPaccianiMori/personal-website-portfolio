---
layout: page
title: thoughts
permalink: /thoughts/
description: Reflections on research and industry, useful small tools, and responsibility for AI-assisted work.
eyebrow: Writing · Reflections
wide: true
nav: false
---

{% assign thoughts = site.posts | where_exp: "post", "post.categories contains 'thoughts'" %}
{% include writing_list.liquid posts=thoughts empty_message="No thoughts yet." %}
