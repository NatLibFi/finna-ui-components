---
title: Multiselect
state: complete
---

### Description

Creates a visual multiselect component.

### Properties

| Property         | Type   |
| ---------------- | ------ |
| `clear-text`     | string |
| `label-id`       | string |
| `label-text`     | string |
| `description`    | string |
| `placeholder`    | string |
| `entries`        | string |

### Notes

`clearText` Clear selections text.

`labelId` Identifier for label, must be unique.

`labelText` Translation for the label element.

`description` Aria-label for the UL element.

`placeholder` Placeholder text for search input.

`entries` Array of objects. 
    use htmlspecialchars(json_encode($list), ENT_QUOTES, 'UTF-8'); to convert into
    proper object in php
    Objects must have the next values:
    {
      displayText: Text to display for the option,
      value:       Option value.
      selected:    Should the option be selected when created.

      (optional):
      level: Used to create hierarchy.
      Level 0 is root. Level 1 is immediate child option. 
      Level 2 is child option for level 1 etc.
    }

### Variations

None
