const catchAsync = require("../utils/catchAsync");
const Pet = require("../models/petModel");
const AppError = require("../utils/appError");

const aliasNewestAdittions = (req, res, next) => {
  req.query.limit = "3";
  req.query.page = "1";
  req.query.fields = "name,gender,age,breed,picture,id,adoptionStatus";
  next();
};

const addEditDate = (req, res, next) => {
  req.body.editedAt = Date.now();
  next();
};

const createImageUrl = (req, res, next) => {
  const imageUrl = `http://localhost:8080${req.file.filename}`;
  req.body.picture = imageUrl;
};

const isAvailable = catchAsync(async (req, res, next) => {
  const pet = await Pet.findOne({ _id: req.params.id });
  if (!pet) {
    return next(new AppError("Pet ID does not exist", 404));
  }
  if (pet.adoptionStatus === "Available") {
    req.pet = pet;
    next();
  } else if (
    pet.adoptionStatus === "Fostered" &&
    pet.user.toString() === req.user._id.toString()
  ) {
    req.pet = pet;
    next();
  } else {
    return next(new AppError("Pet is not available", 403));
  }
});

const defineStatus = (req, res, next) => {
  if (req.body.status === "Fostered") {
    req.body.set = "fosteredPets";
    next();
  } else if (req.body.status === "Adopted") {
    req.body.set = "adoptedPets";
    next();
  } else {
    return next(new AppError("Invalid status", 403));
  }
};

module.exports = {
  aliasNewestAdittions,
  addEditDate,
  createImageUrl,
  isAvailable,
  defineStatus,
};
