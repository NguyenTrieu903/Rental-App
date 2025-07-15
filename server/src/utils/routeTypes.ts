import { RequestHandler } from "express";

export interface RouteConfig {
  path: string;
  method: "get" | "post" | "put" | "delete" | "patch";
  middlewares: RequestHandler[];
  handler: RequestHandler;
}
