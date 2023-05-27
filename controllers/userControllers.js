const catchAsync = require("../utils/catchAsync");
const APIFeatures = require("../utils/apiFeatures");
const AppError = require("../utils/appError");
const User = require("../models/userModel");
require("dotenv").config();

const getUsers = catchAsync(async (req, res, next) => {
  const features = new APIFeatures(User.find(), req.query)
    .filter()
    .sort()
    .limitFields()
    .paginate();
  const results = await features.query;
  res.status(200).json({
    status: "success",
    userId: req.body.userId,
    results: results.length,
    data: {
      results,
    },
  });
});

const getUserAll = catchAsync(async (req, res, next) => {
  const result = await User.findById(req.params.id).populate([
    "savedPets",
    "adoptedPets",
    "fosteredPets",
  ]);
  if (!result) {
    return next(new AppError("User ID invalid", 404));
  }
  res.status(200).json({
    status: "success",
    data: result,
  });
});

const changeRole = catchAsync(async (req, res, next) => {
  if (req.user._id === req.params.userId) {
    return next(new AppError("Cannot Demote Self", 403));
  }
  const result = await User.findByIdAndUpdate(req.params.userId, req.body, {
    new: true,
    runValidators: true,
  });
  if (!result) {
    return next(new AppError("User ID invalid", 404));
  }
  res.status(200).json({
    status: "success",
  });
});

const updateEmail = catchAsync(async (req, res, next) => {
  const updatedUser = await User.findByIdAndUpdate(req.user._id, req.body, {
    new: true,
    runValidators: true,
  });
  if (!updatedUser) {
    return next(new AppError("User ID invalid", 404));
  }
  res.status(200).json({
    status: "success",
    data: updatedUser,
  });
});

const updateInfo = catchAsync(async (req, res, next) => {
  const updatedUser = await User.findByIdAndUpdate(req.user._id, req.body, {
    new: true,
    runValidators: true,
  });
  if (!updatedUser) {
    return next(new AppError("User ID invalid", 404));
  }
  res.status(200).json({
    status: "success",
    data: updatedUser,
  });
});

const updatePassword = catchAsync(async (req, res, next) => {
  const updatedUser = await User.findByIdAndUpdate(
    req.user._id,
    { $set: { password: req.body.password } },
    {
      new: true,
      runValidators: true,
    }
  );
  if (!updatedUser) {
    return next(new AppError("User ID invalid", 404));
  }
  res.status(200).json({
    status: "success",
  });
});

module.exports = {
  getUsers,
  changeRole,
  updateEmail,
  updatePassword,
  getUserAll,
  updateInfo,
};
