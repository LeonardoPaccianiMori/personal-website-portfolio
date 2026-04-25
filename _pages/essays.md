---
layout: page
title: essays
permalink: /essays/
description: Occasional opinion pieces and reflections.
nav: false
---

{% assign essays = site.posts | where_exp: "post", "post.categories contains 'essays'" %}
{% include writing_list.liquid posts=essays empty_message="No essays yet." %}
