---
title: Tooltip button
state: complete
---

### Description

A tooltip button with an icon and/or label.

### Properties

| Property            | Type   | Example value                                               | Required |
| ------------------- | ------ | ----------------------------------------------------------- | -------- |
| `ariaLabel`         | string |                                                             | Yes/No   |
| `additionalClasses` | string | `finna-tooltip-btn-lg`                                      | No       |
| `content`           | string | `<h4>Tooltip bottom</h4><p>Lorem ipsum dolor sit amet.</p>` | Yes      |
| `iconClass`         | string | `fa-info-big`                                               | No       |
| `label`             | string | Show tooltip                                                | No       |
| `placement`         | string | `bottom` (default value)                                    | No       |

### Notes

`ariaLabel` is not required if there is a `label`.
