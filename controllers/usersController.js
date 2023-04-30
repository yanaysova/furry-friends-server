const { v4: uuidv4 } = require("uuid");
const {
  getAllUsersModel,
  addUserModel,
  loginUserModel,
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

const signup = (req, res) => {
  try {
    console.log(req.body);
    const newUser = {
      ...req.body,
      id: uuidv4(),
    };
    addUserModel(newUser);
    res.send(newUser);
  } catch (error) {
    console.log(error);
    res.status(500).send(error.message);
  }
};

const login = (req, res) => {
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

module.exports = {
  signup,
  getAllUsers,
  login,
};
