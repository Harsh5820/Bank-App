const mongoose = require("mongoose");

const userSchema = mongoose.Schema(
  {
    userEmail: {
      type: String,
      required: true,
      lowercase: true,
      trim: true,
      match: [/^\S+@\S+\.\S+$/, "Please enter a valid email"],
    },
    userName: {
      type: String,
      required: true,
      trim: true,
    },
    userPhoneNumber: {
      type: String,
      required: true,
      match: [/^\d{10}$/, "Phone number must be 10 digits"],
    },
    userPassword: {
      type: String,
      required: true,
      minlength: 6,
      select: false, // hide password in queries unless explicitly asked
    },
    userDob: {
      type: Date,
    },
    userRole: {
      type: String,
      enum: ["Manager", "Account Holder", "Pending"],
      default: "Pending",
    },
    userStatus: {
      type: String,
      enum: ["Pending", "Approved", "Rejected"],
      default: "Pending",
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("User", userSchema);
