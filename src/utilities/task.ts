import {
  BehaviorSubject,
  Observable,
  Subject,
  catchError,
  from,
  map,
  of,
  retry,
  switchMap,
  takeUntil,
  tap,
  timer,
} from 'rxjs';

interface TaskOptions {
  name?: string;
  retry?: RetryConfig;
}

interface RetryConfig {
  count: number;
  delay: number;
}

function validateRetryConfig(retryOptions?: RetryConfig) {
  if (!retryOptions) return null;
  if (retryOptions.count < 0 && retryOptions.delay < 0) return null;
  return retryOptions;
}

export default class Task<Result, Parameters = void> {
  private _cancel$ = new Subject<void>();
  private _pending$ = new BehaviorSubject(false);
  private _results$ = new BehaviorSubject<Result | undefined>(undefined);
  private _errors$ = new BehaviorSubject<Error | undefined>(undefined);
  private _handler;

  /**
   * Wraps an asynchronous operation inside a task handler that provides pending, result, and error states.
   * Automatically cancels duplicate calls by canceling old ones and runs only the latest one.
   * @param operation Function that returns an observable
   * @param options Optional retry config and name for logging
   */
  constructor(
    operation: (params: Parameters) => Observable<Result>,
    options?: TaskOptions,
  ) {
    // validate options
    const name = options?.name ? options.name : operation.name;
    const retryConfig = validateRetryConfig(options?.retry);
    const count = retryConfig ? retryConfig.count : 0;
    const delay = retryConfig ? retryConfig.delay : 0;

    // build pipeline around the operation
    this._handler = (params: Parameters) => {
      // cancel previous task if its still pending
      if (this._pending$.getValue()) {
        this._cancel$.next();
      }

      // create new task
      return of(params).pipe(
        // update pending state at start
        tap(() => {
          console.debug(`[${name}] task started.`);
          this._pending$.next(true);
        }),

        // run operation
        switchMap((params) => operation(params)),

        // update results on success
        tap((result) => {
          console.debug(`[${name}] task finished.`);
          this._results$.next(result);
        }),

        // if operation fails, retry with increasing delay
        retry({
          count,
          delay: (error, timesRetried) => {
            console.error(
              `[${name}] task failed. Retrying after ${
                (delay * timesRetried) / 1000
              } seconds...`,
            );

            return timer(delay * timesRetried).pipe(map(() => error));
          },
        }),

        // handle error incase retries failed
        catchError((error) => {
          console.error(`[${name}] task failed: ${error}.`);
          this._errors$.next(error);
          return of(error);
        }),

        // finalize pending state
        tap(() => {
          this._pending$.next(false);
        }),

        // abort operation on duplicate calls
        takeUntil(this._cancel$),
      );
    };
  }

  /**
   * Converts a promise into an observable and returns a task handler.
   * @param promiseFunction Async function that returns a promise
   * @param options Optional task options
   * @returns Task handler
   */
  static fromPromise<Result, Parameters = void>(
    promiseFunction: (params: Parameters) => Promise<Result>,
    options?: TaskOptions,
  ) {
    const operation = (params: Parameters) => from(promiseFunction(params));
    const operationName = options?.name ? options.name : promiseFunction.name;
    return new Task(operation, { ...options, name: operationName });
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
   * To see results, subscribe to the results stream.
   * @param params Operation parameters
   */
  run(params: Parameters) {
    this._handler(params).subscribe();
  }
}
