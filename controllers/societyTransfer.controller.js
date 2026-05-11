import { SocietyTransfer } from "../models/societyTransfer.model.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { ApiError } from "../utils/ApiError.js";

export const createSocietyTransfer = asyncHandler(async (req, res) => {
  const {
    oldOwnerName,
    oldOwnerEmail,
    oldOwnerPhone,
    newOwnerName,
    newOwnerEmail,
    newOwnerPhone,
    block,
    houseNo,
    transferDate,
    reason,
  } = req.body;

  if (!oldOwnerName || !newOwnerName || !block || !houseNo || !transferDate) {
    throw new ApiError(400, "Required fields missing");
  }

  const transfer = await SocietyTransfer.create({
    oldOwnerName,
    oldOwnerEmail,
    oldOwnerPhone,
    newOwnerName,
    newOwnerEmail,
    newOwnerPhone,
    block,
    houseNo,
    transferDate,
    reason,
    societyId: req.user.societyId,
    createdBy: req.user._id,
  });

  return res
    .status(201)
    .json(new ApiResponse(201, transfer, "Society transfer created"));
});

export const getSocietyTransfers = asyncHandler(async (req, res) => {
  const transfers = await SocietyTransfer.find({
    societyId: req.user.societyId,
  }).sort({ createdAt: -1 });

  return res
    .status(200)
    .json(new ApiResponse(200, transfers, "Society transfers fetched"));
});

export const updateSocietyTransferStatus = asyncHandler(async (req, res) => {
  const { transferId } = req.params;
  const { status } = req.body;

  if (!["Pending", "Approved", "Rejected"].includes(status)) {
    throw new ApiError(400, "Invalid status");
  }

  const transfer = await SocietyTransfer.findOneAndUpdate(
    {
      _id: transferId,
      societyId: req.user.societyId,
    },
    { status },
    { new: true }
  );

  if (!transfer) {
    throw new ApiError(404, "Transfer record not found");
  }

  return res
    .status(200)
    .json(new ApiResponse(200, transfer, "Transfer status updated"));
});

export const deleteSocietyTransfer = asyncHandler(async (req, res) => {
  const { transferId } = req.params;

  const transfer = await SocietyTransfer.findOneAndDelete({
    _id: transferId,
    societyId: req.user.societyId,
  });

  if (!transfer) {
    throw new ApiError(404, "Transfer record not found");
  }

  return res
    .status(200)
    .json(new ApiResponse(200, transfer, "Transfer deleted"));
});