const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
  email: {
    type: String,
    unique: true,
  },
  password: String,
  firstName: String,
  lastName: String,
  phoneNum: Number,
  createdAt: Date,
  updatedAt: Date,
});

module.exports = mongoose.model("User", userSchema);
