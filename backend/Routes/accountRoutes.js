const express = require("express");
const {
  createAccount,
  myAccounts,
  MyAccount,
  deleteAccount,
  deleteAccountsByUser,
  setAccountPrimary,
} = require("../Controllers/accountController");
const verifyToken = require("../Middleware/Auth");
const router = express.Router();

router.post("/createaccount", verifyToken, createAccount);
router.post("/setaccountprimary/:accountId", verifyToken, setAccountPrimary);
router.get("/myaccounts", verifyToken, myAccounts);
router.get("/myaccount/:id", verifyToken, MyAccount);
router.delete("/deleteaccount/:id", verifyToken, deleteAccount);
router.delete("/deleteaccountbyuser", verifyToken, deleteAccountsByUser);

module.exports = router;
