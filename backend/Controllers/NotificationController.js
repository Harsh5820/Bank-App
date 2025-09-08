const Notification = require("../Models/NotificationModel");

const createNotification = async ({ userId, type, message }) => {
  try {
    const notification = new Notification({
      userId,
      type,
      message,
    });
    await notification.save();
    return notification;
  } catch (error) {
    console.error("❌ Error creating notification:", error);
    throw error;
  }
};

const getUserNotifications = async (req, res) => {
  try {
    const notes = await Notification.find({ userId: req.params.userId })
      .sort({ createdAt: -1 })
      .lean();

    res.json(notes);
  } catch (error) {
    console.error("❌ Error fetching notifications:", error);
    res.status(500).json({ error: "Failed to fetch notifications" });
  }
};

const markAllRead = async (req, res) => {
  try {
    await Notification.updateMany(
      { userId: req.params.userId },
      { $set: { isRead: true } }
    );
    res.json({ success: true, message: "All notifications marked as read" });
  } catch (error) {
    console.error("❌ Error marking notifications as read:", error);
    res.status(500).json({ error: "Failed to mark as read" });
  }
};

module.exports = {
  createNotification, // for backend use (transaction, reward, etc.)
  getUserNotifications,
  markAllRead,
};
