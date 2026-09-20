import express from "express";
import {
  signup,
  login,
  logout,
  getMe,
  updateProfile,
  changePassword,
} from "../controllers/authController.js";
import { requireAuth } from "../middleware/auth.js";

const router = express.Router();

router.post("/signup", signup);
router.post("/login", login);
router.post("/logout", logout);
router.get("/me", requireAuth, getMe);
router.patch("/me", requireAuth, updateProfile);
router.patch("/password", requireAuth, changePassword);

export default router;
