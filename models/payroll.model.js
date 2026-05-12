import mongoose, { Schema } from "mongoose";

const payrollSchema = new Schema(
  {
    employeeName: {
      type: String,
      required: true,
    },
    employeeRole: {
      type: String,
      required: true,
    },
    phoneNo: {
      type: String,
    },
    month: {
      type: String,
      required: true,
    },
    salaryAmount: {
      type: Number,
      required: true,
    },
    status: {
      type: String,
      enum: ["Pending", "Paid"],
      default: "Pending",
    },
    paidDate: {
      type: Date,
      default: null,
    },
    societyId: {
      type: String,
      required: true,
      index: true,
    },
    createdBy: {
      type: Schema.Types.ObjectId,
      ref: "User",
    },
    paidBy: {
      type: Schema.Types.ObjectId,
      ref: "User",
      default: null,
    },
  },
  { timestamps: true }
);

export const Payroll = mongoose.model("Payroll", payrollSchema);