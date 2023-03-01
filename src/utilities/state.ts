import produce from 'immer';
import { BehaviorSubject, Observable, map } from 'rxjs';
import memoizeStream from './memoize-stream';

export default class State<StateType> {
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
