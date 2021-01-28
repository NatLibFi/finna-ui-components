---
title: Panel
state: complete
---

### Description

While not always necessary, sometimes you need to put your DOM in a box.
For those situations, try the panel component.

### Properties

| Property       | Type    | Default value |
| -------------- | ------- | ------------- |
| `attributes`   | array   |               |
| `collapsed`    | boolean | `true`        |
| `collapseId`   | string  |               |
| `content`      | string  |               |
| `heading`      | string  |               |
| `headingId`    | string  |               |
| `headingLevel` | integer |               |
| `headingTag`   | boolean | `true`        |

### Notes

Setting `collapseId`, `heading` and `headingId` will make the panel collapsible.

`collapsed` has no effect unless the panel is collapsible.

ARIA `role` and `aria-level` attributes will be added to the heading `div` if
a `headingLevel` is set and `headingTag` is set to `false`.

### Variations

Since this component is based on Bootstrap's panel component it supports all
Bootstrap panel variations.

Add the `finna-panel-default` class for the default variation.

Add the `finna-panel-borderless` class for a borderless variation.
