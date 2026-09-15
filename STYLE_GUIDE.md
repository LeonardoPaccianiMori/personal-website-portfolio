# Style Guide

This guide defines how public content and presentation are built on this site.
It is a working reference for Leonardo and for AI agents that edit this
repository. It is a baseline: an approved piece-specific wording or voice
choice wins over this guide.

Facts shown on this site come from the private canonical career record. This
guide governs presentation only. It never makes a new claim true.

## Audience

1. Prospective employers for senior data-science and applied-AI roles. This is
   the primary audience.
2. Professional contacts and possible future clients. The site currently
   presents a professional profile, not a services business.
3. Peer data scientists and technical readers. The writing should reward them.

## Voice and tone

- Write in the first person, direct and calm.
- Use no promotional language and no hype.
- Use plain language for technical terms at first use.
- Prefer evidence over claims. Qualify outcomes and name the source of an
  estimate (for example, "users estimate" rather than "the system reduces").
- Build personality from real decisions, tradeoffs, and lessons. Never invent
  motivation, reactions, or examples.
- State the AI contribution boundary accurately. Do not claim manual
  authorship of AI-assisted work.

## Content conventions

### Project pages

Each project page opens with the shared overview. Keep these five fields short
and comparable across projects:

- **Status and period** — for example, `Completed · May–September 2026`.
- **My role** — the exact contribution, including supervision or maintenance.
- **Outcome** — one qualified result.
- **Evidence** — what a reader can inspect, or the reason the evidence is
  private.
- **Demonstrates** — the transferable capability the project evidences.

The body after the overview is not a fixed template. It should follow the
strongest documented idea: a product decision, a tradeoff, a failure, or a
result. Include what was difficult and what remains limited. Decisions and
limitations are the senior signal; a headline metric alone is not.

State ownership precisely: personal, team, supervised, or employer-owned.
Preserve every approved confidentiality and attribution boundary.

### Writing

- Focused technical notes explain one decision, study, or tradeoff.
- Project appendices carry supporting method, results, limitations, and rights.
- Thoughts centre on one thesis grounded in lived work.

### Bookshelf

Use the supported statuses: `Reading`, `Paused`, `Finished`, `Reread`,
`Interested`, `Queued`, `Abandoned`. Notes for unread books stay empty of
judgment. Prefer reflection over plot summary.

### Dates, numbers, and titles

- Use sentence case for page titles and headings, except proper nouns and
  product names.
- Match the existing date style on the page, for example `May 2026–present`.
- Give every metric a unit, timeframe, and scale. Round estimates and never
  present an unsupported number.
- Spell out an acronym at first use, then use the short form, for example
  "Graph Attention Network (GAT)".

### Links and names

- Link to stable primary sources: repositories, papers, and model cards.
- Name AI tools and models exactly as used, with the version when it is known.
  Omit the version when the record does not support it.
- Use descriptive link text, not "click here".

## Visual system

- The site renders in one light theme. `enable_darkmode` is `false`; there is
  no visitor toggle, no dark palette, and no system-preference switching.
- Use the theme variables. Colours live in `_sass/_variables.scss` and are
  exposed as CSS custom properties in `_sass/_themes.scss`. Never hard-code a
  colour in content or in a one-off rule.
- The theme accent is forest green `#2f5d3a` (`--global-theme-color`). Keep it
  restrained.
- Surfaces: paper `#f5f2ea`, ink `#1b1f1a`, muted `#5f6a5c`, panels `#fffdf8`,
  dividers `#dbd6c8`. The site is flat: no rounded corners, no shadows, no
  gradients. Two deliberate exceptions keep their shape: the pill
  `career-button` and the circular back-to-top control.
- Type: "Fraunces" for display and headings with the optical-size pin kept
  (`font-optical-sizing: none; font-variation-settings: "opsz" 14;`), and
  "Inter" for body and interface. Do not add fonts.
- Layout: generous whitespace, horizontal rules, compact labels, and numbered
  elements carry the hierarchy.
- Components: reuse the existing classes and includes, for example
  `career-button`, `project-overview`, cards, and arrow rows. Do not add a
  dependency for a presentation change.
- Never let colour alone carry meaning. The cuisine comparison uses orange,
  neutral, and blue for this reason.

## Rules for AI agents

- Read this guide before an approved content, style, or visual change.
- Do not "fix" intentional wording or design. Report a suspected problem
  instead.
- Change no fact without the private canonical source.
- Keep the five overview fields stable. Add a field only through an approved
  plan.
- Add no dependency, framework, or build step for a presentation change.
- Do not enable a dark theme or add a second palette without an approved plan.
- Treat provisional identity details and intentionally hidden pages as
  deliberate. Do not finalize, reveal, or delete them without an approved plan.
- Report only the checks that were actually run.

## Maintenance

Update this guide through the repository change-control process: plan,
approval, validation, commit, and push. Leonardo reviews the published result.
