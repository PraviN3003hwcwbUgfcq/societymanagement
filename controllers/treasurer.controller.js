// import { Expense } from "../models/expense.model.js";
// import { asyncHandler } from "../utils/asyncHandler.js";
// import { ApiResponse } from "../utils/ApiResponse.js";
// import { ApiError } from "../utils/ApiError.js";

// // ✅ ADD EXPENSE
// export const addExpense = asyncHandler(async (req, res) => {
//   const { title, amount, category, date } = req.body;

//   if (!title || !amount || !date) {
//     throw new ApiError(400, "Required fields missing");
//   }

//   const expense = await Expense.create({
//     title,
//     amount,
//     category,
//     date,
//     societyId: req.user.societyId,
//     createdBy: req.user._id,
//   });

//   return res
//     .status(201)
//     .json(new ApiResponse(201, expense, "Expense added"));
// });

// // ✅ GET EXPENSES
// export const getExpenses = asyncHandler(async (req, res) => {
//   const expenses = await Expense.find({
//     societyId: req.user.societyId,
//   }).sort({ createdAt: -1 });

//   return res
//     .status(200)
//     .json(new ApiResponse(200, expenses, "Expenses fetched"));
// });























// import { Expense } from "../models/expense.model.js";
// import { Transaction } from "../models/transaction.model.js";
// import { asyncHandler } from "../utils/asyncHandler.js";
// import { ApiResponse } from "../utils/ApiResponse.js";
// import { ApiError } from "../utils/ApiError.js";

// // ✅ ADD EXPENSE
// export const addExpense = asyncHandler(async (req, res) => {
//   const { title, amount, category, date } = req.body;

//   if (!title || !amount || !date) {
//     throw new ApiError(400, "Required fields missing");
//   }

//   const expense = await Expense.create({
//     title,
//     amount,
//     category,
//     date,
//     societyId: req.user.societyId,
//     createdBy: req.user._id,
//   });

//   await Transaction.create({
//     description: title,
//     amount,
//     type: "Expense",
//     category,
//     date,
//     status: "Paid",
//     societyId: req.user.societyId,
//     createdBy: req.user._id,
//   });

//   return res
//     .status(201)
//     .json(new ApiResponse(201, expense, "Expense added"));
// });

// // ✅ GET EXPENSES
// export const getExpenses = asyncHandler(async (req, res) => {
//   const expenses = await Expense.find({
//     societyId: req.user.societyId,
//   }).sort({ createdAt: -1 });

//   return res
//     .status(200)
//     .json(new ApiResponse(200, expenses, "Expenses fetched"));
// });

// // ✅ GET TRANSACTIONS
// export const getTransactions = asyncHandler(async (req, res) => {
//   const transactions = await Transaction.find({
//     societyId: req.user.societyId,
//   }).sort({ createdAt: -1 });

//   return res
//     .status(200)
//     .json(new ApiResponse(200, transactions, "Transactions fetched"));
// });






import { Expense } from "../models/expense.model.js";
import { Transaction } from "../models/transaction.model.js";
import { Payment } from "../models/payment.models.js";
import { User } from "../models/user.models.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { ApiError } from "../utils/ApiError.js";

// ✅ ADD EXPENSE
export const addExpense = asyncHandler(async (req, res) => {
  const { title, amount, category, date } = req.body;

  if (!title || !amount || !date) {
    throw new ApiError(400, "Required fields missing");
  }

  const expense = await Expense.create({
    title,
    amount,
    category,
    date,
    societyId: req.user.societyId,
    createdBy: req.user._id,
  });

  await Transaction.create({
    description: title,
    amount,
    type: "Expense",
    category,
    date,
    status: "Paid",
    societyId: req.user.societyId,
    createdBy: req.user._id,
  });

  return res
    .status(201)
    .json(new ApiResponse(201, expense, "Expense added"));
});

// ✅ GET EXPENSES
export const getExpenses = asyncHandler(async (req, res) => {
  const expenses = await Expense.find({
    societyId: req.user.societyId,
  }).sort({ createdAt: -1 });

  return res
    .status(200)
    .json(new ApiResponse(200, expenses, "Expenses fetched"));
});

// ✅ GET TRANSACTIONS
export const getTransactions = asyncHandler(async (req, res) => {
  const transactions = await Transaction.find({
    societyId: req.user.societyId,
  }).sort({ createdAt: -1 });

  return res
    .status(200)
    .json(new ApiResponse(200, transactions, "Transactions fetched"));
});

// ✅ GET MAINTENANCE COLLECTION
export const getMaintenanceCollection = asyncHandler(async (req, res) => {
  const societyId = req.user.societyId;

  const users = await User.find({
    societyId,
    role: "user",
  }).select("name block houseNo phoneNo");

  const payments = await Payment.find({ societyId }).populate(
    "paidBy",
    "name block houseNo phoneNo"
  );

  const totalMembers = users.length;

  let totalDue = 0;
  let collected = 0;

  const records = [];

  payments.forEach((payment) => {
    const paidUserIds = payment.paidBy.map((u) => u._id.toString());

    totalDue += Number(payment.amount || 0) * totalMembers;
    collected += Number(payment.amount || 0) * paidUserIds.length;

    users.forEach((user) => {
      const isPaid = paidUserIds.includes(user._id.toString());

      records.push({
        paymentId: payment._id,
        description: payment.description,
        dueDate: payment.dueDate,
        amount: payment.amount,

        userId: user._id,
        ownerName: user.name,
        block: user.block,
        houseNo: user.houseNo,
        flatNo: `${user.block}-${user.houseNo}`,
        phoneNo: user.phoneNo,

        totalDue: payment.amount,
        paid: isPaid ? payment.amount : 0,
        pending: isPaid ? 0 : payment.amount,
        status: isPaid ? "Paid" : "Pending",
      });
    });
  });

  const pending = totalDue - collected;
  const percentage =
    totalDue > 0 ? Number(((collected / totalDue) * 100).toFixed(2)) : 0;

  return res.status(200).json(
    new ApiResponse(
      200,
      {
        totalDue,
        collected,
        pending,
        percentage,
        records,
      },
      "Maintenance collection fetched"
    )
  );
});

// ✅ GET TREASURER SUMMARY
export const getTreasurerSummary = asyncHandler(async (req, res) => {
  const societyId = req.user.societyId;

  const expenses = await Expense.find({ societyId });
  const users = await User.find({ societyId, role: "user" }).select("_id");
  const payments = await Payment.find({ societyId });

  const totalExpense = expenses.reduce(
    (acc, item) => acc + Number(item.amount || 0),
    0
  );

  const totalMembers = users.length;

  let totalIncome = 0;
  let pendingPayments = 0;

  payments.forEach((payment) => {
    const paidCount = payment.paidBy?.length || 0;
    const pendingCount = Math.max(totalMembers - paidCount, 0);

    totalIncome += Number(payment.amount || 0) * paidCount;
    pendingPayments += Number(payment.amount || 0) * pendingCount;
  });

  const totalBalance = Math.max(totalIncome - totalExpense, 0);

  return res.status(200).json(
    new ApiResponse(
      200,
      {
        totalIncome,
        totalExpense,
        totalBalance,
        pendingPayments,
      },
      "Treasurer summary fetched"
    )
  );
});