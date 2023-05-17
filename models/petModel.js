const mongoose = require("mongoose");

const petSchema = new mongoose.Schema({
  type: {
    type: String,
    required: [true, "Pet type missing"],
    enum: {
      values: ["Dog", "Cat"],
      message: "Type is either: Dog, Cat",
    },
  },
  name: {
    type: String,
    required: [true, "Pet name missing"],
    trim: true,
    maxLength: [15, "Pet name cannot be more than 15 characters"],
    minLength: [2, "Pet name cannot be less than 20 characters"],
  },
  gender: {
    type: String,
    required: [true, "Pet gender missing"],
    enum: {
      values: ["Male", "Female"],
      message: "Gender is either: Male, Female",
    },
  },
  age: {
    type: Number,
    max: [30, "Age cannot be greater than 30 years"],
    required: [true, "Age missing"],
  },
  adoptionStatus: {
    type: String,
    enum: {
      values: ["Adopted", "Fostered", "Available"],
      message: "Status is either: Adopted, Fostered, Available",
    },
    default: "Available",
  },
  picture: {
    type: String,
    required: [true, "Picture url missing"],
  },
  height: {
    type: Number,
    required: [true, "Height missing"],
  },
  weight: {
    type: Number,
    required: [true, "Weight missing"],
  },
  color: {
    type: String,
    required: [true, "Pet color is missing"],
    trim: true,
  },
  bio: {
    type: String,
    trim: true,
  },
  hypoallergenic: {
    type: Boolean,
    required: [true, "Hypoallergnic info missing"],
  },
  diatery: [String],
  breed: {
    type: String,
    required: [true, "Pet breed missing"],
  },
  createdAt: {
    type: Date,
    default: Date.now(),
  },
  createdBy: {
    type: String,
    default: "Admin",
  },
  editedAt: Date,
});

const Pet = mongoose.model("Pet", petSchema);

module.exports = Pet;
