# hass-sidebar-swipe

Toggle Home Assistant sidebar via swipe gestures:

- Swipe from left edge (user-configurable threshold) to open the drawer.
- Swipe from right to left (user-configurable threshold) anywhere on the screen **(with the drawer open)** to close the drawer.

### Installation:

You will need to download the latest release from the [Releases](https://github.com/breakthestatic/hass-sidebar-swipe/releases) page and add hass-sidebar-swipe.js to your dashboard's resources as [...]

### Config:

The library comes with some default settings (values noted in the table below) and should be generally usable without any additional work. However, if you'd like to tweak the thresholds or disable[...]

**Note:** The library does **not** actively listen for configuration changes. To see any updates, you'll need to perform a full page refresh.

| Name                      | Type    | Default | Description                                                                                                                                            |
| ------------------------- | ------- | ------- | ------------------------------------------------------------------------------------------------------------------------------------------------------ |
| start_threshold           | number  | `0.1`   | The starting horizontal threshold where touches are considered to be potential edge swipe events. Any gestures initiated from beyond this value are ign[...] |
| end_threshold             | number  | `0.13`  | The ending horizontal threshold that must be surpassed for touches to be considered edge swipe events. Any valid gestures (i.e. those that started with[...] |
| back_threshold            | number  | `50`    | The swipe distance that must be surpassed for touches to be considered back swipe events. Take note - this gesture is only active when the drawer is op[...] |
| prevent_others            | boolean | `true`  | Determines whether to stop event propagation. The edge swipe gestures should _typically_ supersede other touch events. E.g. if [hass-swipe-navigation]([...] |
| lock_vertical_scroll      | boolean | `true`  | Prevents vertical scrolling in the app while either a) the edge swipe gesture is being performed or b) the drawer is already open. This is primarily us[...] |
| prevent_back_navigation   | boolean | `false` | When enabled, pressing the OS-level back button while the drawer is open will close the drawer instead of navigating away. Note: Behavior may vary acro[...] |
| exclusions                | list    | `[]`    | A list of selectors to exclude from triggering the edge swipe gesture. When present, if an edge swipe starts within the starting threshold, **but over [...]  |

#### Example:

```
sidebar_swipe:
  start_threshold: 100
  end_threshold: 150
  back_threshold: 100
  prevent_others: true
  lock_vertical_scroll: true
  prevent_back_navigation: false
  exclusions:
    - ha-control-slider
```
