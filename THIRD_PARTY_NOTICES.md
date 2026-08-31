# Third-party notices and attributions

## al-folio

This website is based on [al-folio](https://github.com/alshedivat/al-folio),
copyright Maruan Al-Shedivat and contributors, under the MIT License. The
preserved license is in [LICENSES/al-folio-MIT.txt](LICENSES/al-folio-MIT.txt).

## PxHere photographs

The project header photographs linked below were obtained from PxHere, where
they are marked for CC0/public-domain-style reuse. The source pages are retained
for provenance:

- [Italian real estate](https://pxhere.com/en/photo/529383)
- [Italian cuisine](https://pxhere.com/en/photo/1000518)
- [Transformer poetry manuscript photograph](https://pxhere.com/en/photo/795701)

The transformer-poetry source is a 2560×1707 JPEG downloaded on 15 August 2026. PxHere labels the photograph CC0 and states that modification, commercial
use, and distribution are permitted without required attribution. PxHere's
structured metadata identifies the contributor only as `CC0-Photographers`;
no individual photographer is named. The website version is a centered crop,
resized to 1536×960, converted to WebP, and stripped of metadata. It is used as
a thematic manuscript image and is not presented as one of the project's
textual sources.

## Bookshelf cover images pending source review

The cover images for _Perché leggere i classici_ and _Sulla fiaba_ were
provided by Leonardo after he found them on the publisher's website. They show
Mondadori Oscar Moderni editions. The exact source URLs and an express reuse
licence were not retained and remain to be reviewed. The images are included
provisionally as identifying cover thumbnails under Leonardo's publication
decision; this repository asserts no reuse licence for them.

## Tableau Public

The Italian real-estate project page displays a preview image hosted by
[Tableau Public](https://public.tableau.com/) and offers an optional interactive
dashboard. Choosing to load the interactive view sends a request to Tableau
Public, a Salesforce service, and is subject to that service's privacy and
cookie practices. The public toolbar currently offers visual exports as an
image, vector image, PDF, or PowerPoint file. This website repository does not
distribute the source listings or synthetic row-level dataset used in the
historical study.

## Artusi digital edition

The interactive example graph for recipe 76 is derived from Pellegrino Artusi,
_La scienza in cucina e l'arte di mangiar bene_, using a digital edition
credited to the Comune di Forlimpopoli and Cristiano Vanzolini. The source
material carries the notice “CC By-NC-SA” without a stated version. No broader
license is asserted here.

## Istat administrative boundaries

The files under `assets/data/italian-cuisine/shapefiles/` are the generalized
2025 regional layer from Istituto nazionale di statistica (Istat),
[_Confini delle unità amministrative a fini statistici_](https://www.istat.it/notizia/confini-delle-unita-amministrative-a-fini-statistici-al-1-gennaio-2018-2/).
Istat makes its data available under
[CC BY 4.0](https://creativecommons.org/licenses/by/4.0/) with source
attribution. The chart generator reprojects the layer to EPSG:4326 when needed
and simplifies its geometry for browser delivery; generated choropleths retain
an in-chart Istat credit. These adaptations are not endorsed by Istat.

## MNIST and browser libraries

The image-generation project uses the MNIST database of handwritten digits,
commonly credited to Yann LeCun, Corinna Cortes, and Christopher J. C. Burges.
MNIST is not redistributed as a dataset in this repository; generated samples
and browser runtime artifacts are retained only as project evidence. Dataset
information and citation are available from the
[TensorFlow Datasets catalog](https://www.tensorflow.org/datasets/catalog/mnist).

Interactive pages load or embed third-party software including TensorFlow.js
and Three.js. Those libraries retain their own licenses. Vendored libraries
also retain the notices embedded in their files.
