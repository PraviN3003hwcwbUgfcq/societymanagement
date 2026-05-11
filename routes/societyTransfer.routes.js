import { Router } from "express";
import { verifyJWT } from "../middlewares/auth.middlewares.js";
import {
  createSocietyTransfer,
  getSocietyTransfers,
  updateSocietyTransferStatus,
  deleteSocietyTransfer,
} from "../controllers/societyTransfer.controller.js";

const router = Router();

router.post("/create", verifyJWT, createSocietyTransfer);
router.get("/all", verifyJWT, getSocietyTransfers);
router.patch("/status/:transferId", verifyJWT, updateSocietyTransferStatus);
router.delete("/delete/:transferId", verifyJWT, deleteSocietyTransfer);

export default router;