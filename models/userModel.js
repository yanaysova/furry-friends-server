const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
  email: {
    type: String,
    unique: true,
  },
  password: {
    type: String,
    required: [true, "Password missing"],
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
