import express from "express";
import {
  createUnit,
  getUnits,
  getUnit,
  updateUnit,
  deleteUnit,
} from "../controllers/unitController.js";
import { requireAuth } from "../middleware/auth.js";

const router = express.Router();

router.use(requireAuth);

router.post("/", createUnit);
router.get("/", getUnits);
router.get("/:id", getUnit);
router.patch("/:id", updateUnit);
router.delete("/:id", deleteUnit);

export default router;