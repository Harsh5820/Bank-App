const mongoose = require("mongoose");

const accountSchema = mongoose.Schema(
  {
    accountNumber: {
      type: Number,
      length: 9,
    },
    holderName: {
      type: String,
    },
    accountBalance: {
      type: Number,
      default: 1000,
    },
    accountEmail: {
      type: String,
    },
    phoneNumber: {
      type: Number,
    },
    accountType: {
      type: String,
      enum: ["Savings", "Current"],
      required: true,
    },
    createdBy: {
      type: mongoose.Types.ObjectId,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Account", accountSchema);
