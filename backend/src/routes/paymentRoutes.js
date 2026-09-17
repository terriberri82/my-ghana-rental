import express from "express";
import {
  createPayment,
  getPayments,
  getPayment,
  updatePayment,
  deletePayment,
} from "../controllers/paymentController.js";
import { requireAuth } from "../middleware/auth.js";

const router = express.Router();

router.use(requireAuth);

router.post("/", createPayment);
router.get("/", getPayments);
router.get("/:id", getPayment);
router.patch("/:id", updatePayment);
router.delete("/:id", deletePayment);

export default router;