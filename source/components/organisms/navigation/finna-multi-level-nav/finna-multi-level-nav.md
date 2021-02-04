---
title: Multi-level navigation
state: complete
---

### Description

Multi-level navigation. Tabbed navigation bar for large screens and a navbar for 
small screens.

### Properties

| Property             | Type   |
| ---------------------| ------ |
| `ariaLabel`          | string |
| `attributes`         | array  |
| `brandContent`       | string |
| `brandLink`          | string |
| `collapseId`         | string |
| `items`              | array  |

### Notes

Additionally all finna-navbar properties except `ariaLabel`, `attributes` (these
are used for the parent multi-level component) and `collapseContent`.

### Variations

| Class                           | Description                  |
| ------------------------------- | ---------------------------- |
| `finna-multi-level-nav-lg`      | Larger variation             |
| `finna-multi-level-nav-content` | Content navigation variation |
