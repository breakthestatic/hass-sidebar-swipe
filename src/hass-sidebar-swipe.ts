import {BehaviorSubject, switchMap, tap} from 'rxjs'
import {createBackSwipe, createEdgeSwipe} from './events'
import {shadowQuery} from './utils'
import {unlockBody} from './body-lock'
import {HaPanelLovelace} from './ha-interfaces'

const drawer = shadowQuery('home-assistant >>> home-assistant-main >>> ha-drawer')
const panel = shadowQuery('ha-panel-lovelace', drawer) as HaPanelLovelace

// Get config and set defaults
// TODO: Watch config changes
const {
  start_threshold = 0.1,
  end_threshold = 0.13,
  back_threshold = 50,
  prevent_others = true,
  lock_vertical_scroll = true,
} = panel?.lovelace?.config?.sidebar_swipe || {}

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
})

if (drawer) {
  new MutationObserver((mutationList: MutationRecord[]) => {
    isOpen$.next(mutationList[0].oldValue === null)
  }).observe(drawer, {attributes: true, attributeOldValue: true, attributeFilter: ['open']})
}

isOpen$
  .pipe(
    // Clear existing body lock when mneu closes (regardless of trigger)
    tap((open) => lock_vertical_scroll && !open && unlockBody()),
    switchMap((open) => (open ? backSwipe$ : edgeSwipe$))
  )
  .subscribe(({open}) => {
    shadowQuery('home-assistant >>> home-assistant-main')?.dispatchEvent(
      new CustomEvent('hass-toggle-menu', {detail: {open}})
    )
  })
