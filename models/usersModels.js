const fs = require("fs");
const path = require("path");

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

function addUserModel(newUser) {
  try {
    const usersArray = getAllUsersModel();
    usersArray.push(newUser);
    fs.writeFileSync(pathToUsersDb, JSON.stringify(usersArray));
    return true;
  } catch (error) {
    console.log(error);
  }
}

function loginUserModel(loggedUser) {
  const filteredUser = getUserByEmailModel(loggedUser.email);
  if (!filteredUser) {
    throw new Error("emailErr");
  }
  if (loggedUser.password != filteredUser.password) {
    throw new Error("passwordErr");
  }
  return filteredUser;
}

module.exports = {
  getAllUsersModel,
  addUserModel,
  loginUserModel,
  getUserByEmailModel,
};
