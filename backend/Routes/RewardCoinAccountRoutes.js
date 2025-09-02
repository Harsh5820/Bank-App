const express = require("express");
const {
  newRewardCoinAccount,
  myRewardCoinAccount,
  RewardCoinWithdraw,
} = require("../Controllers/RewardCoinAccountController");
const verifyToken = require("../Middleware/Auth");
const router = express.Router();

router.get("/myrewardcoinaccount", verifyToken, myRewardCoinAccount);
router.post("/withdrawcoin", verifyToken, RewardCoinWithdraw);

module.exports = router;
