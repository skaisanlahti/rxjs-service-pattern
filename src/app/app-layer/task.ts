import {
  BehaviorSubject,
  Observable,
  Subject,
  catchError,
  of,
  switchMap,
  tap,
} from 'rxjs';

export class Task<T, P = void> {
  private _dispatch$ = new Subject<P>();
  private _inProgress$ = new BehaviorSubject(false);
  private _results$ = new BehaviorSubject<T | undefined>(undefined);
  private _errors$ = new BehaviorSubject<Error | undefined>(undefined);

  constructor(operation: (params: P) => Observable<T>) {
    // build loading states and error handling around operation
    this._dispatch$
      .pipe(
        tap(() => {
          console.log(`${operation.name} request`);
          this._inProgress$.next(true);
        }),
        switchMap((params) => operation(params)),
        tap((result) => {
          console.log(`${operation.name} success`);
          this._inProgress$.next(false);
          this._results$.next(result);
        }),
        catchError((error) => {
          console.error(error);
          this._inProgress$.next(false);
          this._errors$.next(error);
          return of(error);
        }),
      )
      .subscribe();
  }

  get inProgress$() {
    return this._inProgress$.asObservable();
  }

  get results$() {
    return this._results$.asObservable();
  }

  get errors$() {
    return this._errors$.asObservable();
  }

  run(params: P) {
    this._dispatch$.next(params);
  }
}
