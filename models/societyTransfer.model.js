import mongoose, { Schema } from "mongoose";

const societyTransferSchema = new Schema(
  {
    oldOwnerName: { type: String, required: true },
    oldOwnerEmail: { type: String },
    oldOwnerPhone: { type: String },

    newOwnerName: { type: String, required: true },
    newOwnerEmail: { type: String },
    newOwnerPhone: { type: String },

    block: { type: String, required: true },
    houseNo: { type: String, required: true },

    transferDate: { type: Date, required: true },
    reason: { type: String },

    status: {
      type: String,
      enum: ["Pending", "Approved", "Rejected"],
      default: "Pending",
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

export const SocietyTransfer = mongoose.model(
  "SocietyTransfer",
  societyTransferSchema
);