const catchAsync = require("../utils/catchAsync");
const AppError = require("../utils/appError");
const User = require("../models/userModel");
const jwt = require("jsonwebtoken");
require("dotenv").config();

const createRefreshToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_REFRESH_SECRET, {
    expiresIn: process.env.JWT_REFRESH_EXPIRES_IN,
  });
};

const createAccsessToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_ACSESS_SECRET, {
    expiresIn: process.env.JWT_ACSESS_EXPIRES_IN,
  });
};

const cookieOptions = {
  maxAge: 864000000,
  secure: false,
  httpOnly: true,
};

const login = catchAsync(async (req, res, next) => {
  const { user } = req.body;
  const refreshToken = createRefreshToken(user._id);
  const accessToken = createAccsessToken(user._id);
  res.cookie("jwt", refreshToken, cookieOptions);
  res.status(200).json({
    status: "success",
    token: accessToken,
    user: {
      ID: user.id,
      firstName: user.firstName,
      lastName: user.lastName,
      isAdmin: user.isAdmin,
      phoneNum: user.phoneNum,
      email: user.email,
      savedPets: user.savedPets,
      adoptedPets: user.adoptedPets,
      fosteredPets: user.fosteredPets,
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
  const refreshToken = createRefreshToken(newUser._id);
  const accessToken = createAccsessToken(newUser._id);
  res.cookie("jwt", refreshToken, cookieOptions);
  res.status(201).json({
    status: "success",
    token: accessToken,
    user: {
      ID: newUser.id,
      firstName: newUser.firstName,
      lastName: newUser.lastName,
      isAdmin: newUser.isAdmin,
    },
  });
});

//Refreshes expired accsess tokens with valid refresh token
const refresh = catchAsync(async (req, res, next) => {
  const cookies = req.cookies;
  if (!cookies?.jwt) {
    return next(new AppError("Unauthorized", 401));
  }
  const refreshToken = cookies.jwt;

  jwt.verify(
    refreshToken,
    process.env.JWT_REFRESH_SECRET,
    catchAsync(async (err, decoded) => {
      if (err) {
        return next(new AppError("Forbidden", 403));
      }
      const foundUser = await User.findById(decoded.id);

      if (!foundUser) {
        return next(new AppError("Unauthorized", 401));
      }
      const accessToken = createAccsessToken(foundUser._id);
      res.json({ token: accessToken });
    })
  );
});

//Validates accsess token for persistent login
const validate = (req, res, next) => {
  res.status(200).json({
    valid: true,
    user: {
      ID: req.user.id,
      firstName: req.user.firstName,
      lastName: req.user.lastName,
      isAdmin: req.user.isAdmin,
      phoneNum: req.user.phoneNum,
      email: req.user.email,
      savedPets: req.user.savedPets,
      adoptedPets: req.user.adoptedPets,
      fosteredPets: req.user.fosteredPets,
    },
  });
};

const logout = (req, res) => {
  const cookies = req.cookies;
  if (!cookies?.jwt) return res.sendStatus(204);
  res.clearCookie("jwt", { httpOnly: true, secure: false });
  res.json({ message: "Cookie cleared" });
};

module.exports = {
  login,
  refresh,
  validate,
  logout,
  signup,
};
