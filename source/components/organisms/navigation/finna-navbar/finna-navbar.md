---
title: Navbar
state: complete
---

### Description

Navbars are responsive components that serve as navigation headers for your 
application or site. They begin collapsed (and are toggleable) in mobile views
and become horizontal as the available viewport width increases.

### Properties

| Property             | Type   |
| -------------------- | ------ |
| `ariaLabel`          | string |
| `attributes`         | array  |
| `brandContent`       | string |
| `brandLink`          | string |
| `brandSrOnly`        | string |
| `collapseContent`    | string |
| `collapseId`         | string |
| `toggleBtnSrOnly`    | string |
| `toggleBtnIconClass` | string |
| `toggleBtnLabel`     | string |

### Notes

The component defines a `finna-navbar-icon-caret` class that can be used as a
value for `toggleBtnIconClass`.

### Variations

| Class                  | Description |
| ---------------------- | ----------- |
| `finna-navbar-content` | Content navigation variation. This variation has a prominent color for the navbar and the mobile collapse content is styled to look similar to dropdown menus. |
