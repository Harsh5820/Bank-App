const mongoose = require("mongoose");

const beneficiarySchema = mongoose.Schema(
  {
    beneficiaryName: {
      type: String,
      required: true,
      trim: true,
    },
    beneficiaryAccountNumber: {
      type: String,
      required: true,
      match: [/^\d{9}$/, "Account number must be exactly 9 digits"],
    },
    beneficiaryPhoneNumber: {
      type: String,
      required: true,
      match: [/^\d{10}$/, "Phone number must be 10 digits"],
    },
    beneficiaryNickName: {
      type: String,
      trim: true,
    },
    beneficiaryTransactionLimit: {
      type: Number,
      default: 0,
      min: 0,
    },
    beneficiaryStatus: {
      type: String,
      enum: ["Approved", "Rejected", "Pending for Approval"],
      default: "Pending for Approval",
    },
    createdBy: {
      type: mongoose.Types.ObjectId,
      ref: "User", // links to User schema
      required: true,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Beneficiary", beneficiarySchema);
