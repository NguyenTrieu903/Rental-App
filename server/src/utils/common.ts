import { Router } from "express";
import { RouteConfig } from "./routeTypes";

export function applyRoutes(router: Router, routes: RouteConfig[]): Router {
  routes.forEach((route) => {
    router[route.method](route.path, ...route.middlewares, route.handler);
  });
  return router;
}
