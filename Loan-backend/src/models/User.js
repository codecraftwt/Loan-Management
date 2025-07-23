const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");

const userSchema = new mongoose.Schema(
  {
    email: {
      type: String,
      required: true,
      unique: true,
    },
    userName: {
      type: String,
      required: true,
      unique: true,
    },
    password: {
      type: String,
      required: true,
    },
    profileImage: {
      type: String,
    },
    address: {
      type: String,
      required: true,
    },
    aadharCardNo: {
      type: String,
      required: true,
      // match: [/^\d{12}$/, "Please provide a valid 12-digit Aadhar number"],
    },
    mobileNo: {
      type: String,
      required: true,
      // match: [/^\d{10}$/, "Please provide a valid 10-digit mobile number"],
    },
    subscription: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Subscription",
    },
    // Store multiple device tokens as an array
    deviceTokens: [
      {
        type: String, // Each device token will be stored as a string
        required: false, // Tokens are optional initially and will be updated later
      },
    ],
  },
  { timestamps: true }
);

const User = mongoose.model("User", userSchema);
module.exports = User;
