import {BehaviorSubject, map, switchMap, tap} from 'rxjs'
import {createBackSwipe, createEdgeSwipe} from './events'
import {shadowQuery} from './utils'
import {HaPanelLovelace} from './ha-interfaces'

const drawer = shadowQuery('home-assistant >>> home-assistant-main >>> ha-drawer')
const sidebar = shadowQuery('ha-sidebar', drawer)
const panel = shadowQuery('ha-panel-lovelace', drawer) as HaPanelLovelace

// Get config and set defaults
// TODO: Watch config changes
const {
  start_threshold = 0.1,
  end_threshold = 0.13,
  back_threshold = 50,
  prevent_others = true,
  lock_vertical_scroll = true,
  exclusions = [],
} = panel?.lovelace?.config?.sidebar_swipe || {}

if (sidebar && getComputedStyle(sidebar).display !== 'none') {
  // Sync drawer open state
  const isOpen$ = new BehaviorSubject(false)

  const backSwipe$ = createBackSwipe({
    threshold: back_threshold,
    preventOthers: prevent_others,
  })

  const edgeSwipe$ = createEdgeSwipe({
    startThreshold: start_threshold,
    endThreshold: end_threshold,
    preventOthers: prevent_others,
    lockVerticalScroll: lock_vertical_scroll,
    exclusions,
  })

  if (drawer) {
    new MutationObserver((mutationList: MutationRecord[]) => {
      isOpen$.next(mutationList[0].oldValue === null)
    }).observe(drawer, {attributes: true, attributeOldValue: true, attributeFilter: ['open']})
  }

  isOpen$
    .pipe(
      switchMap((open) =>
        open ? backSwipe$.pipe(map(() => false)) : edgeSwipe$.pipe(map(() => true))
      )
    )
    .subscribe((open: boolean) => {
      shadowQuery('home-assistant >>> home-assistant-main')?.dispatchEvent(
        new CustomEvent('hass-toggle-menu', {detail: {open}})
      )
    })
}
