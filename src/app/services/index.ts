import createTypedContext from "../../utilities/create-typed-context";
import { buildChecklist } from "./checklist";
import { buildCounter } from "./counter";

const { checklist, checklistService } = buildChecklist();
checklistService.start();

const { counter, counterService } = buildCounter(0);
counterService.start();

export const app = {
  counter: counter,
  checklist: checklist,
};

export type Application = typeof app;

export const [useApp, ApplicationProvider] = createTypedContext<Application>();
