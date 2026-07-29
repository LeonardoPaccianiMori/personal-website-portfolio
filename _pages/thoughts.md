---
layout: page
title: thoughts
permalink: /thoughts/
description: Occasional reflections on data science, work, and the judgment behind technical decisions.
eyebrow: Writing · Reflections
wide: true
nav: false
---

{% assign thoughts = site.posts | where_exp: "post", "post.categories contains 'thoughts'" %}
{% include writing_list.liquid posts=thoughts empty_message="No thoughts yet." %}
