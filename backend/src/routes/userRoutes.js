import express from "express";
import { dismissOnboarding } from "../controllers/userController.js";
import { requireAuth } from "../middleware/auth.js";

const router = express.Router();

router.use(requireAuth);

router.patch("/me/onboarding", dismissOnboarding);

export default router;