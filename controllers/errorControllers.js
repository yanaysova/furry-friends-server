const AppError = require("../utils/appError");

const handleCastErrorDB = (err) => {
  const message = `Invalid ${err.path}: ${err.value}`;
  return new AppError(message, 400);
};

const handleDuplicateFieldDB = (err) => {
  const key = Object.keys(err.keyValue).join("");
  const message = `The key '${key}' has duplicate value of '${err.keyValue[key]}'`;
  return new AppError(message, 400);
};

const handleValidationErrorDb = (err) => {
  const errors = Object.values(err.errors).map((element) => element.message);
  const message = `Data validation failed. ${errors.join(". ")}`;
  return new AppError(message, 400);
};

module.exports = (err, req, res, next) => {
  err.statusCode = err.statusCode || 500;
  err.status = err.status || "error";

  let error = { ...err, name: err.name };

  if (error.name === "CastError") {
    error = handleCastErrorDB(error);
  }

  if (error.code === 11000) {
    error = handleDuplicateFieldDB(error);
  }

  if (error.name === "ValidationError") {
    console.log(error.name);
    error = handleValidationErrorDb(error);
  }

  res.status(error.statusCode).json({
    status: error.status,
    name: error.name,
    message: error.message,
  });
};
