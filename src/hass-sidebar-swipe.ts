import {BehaviorSubject, switchMap, tap} from 'rxjs'
import {createBackSwipe, createEdgeSwipe} from './events'
import {shadowQuery, unlockBody} from './util'

// TODO: Pull from lovelace config
const config = {
  start_threshold: 0.1,
  end_threshold: 0.13,
  back_threshold: 50,
  prevent_others: true,
  lock_vertical_scroll: true,
}

const isOpen$ = new BehaviorSubject(false)
const backSwipe$ = createBackSwipe({
  threshold: config.back_threshold,
  preventOthers: config.prevent_others,
})
const edgeSwipe$ = createEdgeSwipe({
  startThreshold: config.start_threshold,
  endThreshold: config.end_threshold,
  preventOthers: config.prevent_others,
  lockVerticalScroll: config.lock_vertical_scroll,
})

const drawer = shadowQuery('home-assistant >>> home-assistant-main >>> ha-drawer')

if (drawer) {
  new MutationObserver((mutationList: MutationRecord[]) => {
    isOpen$.next(mutationList[0].oldValue === null)
  }).observe(drawer, {attributes: true, attributeOldValue: true, attributeFilter: ['open']})
}

isOpen$
  .pipe(
    // Clear existing body lock when mneu closes
    tap((open) => config.lock_vertical_scroll && !open && unlockBody()),
    switchMap((open) => (open ? backSwipe$ : edgeSwipe$))
  )
  .subscribe(({open}) => {
    shadowQuery('home-assistant >>> home-assistant-main')?.dispatchEvent(
      new CustomEvent('hass-toggle-menu', {detail: {open}})
    )
  })
