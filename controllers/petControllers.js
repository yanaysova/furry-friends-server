const Pet = require("../models/petModel");
const APIFeatures = require("../utils/apiFeatures");
const AppError = require("../utils/appError");
const catchAsync = require("../utils/catchAsync");

// Route: ‘/pet’ [POST] (Protected to admin only)
// Handle photo upload
const addPet = catchAsync(async (req, res, next) => {
  req.body.picture = req.file.path;
  req.body.createdBy = req.user._id;
  const newPet = await Pet.create(req.body);
  res.status(201).json({
    status: "success",
    data: {
      pet: newPet,
    },
  });
});

// Route: ‘/pet/:id’ [GET]
const getPetById = catchAsync(async (req, res, next) => {
  const result = await Pet.findById(req.params.id);
  if (!result) {
    return next(new AppError("Pet ID invalid", 404));
  }
  res.status(200).json({
    status: "success",
    data: result,
  });
});

// Route: ‘/pet/:id’ [PUT] (protected to admin only)

const editPet = catchAsync(async (req, res, next) => {
  req.body.picture = req.file.path;
  const updatedPet = await Pet.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
    runValidators: true,
  });
  if (!updatedPet) {
    return next(new AppError("Pet ID invalid", 404));
  }
  res.status(200).json({
    status: "success",
    data: updatedPet,
  });
});

// Route: ‘/pet/:id’ [PUT] (protected to admin only)
const deletePet = catchAsync(async (req, res, next) => {
  const deletedPet = await Pet.findByIdAndDelete(req.params.id, req.body);
  if (!deletedPet) {
    return next(new AppError("Pet ID invalid", 404));
  }
  res.status(204).json({
    status: "success",
    data: null,
  });
});

// Route: ‘/pet’ [GET]
// Can receive query parameters to search the database
// Retrieve results to match query. If no parameters are passed it should return all the results.
// Should only return the fields necessary
// Search Fields: Adoption Status, Type, Height, Weight, Name

const getPets = catchAsync(async (req, res, next) => {
  const features = new APIFeatures(Pet.find(), req.query)
    .filter()
    .sort()
    .limitFields()
    .paginate();
  const results = await features.query;
  res.status(200).json({
    status: "success",
    results: results.length,
    data: {
      results,
    },
  });
});

// Route: ‘/pet/:id/adopt’ [POST] (protected to logged in users)
// The Adopt/Foster API is responsible for adding the pet to the current users pets.
// This API also should change the pet’s adoption status.

const adoptPet = catchAsync(async (req, res, next) => {
  console.log("adoptPet");
});

// Route: ‘/pet/:id/return’ [POST] (protected to logged in users)
// The Return Pet API is responsible for returning the pet to the agency.
// The API should change the pets status back to available
// The API should remove the pet from the users pets.

const returnPet = catchAsync(async (req, res, next) => {
  console.log("returnPet");
});

// Route: ‘/pet/:id/save’ [POST] (protected to logged in users)
// The save PET api allows a user to save a pet for later
// The saved pet should be stored as saved in the users account

const savePet = catchAsync(async (req, res, next) => {
  console.log("savePet");
});

// Route: ‘/pet/:id/save’ [DELETE] (protected to logged in users)
// The delete saved PET api allows a user to remove a saved pet.

const deleteSavedPet = catchAsync(async (req, res, next) => {
  console.log("deleteSavedPet");
});

// Route: ‘/pet/user/:id’ [GET]
// This api allows a user to get the pets owned by (or saved) by a user based on the user id.

const getPetsByUserId = catchAsync(async (req, res, next) => {
  console.log("getPetsByUserId");
});

// Route: ‘/pet/stats’ [GET] (protected to admin only)
const getPetStats = catchAsync(async (req, res, next) => {
  const stats = await Pet.aggregate([
    {
      $match: {},
    },
    {
      $group: {
        _id: "$type",
        numOfPets: { $sum: 1 },
        avgWeight: { $avg: "$weight" },
        avgHeight: { $avg: "$height" },
        avgAge: { $avg: "$age" },
        minAge: { $min: "$age" },
      },
    },
    {
      $sort: { numOfPets: -1 },
    },
  ]);
  res.status(200).json({
    status: "success",
    data: {
      stats,
    },
  });
});

module.exports = {
  addPet,
  getPets,
  getPetById,
  editPet,
  deletePet,
  adoptPet,
  returnPet,
  savePet,
  deleteSavedPet,
  getPetsByUserId,
  getPetStats,
};
