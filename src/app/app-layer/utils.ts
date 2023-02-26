import { Observable, distinctUntilChanged, share } from 'rxjs';

export function createSelector<T>(obs: Observable<T>) {
  return obs.pipe(distinctUntilChanged(), share({ resetOnRefCountZero: true }));
}

export default function genId() {
  return crypto.randomUUID();
}

export { useObservableState as useServiceState } from 'observable-hooks';
