import produce from "immer";
import { useObservable, useObservableState, useSubscription } from "observable-hooks";
import { useMemo, useSyncExternalStore } from "react";
import {
  BehaviorSubject,
  Observable,
  SubjectLike,
  UnaryFunction,
  distinctUntilChanged,
  map,
  pipe,
  share,
  switchMap,
  tap,
  withLatestFrom,
} from "rxjs";

/**
 * Creates a memoized multicast stream from source observable.
 * @param mapFn optional mapping function
 * @returns memoized multicast stream
 */
export function memo<T>(): UnaryFunction<Observable<T>, Observable<T>>;
export function memo<T, R>(mapFn: (value: T) => R): UnaryFunction<Observable<T>, Observable<R>>;
export function memo<T, R>(mapFn?: (value: T) => R): UnaryFunction<Observable<T>, Observable<R>>;
export function memo<T, R>(mapFn?: (value: T) => R) {
  if (mapFn) return pipe(map(mapFn), distinctUntilChanged(), share({ resetOnRefCountZero: true }));
  return pipe(distinctUntilChanged(), share({ resetOnRefCountZero: true }));
}

export function update<T, P = void>(
  state: BehaviorSubject<T>,
  getNextState: ([payload, state]: [P, T]) => T
): UnaryFunction<Observable<P>, Observable<T>> {
  return pipe(withLatestFrom(state), map(getNextState), tap(emit(state)));
}

/**
 * Immer's produce function as an operator.
 * @param recipe immer recipe
 * @returns immutable state
 */
export function mutate<T>(recipe: (draft: T) => void): UnaryFunction<Observable<T>, Observable<T>> {
  return pipe(map((value) => produce(value, recipe)));
}

/**
 * Memoizes a stream when component mounts and returns values from the stream.
 * @param state source stream
 * @returns value from stream
 */
export function useValues<T>(state: BehaviorSubject<T>) {
  const memoizedObservable = useObservable(() => state.pipe(memo()));
  const initialValue = state.getValue();
  return useObservableState(memoizedObservable, initialValue);
}

/**
 * Create an observable from inputs and subscribe to it on mount and whenever inputs change.
 * @param observableFactory Switch map operation that takes parameters as arguments.
 * @param parameters Tuple of parameters
 */
export function useSwitchMap<Result, Parameters extends Readonly<any[]>>(
  observableFactory: (parameters: [...Parameters]) => Observable<Result>,
  parameters: [...Parameters]
) {
  const observable = useObservable((observable) => observable.pipe(switchMap(observableFactory)), parameters);
  useSubscription(observable);
}

export function useOnMount<Return>(observableFactory: () => Observable<Return>) {
  const observable = useObservable(observableFactory);
  useSubscription(observable);
}

export function emit<T>(stream: SubjectLike<T>) {
  return (value: T) => stream.next(value);
}

function subscribe<T>(observable: Observable<T>) {
  return (reactObserver: () => void) => {
    const subscription = observable.subscribe(reactObserver);
    return () => {
      subscription.unsubscribe();
    };
  };
}

function getSnapshot<T>(store: BehaviorSubject<T>) {
  return () => {
    return store.value;
  };
}

export function useBehaviorSubject<T>(subject: BehaviorSubject<T>) {
  const stableSubject = useMemo(() => subject, [subject]);
  return useSyncExternalStore(subscribe(stableSubject), getSnapshot(stableSubject));
}
