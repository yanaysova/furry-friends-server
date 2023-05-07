const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const User = require("../models/userModel");
require("dotenv").config();

const isEmailExist = async (req, res, next) => {
  try {
    const userEmail = await User.findOne({ email: req.body.email });
    if (!userEmail) {
      next();
    } else {
      res.status(409).send("userExistsErr");
    }
  } catch (error) {
    res.status(400).json({
      status: "fail",
      message: error.message,
    });
  }
};

const encryptPwd = async (req, res, next) => {
  const saltRounds = 10;
  bcrypt.genSalt(saltRounds, function (err, salt) {
    bcrypt.hash(req.body.password, salt, function (err, hash) {
      if (err) {
        return res.status(500).send("Password encryption failed");
      }
      req.body.password = hash;
      next();
    });
  });
};

const validatePwd = async (req, res, next) => {
  const { user, passowrd } = req.body;
  try {
    bcrypt.compare(passowrd, user.passowrd, (err, result) => {
      if (err) {
        return res.status(500).send(err.message);
      }
      if (!result) {
        return res.status(400).send("Incorrect Password");
      }
      if (result) {
        next();
      }
    });
  } catch (error) {
    console.log(error);
  }
};

module.exports = {
  isEmailExist,
  encryptPwd,
  validatePwd,
};
