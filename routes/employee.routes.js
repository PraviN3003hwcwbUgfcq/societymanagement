import { Router } from "express";
import { verifyJWT } from "../middlewares/auth.middlewares.js";
import {
  createEmployee,
  getEmployees,
  toggleEmployeeStatus,
  deleteEmployee,
} from "../controllers/employee.controller.js";

const router = Router();

router.post("/create", verifyJWT, createEmployee);
router.get("/all", verifyJWT, getEmployees);
router.patch("/toggle-status/:employeeId", verifyJWT, toggleEmployeeStatus);
router.delete("/delete/:employeeId", verifyJWT, deleteEmployee);

export default router;