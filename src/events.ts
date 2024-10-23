import {filter, fromEvent, map, switchMap, take, takeLast, takeUntil, tap} from 'rxjs'
import {lockBody, unlockBody} from './body-lock'
import {isExcluded, toPixelValue} from './utils'

export interface EdgeSwipeConfig {
  startThreshold: number
  endThreshold: number
  preventOthers: boolean
  lockVerticalScroll: boolean
  exclusions: string[]
  invert: 1 | -1
}

export interface BackSwipeConfig {
  threshold: number
  preventOthers: boolean
  invert: 1 | -1
}

export const createEdgeSwipe = ({
  startThreshold,
  endThreshold,
  preventOthers,
  lockVerticalScroll,
  exclusions,
  invert,
}: EdgeSwipeConfig) =>
  fromEvent<TouchEvent>(document, 'touchstart', {capture: preventOthers}).pipe(
    filter((event) => !isExcluded(event, exclusions)),
    map((event) => ({x: event.touches[0].clientX, y: event.touches[0].clientY, event})),
    filter(({x}) => (x - (innerWidth * (1 - invert)) / 2) * invert < toPixelValue(startThreshold)),
    tap(({event}) => {
      lockVerticalScroll && lockBody()
      preventOthers && event.stopPropagation()
    }),
    switchMap(({x: startingX, y: startingY}) =>
      fromEvent<TouchEvent>(document, 'touchmove', {capture: preventOthers}).pipe(
        filter(({touches}) => touches.length < 2),
        tap((event) => preventOthers && event?.stopPropagation()),
        takeUntil(
          fromEvent<TouchEvent>(document, 'touchend', {capture: preventOthers}).pipe(
            tap((event) => {
              lockVerticalScroll && unlockBody()
              preventOthers && event?.stopPropagation()
            }),
            take(1)
          )
        ),
        takeLast(1),
        map(({changedTouches: [{clientX, clientY}]}) => ({x: clientX, y: clientY})),
        // Horizontal swipes only
        filter(({x, y}) => Math.abs(x - startingX) > Math.abs(y - startingY)),
        // Reaches end threshold from either direction (based on inverted value)
        filter(({x}) => (x - (innerWidth * (1 - invert)) / 2) * invert > toPixelValue(endThreshold))
      )
    )
  )

export const createBackSwipe = ({preventOthers, threshold, invert}: BackSwipeConfig) =>
  fromEvent<TouchEvent>(document, 'touchstart').pipe(
    tap((event) => preventOthers && event.stopPropagation()),
    switchMap(({touches: [{clientX: startingX, clientY: startingY}]}) =>
      fromEvent<TouchEvent>(document, 'touchend').pipe(
        map(({changedTouches: [{clientX, clientY}]}) => ({x: clientX, y: clientY})),
        // Horizontal swipes only
        filter(({x, y}) => Math.abs(x - startingX) > Math.abs(y - startingY)),
        // Touch delta is greater than threshold amount (accounting for direction based on invert prop)
        filter(({x}) => (startingX - x) * invert > toPixelValue(threshold)),
        take(1)
      )
    )
  )
