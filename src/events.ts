import {filter, fromEvent, map, switchMap, take, takeLast, takeUntil, tap} from 'rxjs'

export interface SwipeResponse {
  open: boolean
  event: TouchEvent
}

export const createEdgeSwipe = (
  startThreshold: number,
  endThreshold: number,
  preventOthers: boolean = true
) =>
  fromEvent<TouchEvent>(document, 'touchstart', {capture: preventOthers}).pipe(
    filter(({touches: [{pageX}]}) => pageX < window.innerWidth * startThreshold),
    tap((event) => preventOthers && event.stopPropagation()),
    switchMap(() =>
      fromEvent<TouchEvent>(document, 'touchmove').pipe(
        takeUntil(fromEvent<TouchEvent>(document, 'touchend').pipe(take(1))),
        takeLast(1),
        filter(({touches: [{pageX}]}) => pageX > window.innerWidth * endThreshold),
        map((event) => ({open: true, event}))
      )
    )
  )

export const createBackSwipe = (threshold: number = 50, preventOthers: boolean = true) =>
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
