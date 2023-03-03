import createTypedContext from '../../utilities/create-typed-context';
import { api } from '../data-layer/todo-data';
import { CounterService } from './counter-service';
import { TodoService } from './todo-service';

export const services = {
  counter: new CounterService(),
  todos: new TodoService(api),
};

export type Services = typeof services;

export const [useServices, ServiceProvider] = createTypedContext<Services>();
