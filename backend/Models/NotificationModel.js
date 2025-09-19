const mongoose = require("mongoose");

const notificationSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    notificationType: {
      type: String,
      enum: ["transaction", "reward", "alert", "offer", "system"],
      default: "alert",
    },
    notificationMessage: {
      type: String,
      required: true,
      trim: true,
    },
    notificationTitle: {
      type: String,
      required: true,
      trim: true,
    },
    createdAt: {
      type: Date,
      default: Date.now,
    },
  },
  { timestamps: true }
);

// TTL index for auto-delete after 24 hours
notificationSchema.index(
  { createdAt: 1 },
  { expireAfterSeconds: 60 * 60 * 24 }
);

module.exports = mongoose.model("Notification", notificationSchema);
