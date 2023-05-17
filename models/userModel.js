const mongoose = require("mongoose");
const validator = require("validator");

const userSchema = new mongoose.Schema({
  email: {
    type: String,
    unique: true,
    required: [true, "Email missing"],
    lowercase: true,
    validate: [validator.isEmail, "Please provide a valid email"],
  },
  password: {
    type: String,
    required: [true, "Password missing"],
    select: false,
  },
  firstName: {
    type: String,
    required: [true, "First name missing"],
  },
  lastName: {
    type: String,
    required: [true, "Last name missing"],
  },
  phoneNum: {
    type: Number,
    required: [true, "Phone number missing"],
  },
  createdAt: {
    type: Date,
    default: Date.now(),
  },
  editedAt: Date,
  isAdmin: {
    type: Boolean,
    default: false,
  },
});

const User = mongoose.model("User", userSchema);

module.exports = User;
