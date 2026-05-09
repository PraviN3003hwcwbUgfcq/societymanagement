// import { Router } from "express";
// import { verifyJWT } from "../middlewares/auth.middlewares.js";
// import { addExpense, getExpenses,  getTransactions, } from "../controllers/treasurer.controller.js";

// const router = Router();

// router.post("/add-expense", verifyJWT, addExpense);
// router.get("/expenses", verifyJWT, getExpenses);
// router.get("/transactions", verifyJWT, getTransactions);

// export default router;






import { Router } from "express";
import { verifyJWT } from "../middlewares/auth.middlewares.js";
import {
  addExpense,
  getExpenses,
  getTransactions,
  getMaintenanceCollection,
  getTreasurerSummary,
} from "../controllers/treasurer.controller.js";

const router = Router();

router.post("/add-expense", verifyJWT, addExpense);
router.get("/expenses", verifyJWT, getExpenses);
router.get("/transactions", verifyJWT, getTransactions);
router.get("/maintenance", verifyJWT, getMaintenanceCollection);
router.get("/summary", verifyJWT, getTreasurerSummary);

export default router;