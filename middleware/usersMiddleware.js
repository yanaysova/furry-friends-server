const { getUserByEmailModel } = require("../models/usersModels");

function isEmailExists(req, res, next) {
  const user = getUserByEmailModel(req.body.email);
  console.log(user);
  if (!user) {
    next();
  } else {
    res.status(409).send("userExistsErr");
  }
}

module.exports = {
  isEmailExists,
};
