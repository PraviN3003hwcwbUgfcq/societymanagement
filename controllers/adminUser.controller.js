import { User } from "../models/user.models.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { ApiError } from "../utils/ApiError.js";

export const createAdminUser = asyncHandler(async (req, res) => {
  const {
    name,
    email,
    password,
    phoneNo,
    phoneNo2,
    block,
    houseNo,
    role,
  } = req.body;

  if (!name || !email || !password || !phoneNo || !block || !houseNo || !role) {
    throw new ApiError(400, "Required fields missing");
  }

  const existedUser = await User.findOne({ email });

  if (existedUser) {
    throw new ApiError(409, "User already exists");
  }

  const user = await User.create({
    name,
    email,
    password,
    phoneNo,
    phoneNo2,
    block,
    houseNo,
    role,
    societyId: req.user.societyId,
  });

  const createdUser = await User.findById(user._id).select("-password -refreshToken");

  return res
    .status(201)
    .json(new ApiResponse(201, createdUser, "User created successfully"));
});

export const getAdminUsers = asyncHandler(async (req, res) => {
  const users = await User.find({
    societyId: req.user.societyId,
  })
    .select("-password -refreshToken")
    .sort({ createdAt: -1 });

  return res
    .status(200)
    .json(new ApiResponse(200, users, "Users fetched successfully"));
});

export const updateAdminUserRole = asyncHandler(async (req, res) => {
  const { userId } = req.params;
  const { role } = req.body;

  const allowedRoles = ["user", "admin", "security", "treasurer", "secretary"];

  if (!allowedRoles.includes(role)) {
    throw new ApiError(400, "Invalid role");
  }

  const user = await User.findOneAndUpdate(
    {
      _id: userId,
      societyId: req.user.societyId,
    },
    { role },
    { new: true }
  ).select("-password -refreshToken");

  if (!user) {
    throw new ApiError(404, "User not found");
  }

  return res
    .status(200)
    .json(new ApiResponse(200, user, "User role updated successfully"));
});

export const toggleAdminUserStatus = asyncHandler(async (req, res) => {
  const { userId } = req.params;

  const user = await User.findOne({
    _id: userId,
    societyId: req.user.societyId,
  });

  if (!user) {
    throw new ApiError(404, "User not found");
  }

  user.isActive = !user.isActive;
  await user.save();

  const updatedUser = await User.findById(user._id).select("-password -refreshToken");

  return res
    .status(200)
    .json(new ApiResponse(200, updatedUser, "User status updated successfully"));
});

export const deleteAdminUser = asyncHandler(async (req, res) => {
  const { userId } = req.params;

  const user = await User.findOneAndDelete({
    _id: userId,
    societyId: req.user.societyId,
  });

  if (!user) {
    throw new ApiError(404, "User not found");
  }

  return res
    .status(200)
    .json(new ApiResponse(200, user, "User deleted successfully"));
});