---
state: inprogress
---

#### Description

Service point schedule widget, for displaying service point weekly schedules and details.

#### Properties

| Prop                        | Type     | Value (example)                       | Required |
| --------------------------- | -------- | ------------------------------------- | -------- |
| dropdownStatusText          | `String` | `Selected service point changed to:`  | Yes      |
| closedText                  | `String` | `Closed`                              | Yes      |
| informationNotAvailableText | `String` | `No schedules available`              | Yes      |
| nextWeekLabel               | `String` | `Next week`                           | Yes      |
| openText                    | `String` | `Open`                                | Yes      |
| organisation                | `String` | `NFL`                                 | Yes      |
| previousWeekLabel           | `String` | `Previous week`                       | Yes      |
| scheduleWrapperClass        | `String` | `js-pl-widget-schedule`               | Yes      |
| selfServiceText             | `String` | `(self service)`                      | Yes      |
| servicePointId              | `Number` | `85141`                               | Yes      |
| staffAvailableText          | `String` | `Staff available`                     | Yes      |
| weekText                    | `String` | `Week`                                | Yes      |
| weekNaviStatusText          | `String` | `Week number changed to:`             | Yes      |
| wrapperClass                | `String` | `js-widget-schedule-wrapper`          | Yes      |
| dropdownFallbackLabel       | `String` | `Select library`                      | No       |
| directionsText              | `String` | `Directions`                          | No       |
| emailText                   | `String` | `Email`                               | No       |
| externalLinkText            | `String` | `External link`                       | No       |
| facebookText                | `String` | `Facebook`                            | No       |
| facilityLink                | `String` | `https://finna.fi/`                   | No       |
| facilityPlaceholderImage    | `String` | `https://via.placeholder.com/149x100` | No       |
| moreInfoLabel               | `String` | `Organisation more info`              | No       |
| phoneText                   | `String` | `Phone`                               | No       |
| printText                   | `String` | `Print`                               | No       |
| servicePointInfoText        | `String` | `Service point information`           | No       |
| target                      | `String` | `page`                                | No       |
| wifiText                    | `String` | `Wifi`                                | No       |
| widgetHeading               | `String` | `Widget Heading`                      | No       |

#### Child components

- `atoms/messaging/loader/loader.phtml`
- `molecules/tooltips/finna-tooltip-btn/finna-tooltip-btn.phtml`
- `molecules/scheduling/service-point-schedule/service-point-schedule.phtml`
