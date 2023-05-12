import {BehaviorSubject, switchMap} from 'rxjs'
import {createBackSwipe, createEdgeSwipe} from './events'
import {shadowQuery} from './util'

const isOpen$ = new BehaviorSubject(false)
const backSwipe$ = createBackSwipe()
const edgeSwipe$ = createEdgeSwipe()

const drawer = shadowQuery('home-assistant >>> home-assistant-main >>> ha-drawer')

const drawerObserver = new MutationObserver((mutationList: MutationRecord[]) => {
  isOpen$.next(mutationList[0].oldValue === null)
})

if (drawer) {
  drawerObserver.observe(drawer, {
    attributes: true,
    attributeOldValue: true,
    attributeFilter: ['open'],
  })
}

isOpen$
  .pipe(switchMap((open) => (open ? backSwipe$ : edgeSwipe$)))
  .subscribe(({open}) =>
    shadowQuery('home-assistant >>> home-assistant-main')?.dispatchEvent(
      new CustomEvent('hass-toggle-menu', {detail: {open}})
    )
  )
