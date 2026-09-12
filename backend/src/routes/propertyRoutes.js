import express from "express";
import {
  createProperty,
  getProperties,
  getProperty,
  updateProperty,
  deleteProperty,
} from "../controllers/propertyController.js";
import { requireAuth } from "../middleware/auth.js";

const router = express.Router();

router.use(requireAuth);

router.post("/", createProperty);
router.get("/", getProperties);
router.get("/:id", getProperty);
router.patch("/:id", updateProperty);
router.delete("/:id", deleteProperty);

export default router;