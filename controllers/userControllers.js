const catchAsync = require("../utils/catchAsync");
const AppError = require("../utils/appError");
const APIFeatures = require("../utils/apiFeatures");
const User = require("../models/userModel");
const jwt = require("jsonwebtoken");
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

const signup = catchAsync(async (req, res, next) => {
  const newUser = await User.create({
    email: req.body.email,
    password: req.body.password,
    firstName: req.body.firstName,
    lastName: req.body.lastName,
    phoneNum: req.body.phoneNum,
  });
  res.status(201).json({
    status: "success",
    data: {
      user: {
        email: newUser.email,
        firstName: newUser.firstName,
        lastName: newUser.lastName,
      },
    },
  });
});

const update = (req, res) => {
  try {
    const updatedUser = {
      ...req.body,
    };
    const user = updateUserModel(updatedUser);
    res.send(user);
  } catch (error) {
    res.status(500).send(error.message);
  }
};

const updateEmail = (req, res) => {
  try {
    const userId = req.params.userId;
    const email = req.body.email;
    const user = updateUserEmailModel(email, userId);
    res.send(user);
  } catch (error) {
    res.status(500).send(error.message);
  }
};

const updatePassword = (req, res) => {
  try {
    const userId = req.params.userId;
    const password = req.body.password;
    const user = updateUserPasswordModel(password, userId);
    res.send(user);
  } catch (error) {
    res.status(500).send(error.message);
  }
};

const checkId = (req, res, next, val) => {
  console.log(val);
  const allUsers = getAllUsersModel();
  const user = allUsers.find((user) => user.id == val);
  if (!user) {
    return res.status(404).json({
      status: "fail",
      message: "invalid ID",
    });
  }
  next();
};

module.exports = {
  signup,
  getUsers,
  update,
  updateEmail,
  updatePassword,
  checkId,
};
