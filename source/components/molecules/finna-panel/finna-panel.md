---
title: Panel
state: complete
---

### Description

While not always necessary, sometimes you need to put your DOM in a box.
For those situations, try the panel component.

### Properties

| Property             | Type    | Example value   | Required |
| -------------------- | ------- | ----------------| -------- |
| `attributes`         | array   |                 | No       |
| `collapsible`        | boolean | `true`          | No       |
| `collapsed`          | boolean | `false`         | No       |
| `collapseId`         | string  | `example-panel` | Yes/No   |
| `content`            | string  | Content         | Yes      |
| `heading`            | string  | Heading         | Yes/No   |
| `headingId`          | string  |                 | Yes/No   |
| `titleHeadingLevel`  | integer | `2`             | No       |

### Notes

Setting `collapsible` to `true` will make the panel collapsible. It will also 
make the `collapseId`, `heading` and `headingId` properties required. 
`collapsed` has no effect unless `collapsible` is set to `true`.

If a `titleHeadingLevel` (`1`-`6`) is set, `heading` will be put in a h-tag.

### Variations

Since this component is based on Bootstrap's panel component it supports all
Bootstrap panel variations.

Add the `finna-panel-default` class for the default variation.

Add the `finna-panel-dark` class for a dark variation.
