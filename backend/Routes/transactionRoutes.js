const express = require("express");
const { newTransaction, myTransactions } = require("../Controllers/transactionController");
const verifyToken = require("../Middleware/Auth");

const router = express.Router();

router.post("/newtransaction", verifyToken, newTransaction);
router.get("/mytransactions/:id",verifyToken, myTransactions)

module.exports = router;
