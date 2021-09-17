---
title: Markdown editable
state: complete
---

### Description

Markdown editable component based on EasyMDE.

### Properties

| Property       | Type    | Default value |
| -------------- | ------- | ------------- |
| `attributes`   | array   |               |
| `editLabel`    | string  |               |
| `emptyHtml`    | string  |               |
| `html`         | string  |               |
| `markdown`     | string  |               |
| `preview`      | boolean | `false`       |

### Notes

`emptyHtml` is shown when there is no Markdown content.

`html` is shown when the component is initially rendered, unless `emptyHtml` is set and there is no Markdown content.
