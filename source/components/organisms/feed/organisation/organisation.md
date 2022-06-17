---
state: complete
---

#### Description

Feed component for displaying organisation RSS data in a grid layout.

#### Properties

| Prop                        | Type     | Value (example)                 | Required |
| --------------------------- | -------- | ------------------------------- | -------- |
| informationNotAvailableText | `String` | `Information is not available.` | Yes      |
| organisation                | `String` | `Vaski`                         | Yes      |
| rssId                       | `String` | `events`                        | Yes      |
| servicePointId              | `Number` | `85141`                         | Yes      |
| wrapperClass                | `String` | `js-organisation-feed`          | Yes      |
| rssUrl                      | `String` | -                               | No       |

#### Child components

- `molecules/messaging/alert/alert.phtml`
- `atoms/messaging/loader/loader.phtml`
