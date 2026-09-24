import express from "express";
import { createLease, getLease, endLease, getActiveLeases, updateLeaseAgreement } from "../controllers/leaseController.js";
import { requireAuth } from "../middleware/auth.js";

const router = express.Router();

router.use(requireAuth);

router.post("/", createLease);
router.get("/", getActiveLeases);
router.get("/:id", getLease);
router.patch("/:id/end", endLease);
router.patch("/:id/agreement", updateLeaseAgreement);


export default router;