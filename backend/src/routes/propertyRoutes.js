import express from "express";
import {
  createProperty,
  getProperties,
  getProperty,
  updateProperty,
  deleteProperty,
  addPropertyImages,
  deletePropertyImage,
  setCoverImage,
} from "../controllers/propertyController.js";
import { requireAuth } from "../middleware/auth.js";

const router = express.Router();

router.use(requireAuth);

router.post("/", createProperty);
router.get("/", getProperties);
router.get("/:id", getProperty);
router.patch("/:id", updateProperty);
router.delete("/:id", deleteProperty);

router.post("/:id/images", addPropertyImages);
router.delete("/:id/images/:imageId", deletePropertyImage);
router.patch("/:id/images/:imageId/cover", setCoverImage);

export default router;
