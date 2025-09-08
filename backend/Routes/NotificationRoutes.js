const express = require("express");
const router = express.Router();
const {
  getUserNotifications,
  markAllRead,
} = require("../Controllers/NotificationController");

router.get("/my/:userId", getUserNotifications);

router.put("/read/:userId", markAllRead);

module.exports = router;
