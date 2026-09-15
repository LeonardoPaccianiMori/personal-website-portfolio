# Pinco Pallino — portfolio website

Source for my personal career and project portfolio. The site is built with
[Jekyll](https://jekyllrb.com/) on a heavily modified
[al-folio](https://github.com/alshedivat/al-folio) foundation, with a custom
light editorial design, project case studies, and interactive browser demos.

The repository is public so the implementation and project evidence can be
inspected. It is still under active preparation: the placeholder identity and
`leonardo.pm` configuration are intentional until the public launch is ready.

## Main sections

- Home: identity, selected work, and background
- About: role, background, and focus areas
- Projects: professional, personal, experimental, and games
- Writing: focused technical notes, project appendices, and thoughts
- Bookshelf
- Playground

## Local development

The supported development path uses the repository's Ruby dependencies:

```bash
bundle install
bundle exec jekyll build   # noninteractive build into _site/
bundle exec jekyll serve   # optional local preview at http://localhost:4000
```

Fonts and the few CDN libraries used by individual pages load from the
network.

## Working on this repository

- [AGENTS.md](AGENTS.md) defines the change-control, privacy, and validation
  rules.
- [STYLE_GUIDE.md](STYLE_GUIDE.md) is the current presentation baseline.

## Project repositories

- [Italian real estate](https://github.com/LeonardoPaccianiMori/portfolio-italian-real-estate)
- [Italian cuisine](https://github.com/LeonardoPaccianiMori/portfolio-italian-cuisine)
- [Image generation](https://github.com/LeonardoPaccianiMori/portfolio-image-generation)
- [Wanderer](https://github.com/LeonardoPaccianiMori/portfolio-game-wanderer)
- [Transformer poetry](https://github.com/LeonardoPaccianiMori/portfolio-transformer-poetry)

## Licensing

This is a mixed-license repository. The upstream al-folio code remains under
its MIT License, while my prose, personal images, and original site-specific
materials are not offered for reuse unless a file or directory says otherwise.
Selected analytical artifacts and embedded project assets have separate terms.

See [LICENSE.md](LICENSE.md) for the scope map and
[THIRD_PARTY_NOTICES.md](THIRD_PARTY_NOTICES.md) for attributions.
