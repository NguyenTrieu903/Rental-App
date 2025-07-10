import express, { Router, RequestHandler } from "express";
import { authMiddleware } from "../middleware/authMiddleware";
import * as applicationController from "../controllers/applicationControllers";
import { ROLES } from "../utils/contants";
import { RouteConfig } from "../utils/routeTypes";
import { applyRoutes } from "../utils/common";

const applicationRoutes: RouteConfig[] = [
  {
    path: "/",
    method: "post",
    middlewares: [authMiddleware([ROLES.TENANT])],
    handler: applicationController.createApplication,
  },
  {
    path: "/:id/status",
    method: "put",
    middlewares: [authMiddleware([ROLES.MANAGER])],
    handler: applicationController.updateApplicationStatus,
  },
  {
    path: "/",
    method: "get",
    middlewares: [authMiddleware([ROLES.MANAGER, ROLES.TENANT])],
    handler: applicationController.listApplications,
  },
];

const router = express.Router();
applyRoutes(router, applicationRoutes);

export default router;
