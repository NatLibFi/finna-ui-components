---
state: complete
---

#### Description

Contact list component. For dynamically generated items `content` property can be left empty and `dataKey` property should be added with the key in which content appears in data.

#### Properties

| Prop           | Type       | Value (example)                                                                                                 | Required |
| -------------- | ---------- | --------------------------------------------------------------------------------------------------------------- | -------- |
| items          | `Object[]` | `[{"title": "Address", "class": "js-contact-address", "content": "Linnankatu 2, 20100 Keskusta (Turku)"},...}]` | Yes      |
| organisation   | `String`   | `Vaski`                                                                                                         | Yes      |
| servicePointId | `Number`   | `85141`                                                                                                         | Yes      |
| wrapperClass   | `String`   | `js-pl-contact-list`                                                                                            | Yes      |
