const mongoose = require("mongoose");

const RewardCoinAccountSchema = mongoose.Schema(
  {
    createdBy: {
      type: mongoose.Types.ObjectId,
      required: true,
    },
    coinBalance: {
      type: Number,
      default: 0
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("RewardCoinAccount", RewardCoinAccountSchema);