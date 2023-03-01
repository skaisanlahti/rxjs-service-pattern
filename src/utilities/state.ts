import produce from 'immer';
import { BehaviorSubject, Observable, map } from 'rxjs';
import memoizeStream from './memoize-stream';

export default class StateService<StateType> {
  private _state$;

  /**
   * Provides base functionality for handling state and creating selector streams.
   * @param initialState Starting state
   */
  constructor(initialState: StateType) {
    this._state$ = new BehaviorSubject<StateType>(initialState);
  }

  /**
   * Get the current value of the state.
   */
  get() {
    return this._state$.getValue();
  }

  /**
   * Updates the current state and emits the new value through all derived selector streams.
   * @param updater Update operation that takes a mutable Immer draft of the current state as input
   */
  set(updater: (immerDraft: StateType) => void) {
    const nextState = produce(this.get(), updater);
    this._state$.next(nextState);
  }

  /**
   * Create a memoized stream of state changes.
   * Takes an optional selector function to create a derived stream.
   * @param selector Optional selector function
   * @returns Memoized stream of the state
   */
  toStream(): Observable<StateType>;
  toStream<SelectedStateType>(
    selector: (state: StateType) => SelectedStateType,
  ): Observable<SelectedStateType>;
  toStream<SelectedStateType>(
    selector?: (state: StateType) => SelectedStateType,
  ) {
    if (selector) return memoizeStream(this._state$.pipe(map(selector)));
    return memoizeStream(this._state$);
  }
}

export interface State<T> {
  get: () => T;
  set: (updater: (immerDraft: T) => void) => void;
  toStream: {
    (): Observable<T>;
    <S>(selector: (state: T) => S): Observable<S>;
  };
}

/**
 * Provides base functionality for handling state and creating selector streams.
 * @param initialState Starting state
 */
export function State<T>(initialState: T): State<T> {
  const _state$ = new BehaviorSubject<T>(initialState);

  /**
   * Get the current value of the state.
   */
  function get() {
    return _state$.getValue();
  }

  /**
   * Updates the current state and emits the new value through all derived selector streams.
   * @param updater Update operation that takes a mutable Immer draft of the current state as input
   */
  function set(updater: (immerDraft: T) => void) {
    const nextState = produce(get(), updater);
    _state$.next(nextState);
  }

  /**
   * Create a memoized stream of state changes.
   * Takes an optional selector function to create a derived stream.
   * @param selector Optional selector function
   * @returns Memoized stream of the state
   */
  function toStream(): Observable<T>;
  function toStream<S>(selector: (state: T) => S): Observable<S>;
  function toStream<S>(selector?: (state: T) => S) {
    if (selector) return memoizeStream(_state$.pipe(map(selector)));
    return memoizeStream(_state$);
  }

  return {
    get,
    set,
    toStream,
  };
}
