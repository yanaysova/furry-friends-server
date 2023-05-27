const mongoose = require("mongoose");
const validator = require("validator");

const Schema = mongoose.Schema;

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
    type: String,
    required: [true, "Phone number missing"],
    validate: {
      validator: function (v) {
        var re = /^\d{10}$/;
        return v == null || v.trim().length < 1 || re.test(v);
      },
      message: "Phone number should be 10 digits and contain only numbers",
    },
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
  savedPets: [
    {
      type: Schema.Types.ObjectId,
      ref: "Pet",
    },
  ],
  adoptedPets: [
    {
      type: Schema.Types.ObjectId,
      ref: "Pet",
    },
  ],
  fosteredPets: [
    {
      type: Schema.Types.ObjectId,
      ref: "Pet",
    },
  ],
});

const User = mongoose.model("User", userSchema);

module.exports = User;
