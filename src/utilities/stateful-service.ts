import produce from 'immer';
import { BehaviorSubject, Observable, map } from 'rxjs';
import createSelector from './create-selector';

export default class StatefulService<State> {
  private _state$;

  /**
   * Provides base functionality for handling state and creating observable streams of the state.
   * @param initialState Starting state
   */
  constructor(initialState: State) {
    this._state$ = new BehaviorSubject<State>(initialState);
  }

  /**
   * Get the current value of the state.
   */
  get state() {
    return this._state$.getValue();
  }

  /**
   * Updates the current state and emits the new value through all derived selector streams.
   * @param updater Update operation that takes a mutable Immer draft of the current state as input
   */
  setState(updater: (immerDraft: State) => void) {
    const nextState = produce(this.state, updater);
    this._state$.next(nextState);
  }

  /**
   * Creates a memoized observable stream from the state.
   */
  createSelector(): Observable<State>;
  createSelector<SelectedState>(
    selector: (state: State) => SelectedState,
  ): Observable<SelectedState>;
  createSelector<SelectedState>(selector?: (state: State) => SelectedState) {
    if (selector) return createSelector(this._state$.pipe(map(selector)));
    return createSelector(this._state$);
  }
}
