const mongoose = require("mongoose");

const transactionSchema = mongoose.Schema(
  {
    senderAccountNumber: {
      type: Number,
      required: true,
    },
    recieverAccountNumber: {
      type: Number,
      required: true,
    },
    transactionAmount: {
      type: Number,
      required: true,
    },
    senderName: {
      type: String,
    },
    recieverName: {
      type: String,
    },
    transactionDate: {
      type: Date,
      default: Date.now(),
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Transaction", transactionSchema);
