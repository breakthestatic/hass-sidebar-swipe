import {filter, fromEvent, map, switchMap, take, takeLast, takeUntil, tap} from 'rxjs'
import {lockBody, unlockBody} from './body-lock'
import {toPixelValue} from './utils'

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
    filter(({touches: [{pageX}]}) => pageX < toPixelValue(startThreshold)),
    tap((event) => {
      lockVerticalScroll && lockBody()
      preventOthers && event.stopPropagation()
    }),
    switchMap(() =>
      fromEvent<TouchEvent>(document, 'touchend').pipe(
        take(1),
        filter(({changedTouches: [{clientX}]}) => {
          const thresholdMet = clientX > toPixelValue(endThreshold)

          // Revert body lock state if gesture doesn't complete
          lockVerticalScroll && !thresholdMet && unlockBody()

          return thresholdMet
        }),
        map((event) => ({open: true, event}))
      )
    )
  )

export const createBackSwipe = ({preventOthers, threshold}: BackSwipeConfig) =>
  fromEvent<TouchEvent>(document, 'touchstart').pipe(
    tap((event) => preventOthers && event.stopPropagation()),
    switchMap(({touches: [{pageX}]}) =>
      fromEvent<TouchEvent>(document, 'touchend').pipe(
        take(1),
        filter(({changedTouches: [{clientX}]}) => pageX - clientX > toPixelValue(threshold)),
        map((event) => ({open: false, event}))
      )
    )
  )
