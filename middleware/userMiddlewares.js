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
  const user = await User.findOne({ email: req.body.email });
  if (user) {
    req.body.user = user;
    next();
  } else {
    res.status(409).send("Invalid email");
  }
});

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

const validatePwd = catchAsync(async (req, res, next) => {
  const { user, password } = req.body;
  bcrypt.compare(password, user.password, (err, result) => {
    if (err) {
      return next(new AppError("Password decryption failed", 500));
    }
    if (!result) {
      return next(new AppError("Incorrect Password", 404));
    }
    if (result) {
      next();
    }
  });
});

const generateToken = (req, res, next) => {
  const { user } = req.body;
  const userId = user._id.toString();
  const token = jwt.sign({ id: userId }, process.env.JWT_SECRET, {
    expiresIn: "1d",
  });
  req.token = token;
  next();
};

const auth = (req, res, next) => {
  if (!req.headers.authorization) {
    return res.status("401").send("Authorization headers required");
  }
  const token = req.headers.authorization.replace("Bearer ", "");
  jwt.verify(token, process.env.JWT_SECRET, (err, decoded) => {
    if (err) {
      return res.status(500).send("Unauthorization token");
    } else {
      req.body.userId = decoded.id;
      next();
    }
  });
};

module.exports = {
  isEmailExist,
  encryptPwd,
  validatePwd,
  auth,
  generateToken,
  isUserExist,
};
