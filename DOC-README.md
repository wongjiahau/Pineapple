# Pineapple documentation website
## What is this README about?
This README is about how to build and publish the Pineapple Language Documentation.

## What documentation generator is used?
This documentation is generated using [MKDocs](https://www.mkdocs.org/).

## How to build and test the doc?

1. Install Python 3.6
2. Install MKDoc 
3. Install [MKDoc Material](https://squidfunk.github.io/mkdocs-material/extensions/admonition/) 

```sh
pip install mkdocs
```

3. Serve the page

```sh
mkdocs serve
```

## How to deploy?

```sh
mkdocs gh-deploy
```