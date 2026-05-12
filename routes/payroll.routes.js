// import { Router } from "express";
// import { verifyJWT } from "../middlewares/auth.middlewares.js";
// import {
//   createPayroll,
//   getPayrolls,
//   markPayrollPaid,
//   deletePayroll,
// } from "../controllers/payroll.controller.js";

// const router = Router();

// router.post("/create", verifyJWT, createPayroll);
// router.get("/all", verifyJWT, getPayrolls);
// router.patch("/mark-paid/:payrollId", verifyJWT, markPayrollPaid);
// router.delete("/delete/:payrollId", verifyJWT, deletePayroll);

// export default router;


import { Router } from "express";
import { verifyJWT } from "../middlewares/auth.middlewares.js";
import {
  createPayroll,
  generateMonthlyPayroll,
  getPayrolls,
  markPayrollPaid,
  deletePayroll,
} from "../controllers/payroll.controller.js";

const router = Router();

router.post("/create", verifyJWT, createPayroll);
router.post("/generate-monthly", verifyJWT, generateMonthlyPayroll);
router.get("/all", verifyJWT, getPayrolls);
router.patch("/mark-paid/:payrollId", verifyJWT, markPayrollPaid);
router.delete("/delete/:payrollId", verifyJWT, deletePayroll);

export default router;