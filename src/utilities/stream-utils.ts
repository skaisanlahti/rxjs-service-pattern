import produce from "immer";
import { Observable, UnaryFunction, distinctUntilChanged, map, pipe, shareReplay } from "rxjs";

/**
 * Creates a memoized multicast stream from source observable.
 * @param mapFn optional mapping function
 * @returns memoized multicast stream
 */
export function memo<T>(): UnaryFunction<Observable<T>, Observable<T>>;
export function memo<T, R>(mapFn: (value: T) => R): UnaryFunction<Observable<T>, Observable<R>>;
export function memo<T, R>(mapFn?: (value: T) => R) {
  if (mapFn) return pipe(map(mapFn), distinctUntilChanged(), shareReplay({ refCount: true, bufferSize: 1 }));
  return pipe(distinctUntilChanged(), shareReplay({ refCount: true, bufferSize: 1 }));
}

/**
 * Immer's produce function as an operator.
 * @param recipe immer recipe
 * @returns immutable state
 */
export function mutate<T>(recipe: (draft: T) => void): UnaryFunction<Observable<T>, Observable<T>> {
  return pipe(map((value) => produce(value, recipe)));
}
