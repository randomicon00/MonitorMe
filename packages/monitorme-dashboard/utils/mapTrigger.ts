import { TriggerRoute /*triggerRoutes*/ } from "../data/data";

export const filterTriggerRoute = (triggerRoute: TriggerRoute) => {
  return true;
};

export const mapTriggerRouteToGrid = (triggerRoute: TriggerRoute) => ({
  spanId: triggerRoute.spanId,
  triggerRoute: triggerRoute.triggerRoute,
});
