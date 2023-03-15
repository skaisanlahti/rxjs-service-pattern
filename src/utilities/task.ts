import {
  BehaviorSubject,
  Observable,
  RetryConfig,
  Subject,
  SubjectLike,
  catchError,
  from,
  map,
  of,
  retry,
  switchMap,
  takeUntil,
  tap,
  timer,
} from "rxjs";

function start(name: string, pending$: SubjectLike<boolean>) {
  return () => {
    console.debug(`[${name}] task started.`);
    pending$.next(true);
  };
}

function success<T>(name: string, result$: SubjectLike<T>) {
  return (value: T) => {
    console.debug(`[${name}] task finished.`);
    result$.next(value);
  };
}

function fail(name: string, error$: SubjectLike<any>) {
  return (error: any) => {
    console.error(`[${name}] task failed: ${error}.`);
    error$.next(error);
    return of(error);
  };
}

function finish(pending$: SubjectLike<boolean>) {
  return () => {
    pending$.next(false);
  };
}

type ObservableFn<R, P = void> = (params: P) => Observable<R>;
type PromiseFn<R, P = void> = (params: P) => Promise<R>;

type TaskOptions = {
  name?: string;
  retry?: { count: number; delay: number };
};

function validateOptions<R, P = void>(fn: ObservableFn<R, P>, options?: TaskOptions) {
  const name = options?.name ?? fn.name;
  const retry = options?.retry ?? { count: 0, delay: 0 };
  return { name, retry };
}

export const defaultRetry: TaskOptions = {
  retry: { count: 5, delay: 3000 },
};

export class Task<Result, Parameters = void> {
  private cancelTask = new Subject<void>();
  private task;
  private name;
  private retry;

  results = new Subject<Result>();
  errors = new Subject<Error>();
  pending = new BehaviorSubject(false);

  /**
   * Provides pending state, result and error streams, as well as automatic
   * canceling and retry options for asyncronous operations.
   * @param observableFn observable operation
   * @param options task options
   */
  constructor(observableFn: ObservableFn<Result, Parameters>, options?: TaskOptions) {
    const { name, retry } = validateOptions(observableFn, options);
    this.task = observableFn;
    this.name = name;
    this.retry = {
      count: retry.count,
      delay: (error, retries) => {
        const nextDelayInSeconds = (retry.delay * retries) / 1000;
        console.error(`[${name}] task failed. Retrying after ${nextDelayInSeconds} seconds...`);
        return timer(retry.delay * retries).pipe(map(() => error));
      },
    } as RetryConfig;
  }

  /**
   * Transforms a promise based operation into an observable and creates a new Task from it.
   * @param promiseFn async operation
   * @param options task options
   * @returns new Task
   */
  static from<Result, Parameters = void>(promiseFn: PromiseFn<Result, Parameters>, options?: TaskOptions) {
    const task = (params: Parameters) => from(promiseFn(params));
    const taskName = options?.name ?? promiseFn.name;
    return new Task(task, { ...options, name: taskName });
  }

  /**
   * Cancel on-going tasks and build a new operation from the provided parameters.
   * @param params task parameters
   * @returns observable operation
   */
  buildTask(params: Parameters) {
    if (this.pending.value) this.cancelTask.next();
    return of(params).pipe(
      tap(start(this.name, this.pending)),
      switchMap((params) => this.task(params)),
      tap(success(this.name, this.results)),
      retry(this.retry),
      catchError(fail(this.name, this.errors)),
      tap(finish(this.pending)),
      takeUntil(this.cancelTask)
    );
  }
}
