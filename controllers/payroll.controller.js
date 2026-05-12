// import { Payroll } from "../models/payroll.model.js";
// import { asyncHandler } from "../utils/asyncHandler.js";
// import { ApiResponse } from "../utils/ApiResponse.js";
// import { ApiError } from "../utils/ApiError.js";

// export const createPayroll = asyncHandler(async (req, res) => {
//   const { employeeName, employeeRole, phoneNo, month, salaryAmount } = req.body;

//   if (!employeeName || !employeeRole || !month || !salaryAmount) {
//     throw new ApiError(400, "Required fields missing");
//   }

//   const payroll = await Payroll.create({
//     employeeName,
//     employeeRole,
//     phoneNo,
//     month,
//     salaryAmount,
//     societyId: req.user.societyId,
//     createdBy: req.user._id,
//   });

//   return res
//     .status(201)
//     .json(new ApiResponse(201, payroll, "Payroll created successfully"));
// });

// export const getPayrolls = asyncHandler(async (req, res) => {
//   const payrolls = await Payroll.find({
//     societyId: req.user.societyId,
//   }).sort({ createdAt: -1 });

//   return res
//     .status(200)
//     .json(new ApiResponse(200, payrolls, "Payrolls fetched successfully"));
// });

// export const markPayrollPaid = asyncHandler(async (req, res) => {
//   const { payrollId } = req.params;

//   const payroll = await Payroll.findOneAndUpdate(
//     {
//       _id: payrollId,
//       societyId: req.user.societyId,
//     },
//     {
//       status: "Paid",
//       paidDate: new Date(),
//       paidBy: req.user._id,
//     },
//     { new: true }
//   );

//   if (!payroll) {
//     throw new ApiError(404, "Payroll record not found");
//   }

//   return res
//     .status(200)
//     .json(new ApiResponse(200, payroll, "Payroll marked as paid"));
// });

// export const deletePayroll = asyncHandler(async (req, res) => {
//   const { payrollId } = req.params;

//   const payroll = await Payroll.findOneAndDelete({
//     _id: payrollId,
//     societyId: req.user.societyId,
//   });

//   if (!payroll) {
//     throw new ApiError(404, "Payroll record not found");
//   }

//   return res
//     .status(200)
//     .json(new ApiResponse(200, payroll, "Payroll deleted successfully"));
// });


























import { Payroll } from "../models/payroll.model.js";
import { Employee } from "../models/employee.model.js";
import { Expense } from "../models/expense.model.js";
import { Transaction } from "../models/transaction.model.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { ApiError } from "../utils/ApiError.js";

export const createPayroll = asyncHandler(async (req, res) => {
  const { employeeName, employeeRole, phoneNo, month, salaryAmount } = req.body;

  if (!employeeName || !employeeRole || !month || !salaryAmount) {
    throw new ApiError(400, "Required fields missing");
  }

  const payroll = await Payroll.create({
    employeeName,
    employeeRole,
    phoneNo,
    month,
    salaryAmount,
    societyId: req.user.societyId,
    createdBy: req.user._id,
  });

  return res
    .status(201)
    .json(new ApiResponse(201, payroll, "Payroll created successfully"));
});

export const generateMonthlyPayroll = asyncHandler(async (req, res) => {
  const { month } = req.body;

  if (!month) {
    throw new ApiError(400, "Month is required");
  }

  const employees = await Employee.find({
    societyId: req.user.societyId,
    isActive: true,
  });

  if (employees.length === 0) {
    throw new ApiError(404, "No active employees found");
  }

  const createdPayrolls = [];

  for (const employee of employees) {
    const alreadyExists = await Payroll.findOne({
      societyId: req.user.societyId,
      employeeName: employee.employeeName,
      employeeRole: employee.employeeRole,
      month,
    });

    if (!alreadyExists) {
      const payroll = await Payroll.create({
        employeeName: employee.employeeName,
        employeeRole: employee.employeeRole,
        phoneNo: employee.phoneNo,
        month,
        salaryAmount: employee.monthlySalary,
        societyId: req.user.societyId,
        createdBy: req.user._id,
      });

      createdPayrolls.push(payroll);
    }
  }

  return res
    .status(201)
    .json(new ApiResponse(201, createdPayrolls, "Monthly payroll generated successfully"));
});

export const getPayrolls = asyncHandler(async (req, res) => {
  const payrolls = await Payroll.find({
    societyId: req.user.societyId,
  }).sort({ createdAt: -1 });

  return res
    .status(200)
    .json(new ApiResponse(200, payrolls, "Payrolls fetched successfully"));
});

export const markPayrollPaid = asyncHandler(async (req, res) => {
  const { payrollId } = req.params;

  const payroll = await Payroll.findOne({
    _id: payrollId,
    societyId: req.user.societyId,
  });

  if (!payroll) {
    throw new ApiError(404, "Payroll record not found");
  }

  if (payroll.status === "Paid") {
    throw new ApiError(400, "Salary already paid");
  }

  payroll.status = "Paid";
  payroll.paidDate = new Date();
  payroll.paidBy = req.user._id;

  await payroll.save();

  await Expense.create({
    title: `Salary - ${payroll.employeeName}`,
    amount: payroll.salaryAmount,
    category: "Salary",
    date: new Date(),
    societyId: req.user.societyId,
    createdBy: req.user._id,
  });

  await Transaction.create({
    description: `Salary Paid - ${payroll.employeeName}`,
    amount: payroll.salaryAmount,
    type: "Expense",
    category: "Salary",
    date: new Date(),
    status: "Paid",
    societyId: req.user.societyId,
    createdBy: req.user._id,
  });

  return res
    .status(200)
    .json(new ApiResponse(200, payroll, "Payroll marked as paid"));
});

export const deletePayroll = asyncHandler(async (req, res) => {
  const { payrollId } = req.params;

  const payroll = await Payroll.findOneAndDelete({
    _id: payrollId,
    societyId: req.user.societyId,
  });

  if (!payroll) {
    throw new ApiError(404, "Payroll record not found");
  }

  return res
    .status(200)
    .json(new ApiResponse(200, payroll, "Payroll deleted successfully"));
});