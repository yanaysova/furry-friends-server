const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const User = require("../models/userModel");
const AppError = require("../utils/appError");
const catchAsync = require("../utils/catchAsync");
require("dotenv").config();

const isEmailExist = catchAsync(async (req, res, next) => {
  const userEmail = await User.findOne({ email: req.body.email });
  if (!userEmail) {
    next();
  } else {
    return next(new AppError("Email already in use.", 404));
  }
});

const isUserExist = catchAsync(async (req, res, next) => {
  const { email, password } = req.body;
  if (!email || !password) {
    return next(new AppError("Please provide an email and password", 400));
  }
  const user = await User.findOne({ email }).select("+password");
  if (user) {
    req.body.user = user;
    next();
  } else {
    next(new AppError("Invalid email", 409));
  }
});

module.exports = {
  isEmailExist,
  isUserExist,
};
