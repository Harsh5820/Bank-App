const mongoose = require("mongoose");

const userSchema = mongoose.Schema(
  {
    userEmail: {
      type: String,
      unique: true,
      required: true,
    },
    userName: {
      type: String,
      required: true,
    },
    userPhoneNumber: {
      type: Number,
      length: 10,
      required: true,
    },
    userPassword: {
      type: String,
      required: true,
    },
    userDob: {
      type: Date,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("User", userSchema);
