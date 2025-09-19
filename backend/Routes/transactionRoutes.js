const express = require("express");
const {
  newTransaction,
  myTransactions,
} = require("../Controllers/transactionController");
const verifyToken = require("../Middleware/Auth");
const sendEmail = require("../Utils/Mailer");
const bcrypt = require("bcrypt");
const TransactionOTP = require("../Models/TransactionOtpModel");

const router = express.Router();

router.post("/request-transaction-otp", verifyToken, async (req, res) => {
  try {
    const { userEmail } = req.user;
    if (!userEmail) {
      return res.status(400).json({ error: "User email not found" });
    }

    const otp = Math.floor(100000 + Math.random() * 900000);
    const hashedOtp = await bcrypt.hash(otp.toString(), 10);

    await TransactionOTP.create({
      userId: req.user._id,
      otp: hashedOtp,
      expiresAt: Date.now() + 5 * 60 * 1000,
    });

    const emailSent = await sendEmail(
      userEmail,
      "BlueBank Transaction OTP",
      `Your OTP is ${otp}. It expires in 5 minutes.`
    );

    if (!emailSent) {
      return res.status(500).json({ error: "Failed to send OTP email" });
    }

    res.json({ message: "OTP sent to your email" });
  } catch (error) {
    console.error("request-transaction-otp error:", error);
    res.status(500).json({ error: "Failed to send OTP" });
  }
});

router.post("/newtransaction", verifyToken, newTransaction);
router.get("/mytransactions/:id", verifyToken, myTransactions);

module.exports = router;
