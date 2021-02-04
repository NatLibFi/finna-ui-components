---
title: Nav
state: complete
---

### Description

Basic list of navigation items that supports displaying the active item's 
children.

### Properties

| Property         | Type   |
| ---------------- | ------ |
| `ariaCurrent`    | string |
| `attributes`     | array  |
| `items`          | array  |
| `renderChildren` | string |

### Notes

`ariaCurrent` is used for possible active items. If this property is set it will
override the same property in all items.

`renderChildren` can be used to control how possible child items are rendered.
Currently supported values are `false`, `simple` and `dropdown`. If this
property is set it will override the same property in all items.

### Variations

| Class              | Description                  |
| ------------------ | ---------------------------- |
| `finna-nav-lg`     | Larger variation             |
| `finna-nav-navbar` | Variation for finna-navbar   |
| `finna-nav-tabs`   | Variation for finna-tabs-nav |
