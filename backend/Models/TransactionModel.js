const mongoose = require("mongoose");

const transactionSchema = new mongoose.Schema(
  {
    senderAccountNumber: {
      type: String, // use String to enforce length properly
      required: true,
      validate: {
        validator: (val) => /^\d{9}$/.test(val), // must be exactly 9 digits
        message: "Sender account number must be 9 digits",
      },
    },
    recieverAccountNumber: {
      type: String,
      required: true,
      validate: {
        validator: (val) => /^\d{9}$/.test(val),
        message: "Receiver account number must be 9 digits",
      },
    },
    transactionAmount: {
      type: Number,
      required: true,
      min: [1, "Transaction amount must be greater than 0"],
    },
    senderName: {
      type: String,
      trim: true,
    },
    recieverName: {
      type: String,
      trim: true,
    },
  },
  { timestamps: true }
);

// Prevent self-transfer at schema level
transactionSchema.pre("save", function (next) {
  if (this.senderAccountNumber === this.recieverAccountNumber) {
    return next(new Error("Sender and receiver accounts cannot be the same"));
  }
  next();
});

module.exports = mongoose.model("Transaction", transactionSchema);
