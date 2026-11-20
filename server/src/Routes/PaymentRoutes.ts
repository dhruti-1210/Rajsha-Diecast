import { Router } from "express";

import {
  createOrder,
  verifyPayment,
} from "../controller/paymentController";
import { authMiddleware } from "../middleware/authMiddleWare";

const router = Router();

router.post("/create-order", authMiddleware, createOrder);

router.post("/verify", authMiddleware, verifyPayment);

export default router;