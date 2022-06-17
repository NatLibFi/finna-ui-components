---
state: complete
---

#### Description

A map component for displaying organisation service point locations.

#### Properties

| Prop                     | Type       | Value (example)                                       | Required |
| ------------------------ | ---------- | ----------------------------------------------------- | -------- |
| centerMapButton          | `String`   | `Center`                                              | Yes      |
| closedText               | `String`   | `Closed`                                              | Yes      |
| collapseMapText          | `String`   | `Collapse`                                            | Yes      |
| expandMapText            | `String`   | `Expand`                                              | Yes      |
| locationNotAvailableText | `String`   | `Organisation location not available`                 | Yes      |
| mapApiUrl                | `String`   | `http://map-api.finna.fi/v1/rendered/{z}/{x}/{y}.png` | Yes      |
| mapWrapperClass          | `String`   | `js-map-widget`                                       | Yes      |
| notAvailableText         | `String`   | `Not available`                                       | Yes      |
| openText                 | `String`   | `Open`                                                | Yes      |
| organisation             | `String`   | `Vaski`                                               | Yes      |
| searchFormLabel          | `String`   | `Office search`                                       | Yes      |
| searchFormStatusText     | `String`   | `Service point was changed to:`                       | Yes      |
| showAllMarkersButton     | `String`   | `Show all service points`                             | Yes      |
| showMapButton            | `String`   | `Show map`                                            | Yes      |
| wrapperClass             | `String`   | `js-widget-wrapper`                                   | Yes      |
| buildings                | `String[]` | `["85141", "85968"]`                                  | No       |
| mapHeading               | `String`   | `Demo Heading`                                        | No       |
| searchFormPlaceholder    | `String`   | `Search service points ({0})`                         | No       |
| servicePointId           | `Number`   | `85141`                                               | No       |
| showSearchForm           | `Boolean`  | `true`                                                | No       |
