const express = require("express");
const {
  createAccount,
  myAccounts,
  MyAccount,
  deleteAccount,
} = require("../Controllers/accountController");
const verifyToken = require("../Middleware/Auth");
const router = express.Router();

router.post("/createaccount", verifyToken, createAccount);
router.get("/myaccounts", verifyToken, myAccounts);
router.get("/myaccount/:id", verifyToken, MyAccount);
router.delete("/deleteaccount/:id", verifyToken, deleteAccount);

module.exports = router;
