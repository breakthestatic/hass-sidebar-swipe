import {BehaviorSubject, switchMap} from 'rxjs'
import {SwipeResponse, createBackSwipe, createEdgeSwipe} from './events'
import {shadowQuery} from './util'

const isOpen$ = new BehaviorSubject(false)
const backSwipe$ = createBackSwipe()
const edgeSwipe$ = createEdgeSwipe(0.1, 0.13)

const drawer = shadowQuery('home-assistant >>> home-assistant-main >>> ha-drawer')

const drawerObserver = new MutationObserver((mutationList: MutationRecord[]) => {
  for (const {attributeName, oldValue} of mutationList) {
    if (attributeName === 'open') {
      isOpen$.next(oldValue === null)
    }
  }
})

if (drawer) {
  drawerObserver.observe(drawer, {attributes: true, attributeOldValue: true})
}

isOpen$
  .pipe(switchMap((open) => (open ? backSwipe$ : edgeSwipe$)))
  .subscribe(({open}: SwipeResponse) =>
    shadowQuery('home-assistant >>> home-assistant-main')?.dispatchEvent(
      new CustomEvent('hass-toggle-menu', {detail: {open}})
    )
  )
