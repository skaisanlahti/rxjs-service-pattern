import produce from 'immer';
import { BehaviorSubject, map } from 'rxjs';
import memoizeStream from './memoize-stream';

export default class State<TState> {
  private _state$;

  /**
   * Provides base functionality for handling state and creating selector streams.
   * @param initialState Starting state
   */
  constructor(initialState: TState) {
    this._state$ = new BehaviorSubject<TState>(initialState);
  }

  /**
   * The current value of the state.
   */
  get value() {
    return this._state$.getValue();
  }

  /**
   * A memoized stream of state changes.
   * @returns Memoized stream of the state changes
   */
  get valueChanges$() {
    return memoizeStream(this._state$);
  }

  /**
   * Create a memoized stream of state changes.
   * Takes a selector function to create a derived stream.
   * @param selector selector function
   * @returns Memoized stream of the state changes
   */
  select<TSelector>(selector: (state: TState) => TSelector) {
    return memoizeStream(this._state$.pipe(map(selector)));
  }

  /**
   * Updates the state with a new value and emits it through all derived selector streams.
   * @param value new state value
   */
  set(value: TState) {
    this._state$.next(value);
  }

  /**
   * Updates the state with an updater function and emits the new value through all derived selector streams.
   * @param updater Update operation that takes the current state and returns a new state.
   */
  update(updater: (state: TState) => TState) {
    const nextState = updater(this._state$.getValue());
    this._state$.next(nextState);
  }

  /**
   * Updates the state using immer's produce function and emits the new value through all derived selector streams.
   * @param updater Update operation that takes a mutable Immer draft of the current state as input
   */
  mutate(updater: (immerDraft: TState) => void) {
    const nextState = produce(this._state$.getValue(), updater);
    this._state$.next(nextState);
  }
}
