import createTypedContext from "../../utilities/create-typed-context";
import { api } from "../data-access/todo-data";
import { CounterService } from "./counter-service";
import { TodoService } from "./todo-service";

export const services = {
  counterService: new CounterService(),
  todoService: new TodoService(api),
};

export type Services = typeof services;

export const [useServices, ServiceProvider] = createTypedContext<Services>();
