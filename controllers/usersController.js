const {
  getAllUsersModel,
  addUserModel,
  loginUserModel,
  updateUserModel,
  updateUserEmailModel,
  updateUserPasswordModel,
} = require("../models/usersModels");

const getAllUsers = (req, res) => {
  try {
    const allUsers = getAllUsersModel();
    res.send(allUsers);
  } catch (error) {
    console.log(error);
    res.status(500).send(error.message);
  }
};

const signup = async (req, res) => {
  try {
    console.log(req.body);
    const newUser = {
      ...req.body,
    };
    const addedUser = await addUserModel(newUser);
    res.send(addedUser);
  } catch (error) {
    console.log(error);
    res.status(500).send(error.message);
  }
};

const login = async (req, res) => {
  try {
    const loggedUser = {
      ...req.body,
    };
    const user = loginUserModel(loggedUser);
    res.send(user);
  } catch (error) {
    res.status(500).send(error.message);
  }
};

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
