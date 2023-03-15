import produce from "immer";
import { useMemo, useSyncExternalStore } from "react";
import {
  BehaviorSubject,
  Observable,
  SubjectLike,
  Subscription,
  UnaryFunction,
  distinctUntilChanged,
  map,
  pipe,
  share,
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
  return pipe(withLatestFrom(state), map(getNextState), set(state));
}

/**
 * Immer's produce function as an operator.
 * @param recipe immer recipe
 * @returns immutable state
 */
export function mutate<T>(recipe: (draft: T) => void): UnaryFunction<Observable<T>, Observable<T>> {
  return pipe(map((value) => produce(value, recipe)));
}

export function set<T>(stream: SubjectLike<T>) {
  return pipe(tap((value: T) => stream.next(value)));
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

export class Computed<Source, Computed> extends BehaviorSubject<Computed> {
  private sourceSubscription: Subscription;

  constructor(sourceSubject: BehaviorSubject<Source>, mapFn: (state: Source) => Computed) {
    super(mapFn(sourceSubject.value));
    this.sourceSubscription = sourceSubject.pipe(map(mapFn)).subscribe(this);
  }

  complete(): void {
    this.sourceSubscription.unsubscribe();
    super.complete();
  }
}
