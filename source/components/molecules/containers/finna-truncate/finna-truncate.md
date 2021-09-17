---
title: Truncate
state: complete
---

### Description

A truncation component that supports both element-based and height-based truncation.

### Properties

| Property        | Type    | Default value |
| --------------- | ------- | ------------- |
| `attributes`    | array   |               |
| `btnClass`      | string  |               |
| `content`       | string  |               |
| `element`       | string  |               |
| `inPlaceToggle` | boolean | `false`       |
| `label`         | string  |               |
| `lessLabel`     | string  | `show_less`   |
| `moreLabel`     | string  | `show_more`   |
| `rows`          | int     | `3`           |
| `topToggle`     | int     | `Infinity`    |

### Notes

`element` is used for element-based truncation.

`lessLabel` and `moreLabel` are not used if `label` is set.

`inPlaceToggle` is only used in element-based truncation.

`topToggle` only supports boolean values for height-based truncation.

### Variations
