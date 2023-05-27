const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const AppError = require("../utils/appError");
const catchAsync = require("../utils/catchAsync");
const User = require("../models/userModel");
require("dotenv").config();

const auth = catchAsync(async (req, res, next) => {
  if (
    !req.headers.authorization ||
    !req.headers.authorization.startsWith("Bearer")
  ) {
    return next(new AppError("Authorization headers required", 401));
  }
  const token = req.headers.authorization.replace("Bearer ", "");
  jwt.verify(token, process.env.JWT_ACSESS_SECRET, async (err, decoded) => {
    if (err) {
      return next(err);
    }

    //Checks if user exist (or deleted)
    const currentUser = await User.findById(decoded.id).select("+password");
    if (!currentUser) {
      return next(
        new AppError("The user belongs to the token no longer exist.", 401)
      );
    }
    req.user = currentUser;
    next();
  });
});

const checkAdmin = catchAsync(async (req, res, next) => {
  if (!req.user.isAdmin) {
    return next(new AppError("Permission for admin users only", 403));
  }
  next();
});

const replacePwd = (req, res, next) => {
  if (!req.body.newPassword) {
    return next(new AppError("New password missing", 400));
  }
  req.body.password = req.body.newPassword;
  next();
};

const encryptPwd = async (req, res, next) => {
  const saltRounds = 10;
  bcrypt.genSalt(saltRounds, function (err, salt) {
    bcrypt.hash(req.body.password, salt, function (err, hash) {
      if (err) {
        return next(new AppError("Password encryption failed", 500));
      }
      req.body.password = hash;
      next();
    });
  });
};

const validatePwd = catchAsync(async (req, res, next) => {
  let { user, password } = req.body;
  if (!user && req.user) {
    user = req.user;
  }
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

module.exports = {
  auth,
  encryptPwd,
  validatePwd,
  checkAdmin,
  replacePwd,
};

// const auth = catchAsync(async (req, res, next) => {
//   if (!req.cookies.jwt) {
//     return next(new AppError("Token Requiered", 401));
//   }
//   const token = req.cookies.jwt;
// const decoded = await jwt.verify(
//   token,
//   process.env.JWT_REFRESH_SECRET,
//   (err, value) => {
//     if (err) {
//       return next(new AppError(err.name, 401));
//     }
//     return value;
//   }
// );
//   //Checks if user exist (or deleted)
//   const currentUser = await User.findById(decoded.id);
//   if (!currentUser) {
//     return next(
//       new AppError("The user belongs to the token no longer exist.", 401)
//     );
//   }
//   req.user = currentUser;
//   next();
// });
