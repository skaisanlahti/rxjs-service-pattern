import produce from "immer";
import { BehaviorSubject } from "rxjs";
import { memo } from "./stream-utils";

export default class State<T> {
  private _state$;

  /**
   * Provides base functionality for handling state and creating selector streams.
   * @param initialState Starting state
   */
  constructor(initialState: T) {
    this._state$ = new BehaviorSubject<T>(initialState);
  }

  /**
   * The current value of the state.
   */
  get value() {
    return this._state$.value;
  }

  /**
   * A memoized stream of state changes.
   * @returns Memoized stream of the state changes
   */
  get valueChanges$() {
    return this._state$.pipe(memo());
  }

  /**
   * Create a memoized stream of state changes.
   * Takes a selector function to create a derived stream.
   * @param mapFn selector function
   * @returns Memoized stream of the state changes
   */
  select$<R>(mapFn: (state: T) => R) {
    return this._state$.pipe(memo(mapFn));
  }

  /**
   * Updates the state with a new value and emits it through all derived selector streams.
   * @param value new state value
   */
  set(update: T | ((state: T) => T)) {
    if (update instanceof Function) {
      const state = this._state$.value;
      const nextState = update(state);
      this._state$.next(nextState);
    } else {
      this._state$.next(update);
    }
  }

  /**
   * Updates the state using immer's produce function and emits the new value through all derived selector streams.
   * @param updater Update operation that takes a mutable Immer draft of the current state as input
   */
  mutate(updater: (draft: T) => void) {
    const nextValue = produce(this._state$.value, updater);
    this._state$.next(nextValue);
  }
}
