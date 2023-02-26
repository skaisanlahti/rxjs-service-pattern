import createTypedContext from '../../utilities/create-typed-context';
import { api } from '../data-access/todo-data';
import { CounterService } from './counter-service';
import { TodoService } from './todo-service';

/**
 * Creates an object of service instances.
 * @returns Services
 */
export function createServices() {
  return {
    counter: new CounterService(),
    todos: new TodoService(api),
  };
}

export type Services = ReturnType<typeof createServices>;

export const [useServices, ServiceProvider] = createTypedContext<Services>();
