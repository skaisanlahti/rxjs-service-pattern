import {
  BehaviorSubject,
  Observable,
  Subject,
  catchError,
  of,
  switchMap,
  tap,
} from 'rxjs';

export default class Task<Result, Input = void> {
  private _dispatch$ = new Subject<Input>();
  private _pending$ = new BehaviorSubject(false);
  private _results$ = new BehaviorSubject<Result | undefined>(undefined);
  private _errors$ = new BehaviorSubject<Error | undefined>(undefined);

  constructor(operation: (params: Input) => Observable<Result>) {
    /**
     * Pipeline that handles pending state, result and error ouput, and canceling duplicate calls.
     */
    this._dispatch$
      .pipe(
        tap(() => {
          console.log(`${operation.name} request`);
          this._pending$.next(true);
        }),
        switchMap((params) => operation(params)),
        tap((result) => {
          console.log(`${operation.name} success`);
          this._results$.next(result);
        }),
        catchError((error) => {
          console.error(error);
          this._errors$.next(error);
          return of(error);
        }),
        tap(() => {
          this._pending$.next(false);
        }),
      )
      .subscribe();
  }

  /**
   * Status of the current operation.
   */
  get pending$() {
    return this._pending$.asObservable();
  }

  /**
   * Observable stream of results.
   */
  get results$() {
    return this._results$.asObservable();
  }

  /**
   * Observable stream of errors.
   */
  get errors$() {
    return this._errors$.asObservable();
  }

  /**
   * Run the operation managed by this task pipeline.
   * @param params Operation parameters
   */
  run(params: Input) {
    this._dispatch$.next(params);
  }
}
