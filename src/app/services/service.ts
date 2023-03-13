import { Observable, Subscription } from "rxjs";

export class Service {
  protected subscription: Subscription | null;
  protected handleEvents: Observable<any> | null;

  constructor() {
    this.subscription = null;
    this.handleEvents = null;
  }

  start() {
    if (!this.handleEvents) console.debug("Tried to start but there were no events defined.");
    if (this.subscription) console.debug("Tried to start but service was already started.");
    if (!this.handleEvents || this.subscription) return;
    this.subscription = this.handleEvents.subscribe();
  }

  stop() {
    if (!this.handleEvents) console.debug("Tried to stop but there were no events defined.");
    if (!this.subscription) console.debug("Tried to stop but service was already stopped.");
    if (!this.handleEvents || !this.subscription) return;
    this.subscription.unsubscribe();
    this.subscription = null;
  }
}
