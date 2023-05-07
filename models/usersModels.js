const fs = require("fs");
const path = require("path");
const mongoose = require("mongoose");
const User = require("./userModel.js");

const pathToUsersDb = path.resolve(__dirname, "../usersDb.json");

function getAllUsersModel() {
  const users = JSON.parse(fs.readFileSync(pathToUsersDb, "utf8"));
  return users;
}

function getUserByEmailModel(email) {
  const allUsers = getAllUsersModel();
  const user = allUsers.find((user) => user.email === email);
  return user;
}

async function addUserModel(newUser) {
  try {
    const userDoc = await User.create(newUser);
    console.log(userDoc);
    return userDoc;
  } catch (error) {
    console.log(error);
    if (error.code === 11000) {
      throw new Error("userExistsErr");
    }
    throw error;
  }
}

async function loginUserModel(loggedUser) {
  const filteredUser = getUserByEmailModel(loggedUser.email);
  if (!filteredUser) {
    throw new Error("emailErr");
  }
  if (loggedUser.password != filteredUser.password) {
    throw new Error("passwordErr");
  }
  return filteredUser;
}

function updateUserModel(updatedUser) {
  const allUsers = getAllUsersModel();
  const updatedUsers = allUsers.map((user) => {
    if (user.email === updatedUser.email) {
      return { ...user, ...updatedUser };
    }
    return user;
  });
  fs.writeFileSync(pathToUsersDb, JSON.stringify(updatedUsers));
  return updatedUser;
}

function updateUserEmailModel(updatedEmail, userId) {
  const allUsers = getAllUsersModel();
  const updatedUsers = allUsers.map((user) => {
    if (user.id === userId) {
      return { ...user, email: updatedEmail };
    }
    return user;
  });
  fs.writeFileSync(pathToUsersDb, JSON.stringify(updatedUsers));
  return updatedUsers.find((user) => user.id === userId);
}

function updateUserPasswordModel(updatedPassword, userId) {
  const allUsers = getAllUsersModel();
  const updatedUsers = allUsers.map((user) => {
    if (user.id === userId) {
      return { ...user, password: updatedPassword };
    }
    return user;
  });
  fs.writeFileSync(pathToUsersDb, JSON.stringify(updatedUsers));
  return updatedUsers.find((user) => user.id === userId);
}

module.exports = {
  getAllUsersModel,
  addUserModel,
  loginUserModel,
  getUserByEmailModel,
  updateUserModel,
  updateUserEmailModel,
  updateUserPasswordModel,
};
