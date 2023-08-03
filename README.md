# hass-sidebar-swipe

Toggle Home Assistant sidebar via swipe gestures:

- Swipe from left edge (user-configurable threshold) to open the drawer.
- Swipe from right to left (user-configurable threshold) anywhere on the screen **(with the drawer open)** to close the drawer.

### Installation:

You will need to download the latest release from the [Releases](https://github.com/breakthestatic/hass-sidebar-swipe/releases) page and add hass-sidebar-swipe.js to your dashboard's resources as described in the developer documentation here -> https://developers.home-assistant.io/docs/frontend/custom-ui/registering-resources/. Once registered, a refresh of the dashboard should be all that's needed to get up and running.

### Config:

The library comes with some default settings (values noted in the table below) and should be generally usable without any additional work. However, if you'd like to tweak the thresholds or disable some extra processing that might be interfering with your specific setup, you can add configuration overrides to your dashboard's yaml under the `sidebar_swipe` key.

**Note:** The library does **not** actively listen for configuration changes. To see any updates, you'll need to perform a full page refresh.

| Name                 | Type    | Default | Description                                                                                                                                                                                                                                                                                                                                                                                                                     |
| -------------------- | ------- | ------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| start_threshold      | number  | `0.1`   | The starting horizontal threshold where touches are considered to be potential edge swipe events. Any gestures initiated from beyond this value are ignored. Can be either a percentage of screen size (a value between `0` and `1`, e.g. `0.1` for 10%) or an absolute pixel value, e.g. `20`).                                                                                                                                |
| end_threshold        | number  | `0.13`  | The ending horizontal threshold that must be surpassed for touches to be considered edge swipe events. Any valid gestures (i.e. those that started within `start_threshold`) that **don't exceed** this value are cancelled and not considered edge swipes. Can be either a percentage of screen size (a value between `0` and `1`, e.g. `0.13` for 13%) or an absolute pixel value, e.g. `20`).                                |
| back_threshold       | number  | `50`    | The swipe distance that must be surpassed for touches to be considered back swipe events. Take note - this gesture is only active when the drawer is open; swiping backwards when the drawer is closed does nothing. Can be either a percentage of screen size (a value between `0` and `1`, e.g. `0.15` for 15%) or an absolute pixel value, e.g. `50`).                                                                       |
| prevent_others       | boolean | `true`  | Determines whether to stop event propagation. The edge swipe gestures should _typically_ supersede other touch events. E.g. if [hass-swipe-navigation](https://github.com/zanna-37/hass-swipe-navigation) is running, we don't want edge swipes to trigger dashboard tab changes. However, if this presents problems, it can be disabled by setting the value to `false`                                                        |
| lock_vertical_scroll | boolean | `true`  | Prevents vertical scrolling in the app while either a) the edge swipe gesture is being performed or b) the drawer is already open. This is primarily used to prevent rubber-banding effects with the overscroll animation on newer Android devices (possibly iOS as well) but can be disabled by setting the value to `false`.                                                                                                  |
| exclusions           | list    | `[]`    | A list of selectors to exclude from triggering the edge swipe gesture. When present, if an edge swipe starts within the starting threshold, **but over an item in the exclusion list**, it will be ignored. This allows interaction with specific components whose actions reside within the starting threshold. The exclusion list uses [CSS Selector](https://developer.mozilla.org/en-US/docs/Web/CSS/CSS_selectors) format. |

#### Example:

```
sidebar_swipe:
  start_threshold: 100
  end_threshold: 150
  back_threshold: 100
  prevent_others: true
  lock_vertical_scroll: true
  exclusions:
    - ha-control-slider
```
