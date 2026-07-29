---
layout: page
title: technical notes
permalink: /notes/
description: Project appendices, implementation decisions, modeling tradeoffs, and applied data-science lessons.
eyebrow: Writing · Technical
wide: true
nav: false
---

{% assign notes = site.posts | where_exp: "post", "post.categories contains 'technical-notes'" %}
{% include writing_list.liquid posts=notes empty_message="No technical notes yet." %}
