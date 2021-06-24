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
| `navbarAttributes`   | array  |
| `tabsNavAttributes`  | array  |

### Notes

Additionally, all finna-navbar properties except `ariaLabel`, `attributes`
(these are used for the parent multi-level component) and `collapseContent`.

If either `navbarAttributes` or `tabsNavAttributes` is provided with a `class`
attribute, the caller is responsible for setting a visibility class for the
respective component.

### Variations

| Class                           | Description                  |
| ------------------------------- | ---------------------------- |
| `finna-multi-level-nav-lg`      | Larger variation             |
| `finna-multi-level-nav-content` | Content navigation variation |
