import { Employee } from "../models/employee.model.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { ApiError } from "../utils/ApiError.js";

export const createEmployee = asyncHandler(async (req, res) => {
  const {
    employeeName,
    employeeRole,
    phoneNo,
    email,
    monthlySalary,
  } = req.body;

  if (!employeeName || !employeeRole || !monthlySalary) {
    throw new ApiError(400, "Required fields missing");
  }

  const employee = await Employee.create({
    employeeName,
    employeeRole,
    phoneNo,
    email,
    monthlySalary,
    societyId: req.user.societyId,
    createdBy: req.user._id,
  });

  return res
    .status(201)
    .json(new ApiResponse(201, employee, "Employee created successfully"));
});

export const getEmployees = asyncHandler(async (req, res) => {
  const employees = await Employee.find({
    societyId: req.user.societyId,
  }).sort({ createdAt: -1 });

  return res
    .status(200)
    .json(new ApiResponse(200, employees, "Employees fetched successfully"));
});

export const toggleEmployeeStatus = asyncHandler(async (req, res) => {
  const { employeeId } = req.params;

  const employee = await Employee.findOne({
    _id: employeeId,
    societyId: req.user.societyId,
  });

  if (!employee) {
    throw new ApiError(404, "Employee not found");
  }

  employee.isActive = !employee.isActive;
  await employee.save();

  return res
    .status(200)
    .json(new ApiResponse(200, employee, "Employee status updated"));
});

export const deleteEmployee = asyncHandler(async (req, res) => {
  const { employeeId } = req.params;

  const employee = await Employee.findOneAndDelete({
    _id: employeeId,
    societyId: req.user.societyId,
  });

  if (!employee) {
    throw new ApiError(404, "Employee not found");
  }

  return res
    .status(200)
    .json(new ApiResponse(200, employee, "Employee deleted successfully"));
});