import express from "express";
import { updateTenant, deleteTenant } from "../controllers/tenantController.js";
import { requireAuth } from "../middleware/auth.js";

const router = express.Router();

router.use(requireAuth);

router.patch("/:id", updateTenant);
router.delete("/:id", deleteTenant);

export default router;