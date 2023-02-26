import { api } from '../data-layer/todo-data';
import { CounterService } from './counter-service';
import { createTypedContext } from './create-typed-context';
import { TodoService } from './todo-service';

export function createServices() {
  const counter = new CounterService();
  const todos = new TodoService(api);

  return {
    counter,
    todos,
  };
}

export type Services = ReturnType<typeof createServices>;

export const [useServices, ServiceProvider] = createTypedContext<Services>();
