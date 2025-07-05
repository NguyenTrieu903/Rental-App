import express from "express";
import { authMiddleware } from "../middleware/authMiddleware";
import { getLease, getLeasePayments } from "../controllers/leaseController";

const router = express.Router();

router.get("/", authMiddleware(["manager", "tenant"]), getLease);
router.get(
  "/:id/payments",
  authMiddleware(["manager", "tenant"]),
  getLeasePayments
);

export default router;
