import { Observable, distinctUntilChanged, share } from 'rxjs';

/**
 * Creates a memoized and shared observable by wrapping
 * the input with distinctUntilChanged and share operators.
 * @param stream Source observable
 * @returns Memoized multicast observable
 */
export default function memoizeStream<Type>(stream: Observable<Type>) {
  return stream.pipe(
    distinctUntilChanged(),
    share({ resetOnRefCountZero: true }),
  );
}
