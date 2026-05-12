import mongoose, { Schema } from "mongoose";

const employeeSchema = new Schema(
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
    email: {
      type: String,
    },
    monthlySalary: {
      type: Number,
      required: true,
    },
    isActive: {
      type: Boolean,
      default: true,
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
  },
  { timestamps: true }
);

export const Employee = mongoose.model("Employee", employeeSchema);