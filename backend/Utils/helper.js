// utils/createNotification.js
const Notification = require("../Models/NotificationModel");

const createAndEmitNotification = async ({
  io,
  onlineUsers,
  userId,
  type,
  message,
  meta = {},
}) => {
  try {
    // 1. Save to DB
    const note = await Notification.create({
      userId,
      type,
      message,
      meta,
    });

    // 2. Emit if user online
    const socketId = onlineUsers?.[userId?.toString()];
    if (socketId) {
      io.to(socketId).emit("notification", note);
    }

    return note;
  } catch (err) {
    console.error("Error creating notification:", err);
  }
};

module.exports = createAndEmitNotification;
