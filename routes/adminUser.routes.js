import { Router } from "express";
import { verifyJWT } from "../middlewares/auth.middlewares.js";
import {
  createAdminUser,
  getAdminUsers,
  updateAdminUserRole,
  toggleAdminUserStatus,
  deleteAdminUser,
} from "../controllers/adminUser.controller.js";

const router = Router();

router.post("/create", verifyJWT, createAdminUser);
router.get("/all", verifyJWT, getAdminUsers);
router.patch("/role/:userId", verifyJWT, updateAdminUserRole);
router.patch("/status/:userId", verifyJWT, toggleAdminUserStatus);
router.delete("/delete/:userId", verifyJWT, deleteAdminUser);

export default router;