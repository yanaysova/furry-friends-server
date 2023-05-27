const Pet = require("../models/petModel");
const User = require("../models/userModel");
const APIFeatures = require("../utils/apiFeatures");
const AppError = require("../utils/appError");
const catchAsync = require("../utils/catchAsync");

// Route: ‘/pet’ [POST] (Protected to admin only)
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
  if (req.file) {
    req.body.picture = req.file.path;
  }
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
const getPets = catchAsync(async (req, res, next) => {
  const collation = req.query.name ? { locale: "en", strength: 2 } : null;
  const features = new APIFeatures(Pet.find(), req.query, collation)
    .filter()
    .sort()
    .limitFields()
    .paginate()
    .applyCollation();
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
const adoptFosterPet = catchAsync(async (req, res, next) => {
  await User.findByIdAndUpdate(
    req.user._id,
    { $addToSet: { [req.body.set]: req.pet._id } },
    {
      runValidators: true,
    }
  );
  const updatedPet = await Pet.findByIdAndUpdate(
    req.pet._id,
    { $set: { adoptionStatus: req.body.status, user: req.user._id } },
    {
      new: true,
      runValidators: true,
    }
  );

  res.status(200).json({
    status: "success",
    data: updatedPet,
  });
});

// Route: ‘/pet/:id/return’ [POST] (protected to logged in users)
const returnPet = catchAsync(async (req, res, next) => {
  await User.findByIdAndUpdate(
    req.user._id,
    { $pull: { fosteredPets: req.params.id, adoptedPets: req.params.id } },
    {
      runValidators: true,
    }
  );
  const updatedPet = await Pet.findByIdAndUpdate(
    req.params.id,
    { $set: { adoptionStatus: "Available", user: null } },
    {
      new: true,
      runValidators: true,
    }
  );
  if (!updatedPet) {
    return next(new AppError("Pet ID invalid", 404));
  }
  res.status(200).json({
    status: "success",
    data: updatedPet,
  });
});

// Route: ‘/pet/:id/save’ [POST] (protected to logged in users)
const savePet = catchAsync(async (req, res, next) => {
  const updatedPet = await User.findByIdAndUpdate(
    req.user._id,
    { $addToSet: { savedPets: req.params.id } },
    {
      new: true,
      runValidators: true,
    }
  );
  if (!updatedPet) {
    return next(new AppError("Pet ID invalid", 404));
  }
  res.status(200).json({
    status: "success",
    data: updatedPet,
  });
});

// Route: ‘/pet/:id/save’ [DELETE] (protected to logged in users)
const deleteSavedPet = catchAsync(async (req, res, next) => {
  const updatedPet = await User.findByIdAndUpdate(
    req.user._id,
    { $pullAll: { savedPets: [req.params.id] } },
    {
      new: true,
      runValidators: true,
    }
  );
  if (!updatedPet) {
    return next(new AppError("Pet ID invalid", 404));
  }
  res.status(200).json({
    status: "success",
    data: updatedPet,
  });
});

// Route: ‘/pet/user/:id’ [GET]
const getPetsByUserId = catchAsync(async (req, res, next) => {
  const result = await User.findById(req.params.id).populate([
    "savedPets",
    "adoptedPets",
    "fosteredPets",
  ]);
  if (!result) {
    return next(new AppError("User ID invalid", 404));
  }

  res.status(200).json({
    status: "success",
    data: {
      userId: result._id,
      savedPets: result.savedPets,
      adoptedPets: result.adoptedPets,
      fosteredPets: result.fosteredPets,
    },
  });
});
// Route: ‘/pet/stats’ [GET] (protected to admin only)
const getPetStats = catchAsync(async (req, res, next) => {
  const stats = await Pet.aggregate([
    {
      $addFields: {
        ageValue: {
          $switch: {
            branches: [
              { case: { $eq: ["$age", "Puppy"] }, then: 1 },
              { case: { $eq: ["$age", "Young"] }, then: 3.5 },
              { case: { $eq: ["$age", "Adult"] }, then: 7 },
              { case: { $eq: ["$age", "Senior"] }, then: 12 },
            ],
            default: 0,
          },
        },
      },
    },
    {
      $group: {
        _id: "$type",
        numOfPets: { $sum: 1 },
        avgWeight: { $avg: "$weight" },
        avgHeight: { $avg: "$height" },
        avgAgeValue: { $avg: "$ageValue" },
        adoptedPets: {
          $sum: {
            $cond: [{ $eq: ["$adoptionStatus", "Adopted"] }, 1, 0],
          },
        },
        fosteredPets: {
          $sum: {
            $cond: [{ $eq: ["$adoptionStatus", "Fostered"] }, 1, 0],
          },
        },
        availablePets: {
          $sum: {
            $cond: [{ $eq: ["$adoptionStatus", "Available"] }, 1, 0],
          },
        },
        malePets: {
          $sum: {
            $cond: [{ $eq: ["$gender", "Male"] }, 1, 0],
          },
        },
        femalePets: {
          $sum: {
            $cond: [{ $eq: ["$gender", "Female"] }, 1, 0],
          },
        },
        hypoallergenicPets: {
          $sum: {
            $cond: [{ $eq: ["$hypoallergenic", true] }, 1, 0],
          },
        },
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
  adoptFosterPet,
  returnPet,
  savePet,
  deleteSavedPet,
  getPetsByUserId,
  getPetStats,
};
