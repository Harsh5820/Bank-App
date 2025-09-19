const mongoose = require("mongoose");

const accountSchema = new mongoose.Schema(
  {
    accountNumber: {
      type: String,
      required: true,  
      validate: {
        validator: (val) => /^\d{9}$/.test(val), // exactly 9 digits
        message: "Account number must be exactly 9 digits",
      },
    },
    holderName: {
      type: String,
      required: true,
      trim: true,
    },
    accountBalance: {
      type: Number,
      default: 1000,
      min: [0, "Account balance cannot be negative"],
    },
    accountEmail: {
      type: String,
      required: true,
      lowercase: true,
      trim: true,
      match: [
        /^\S+@\S+\.\S+$/,
        "Please provide a valid email address",
      ],
    },
    phoneNumber: {
      type: String,
      required: true,
      validate: {
        validator: (val) => /^\d{10}$/.test(val), // simple check: 10 digits
        message: "Phone number must be 10 digits",
      },
    },
    accountType: {
      type: String,
      enum: ["Savings", "Current"],
      default:"Savings",
      required: true,
    },
    accountPriority: {
      type: String,
      enum: ["Primary", "Secondary"],
      default: "Secondary",
    },
    createdBy: {
      type: mongoose.Types.ObjectId,
      ref: "User",
      required: true,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Account", accountSchema);
