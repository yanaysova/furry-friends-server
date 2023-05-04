const mongoose = require("mongoose");

const petSchema = new mongoose.Schema({
  type: {
    type: String,
    required: [true, "Pet type missing"],
  },
  name: {
    type: String,
    required: [true, "Pet name missing"],
  },
  adoptionStatus: {
    type: String,
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
  color: String,
  bio: String,
  hypoallergnic: {
    type: Boolean,
    required: [true, "Hypoallergnic info missing"],
  },
  diatery: Array,
  breed: {
    type: String,
    required: [true, "Pet breed missing"],
  },
});

const Pet = mongoose.model("Pet", petSchema);

module.exports = Pet;
