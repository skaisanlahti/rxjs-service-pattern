import { Observable, distinctUntilChanged, share } from 'rxjs';

/**
 * Creates a memoized and shared observable by wrapping it with distinctUntilChanged and share operators.
 * @param obs Source observable
 * @returns Memoized multicast observable
 */
export default function createSelector<T>(obs: Observable<T>) {
  return obs.pipe(distinctUntilChanged(), share({ resetOnRefCountZero: true }));
}
