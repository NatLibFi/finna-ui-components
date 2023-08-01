---
title: Button
state: complete
---

### Description

A button with an icon and/or label and an optional tooltip. Buttons can be real HTML buttons or links styled to look like buttons.

### Properties

| Property           | Type         | Default Value |
|--------------------|--------------|---------------|
| `ariaCurrent`      | string       |               |
| `a11yLabel`        | string       |               |
| `attributes`       | array        |               |
| `class`            | array/string |               |
| `href`             | string       |               |
| `htmlLabel`        | boolean      | `false`       |
| `id`               | string       |               |
| `iconClass`        | array/string |               |
| `label`            | string       |               |
| `tooltip`          | string       |               |
| `tooltipPlacement` | string       | `top`         |
| `type`             | string       |               |

### Notes

`ariaCurrent` is a convenience property for setting the `aria-current` attribute. It is only used if a `href` attribute is set.

If `href` or a `href` attribute is set the HTML element will be a link instead of a button.

`tooltipPlacement` can be `auto`, `top`, `right`, `bottom` or `left`.

`type` is a convenience property for setting the button type when the type is not `button`.
