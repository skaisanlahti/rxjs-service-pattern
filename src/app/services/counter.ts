import { BehaviorSubject, Subject, merge } from "rxjs";
import { update, useValues } from "../../utilities/stream-utils";
import { Service } from "./service";

function add(amount: number) {
  return ([, count]: [void, number]) => count + amount;
}

function subtract(amount: number) {
  return ([, count]: [void, number]) => count - amount;
}

function multiplyBy(multiplier: number) {
  return ([, count]: [void, number]) => count * multiplier;
}

function set(value: number) {
  return () => value;
}

class CounterState {
  readonly count;
  constructor(startWith: number) {
    this.count = new BehaviorSubject(startWith);
  }
}

class CounterEvents {
  readonly addClicked = new Subject<void>();
  readonly subtractClicked = new Subject<void>();
  readonly doubleClicked = new Subject<void>();
  readonly resetClicked = new Subject<void>();
}

class CounterService extends Service {
  constructor(public readonly state: CounterState, public readonly events: CounterEvents) {
    super();
    const handleAddClicked = events.addClicked.pipe(update(state.count, add(1)));
    const handleSubtractClicked = events.subtractClicked.pipe(update(state.count, subtract(1)));
    const handleDoubleClicked = events.doubleClicked.pipe(update(state.count, multiplyBy(2)));
    const handleResetClicked = events.resetClicked.pipe(update(state.count, set(0)));
    this.handleEvents = merge(handleAddClicked, handleSubtractClicked, handleDoubleClicked, handleResetClicked);
  }
}

class CounterFacade {
  constructor(public readonly service: CounterService) {}

  useCount() {
    return useValues(this.service.state.count);
  }

  add() {
    this.service.events.addClicked.next();
  }

  subtract() {
    this.service.events.subtractClicked.next();
  }

  double() {
    this.service.events.doubleClicked.next();
  }

  reset() {
    this.service.events.resetClicked.next();
  }
}

export function buildCounter(startWith = 0) {
  const counterEvents = new CounterEvents();
  const counterState = new CounterState(startWith);
  const counterService = new CounterService(counterState, counterEvents);
  const counter = new CounterFacade(counterService);
  return { counter, counterService };
}
