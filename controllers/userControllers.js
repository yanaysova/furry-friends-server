const catchAsync = require("../utils/catchAsync");
const User = require("../models/userModel");
const {
  getAllUsersModel,
  addUserModel,
  loginUserModel,
  updateUserModel,
  updateUserEmailModel,
  updateUserPasswordModel,
} = require("../models/userModel");

const getAllUsers = (req, res) => {
  try {
    const allUsers = getAllUsersModel();
    res.send(allUsers);
  } catch (error) {
    console.log(error);
    res.status(500).send(error.message);
  }
};

const signup = catchAsync(async (req, res, next) => {
  const newUser = await User.create(req.body);
  res.status(201).json({
    status: "success",
    data: {
      user: newUser,
    },
  });
});

const login = catchAsync(async (req, res, next) => {
  const loggedUser = {
    ...req.body,
  };
  const user = loginUserModel(loggedUser);
  res.send(user);
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
  getAllUsers,
  login,
  update,
  updateEmail,
  updatePassword,
  checkId,
};
