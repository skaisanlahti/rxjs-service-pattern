import produce from 'immer';
import { BehaviorSubject, Observable, map } from 'rxjs';
import { createSelector } from './utils';

export class StateService<T> {
  private _source;

  constructor(initialState: T) {
    this._source = new BehaviorSubject<T>(initialState);
  }

  get state() {
    return this._source.getValue();
  }

  setState(updater: (immerDraft: T) => void) {
    const nextState = produce(this.state, updater);
    this._source.next(nextState);
  }

  createSelector(): Observable<T>;
  createSelector<K>(selector: (state: T) => K): Observable<K>;
  createSelector<K>(selector?: (state: T) => K) {
    if (selector) return createSelector(this._source.pipe(map(selector)));
    return createSelector(this._source);
  }
}
