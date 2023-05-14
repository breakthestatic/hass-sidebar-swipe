import {filter, fromEvent, map, switchMap, take, takeLast, takeUntil, tap} from 'rxjs'
import {lockBody} from './util'

export interface EdgeSwipeConfig {
  startThreshold: number
  endThreshold: number
  preventOthers: boolean
  lockVerticalScroll: boolean
}

export interface BackSwipeConfig {
  threshold: number
  preventOthers: boolean
}

export const createEdgeSwipe = ({
  startThreshold,
  endThreshold,
  preventOthers,
  lockVerticalScroll,
}: EdgeSwipeConfig) =>
  fromEvent<TouchEvent>(document, 'touchstart', {capture: preventOthers}).pipe(
    filter(({touches: [{pageX}]}) => pageX < window.innerWidth * startThreshold),
    tap((event) => {
      lockVerticalScroll && lockBody()
      preventOthers && event.stopPropagation()
    }),
    switchMap(() =>
      fromEvent<TouchEvent>(document, 'touchmove').pipe(
        takeUntil(fromEvent<TouchEvent>(document, 'touchend').pipe(take(1))),
        takeLast(1),
        filter(({touches: [{pageX}]}) => pageX > window.innerWidth * endThreshold),
        map((event) => ({open: true, event}))
      )
    )
  )

export const createBackSwipe = ({preventOthers, threshold}: BackSwipeConfig) =>
  fromEvent<TouchEvent>(document, 'touchstart').pipe(
    tap((event) => preventOthers && event.stopPropagation()),
    switchMap((touchstart) =>
      fromEvent<TouchEvent>(document, 'touchmove').pipe(
        takeUntil(fromEvent(document, 'touchend').pipe(take(1))),
        takeLast(1),
        filter(
          ({touches: [{pageX}]}) => Math.round(touchstart.touches[0].pageX - pageX) > threshold
        ),
        map((event) => ({open: false, event}))
      )
    )
  )
