import createTypedContext from '../../utilities/create-typed-context';
import { counterService } from './counter-service';
import { todoService } from './todo-service';

export const services = {
  counter: counterService,
  todos: todoService,
};

export type Services = typeof services;

export const [useServices, ServiceProvider] = createTypedContext<Services>();
