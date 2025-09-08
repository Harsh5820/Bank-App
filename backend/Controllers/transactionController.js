const Transaction = require("../Models/TransactionModel");
const Account = require("../Models/AccountModel");
const RewardCoinAccount = require("../Models/RewardCoinAccountModel");
const Notifications = require("../Models/NotificationModel");
const User = require("../Models/userModel");
const createAndEmitNotification = require("../Utils/helper");

const newTransaction = async (req, res) => {
  const userID = req.user?._id;
  const { senderAccountNumber, recieverAccountNumber, transactionAmount } =
    req.body;

  try {
    // ✅ Basic validations
    if (!senderAccountNumber || !recieverAccountNumber || !transactionAmount) {
      return res.status(400).json({ error: "All fields are mandatory !!" });
    }

    if (recieverAccountNumber.toString().length !== 9) {
      return res
        .status(400)
        .json({ error: "Account number should be 9 digits only" });
    }

    const amountNum = Number(transactionAmount);
    if (!Number.isFinite(amountNum) || amountNum <= 0) {
      return res
        .status(400)
        .json({ error: "Transaction amount should be more than 0" });
    }

    // ✅ Accounts
    const senderAccount = await Account.findOne({
      accountNumber: senderAccountNumber,
    });
    if (!senderAccount) {
      return res.status(400).json({ error: "Sender account not found" });
    }

    const reciverAccount = await Account.findOne({
      accountNumber: recieverAccountNumber,
    });
    if (!reciverAccount) {
      return res
        .status(400)
        .json({ error: "Reciever account number is incorrect" });
    }

    // ✅ Balances
    if (amountNum > senderAccount.accountBalance) {
      return res.status(400).json({ error: "Insufficient Funds!!" });
    }

    const senderName = senderAccount.holderName;
    const recieverName = reciverAccount.holderName;

    // (optional) reward account may not exist for all users, guard it
    const userRewardAccount = await RewardCoinAccount.findOne({
      createdBy: userID,
    }).catch(() => null);

    const tx = await Transaction.create({
      senderAccountNumber,
      recieverAccountNumber,
      transactionAmount,
      senderName,
      recieverName,
    });

    // balances + reward save...
    await Promise.all([
      senderAccount.save(),
      reciverAccount.save(),
      userRewardAccount?.save?.(),
    ]);

    // ✅ Notifications (generalised)
    const io = req.app.get("io");
    const onlineUsers = req.app.get("onlineUsers");

    // For sender
    const senderNote = await createAndEmitNotification({
      io,
      onlineUsers,
      userId: userID,
      type: "transaction",
      message: `₹${transactionAmount} sent to ${recieverName} (${recieverAccountNumber})`,
      meta: { transactionId: tx._id, direction: "debit" },
    });

    // For receiver
    const receiverNote = await createAndEmitNotification({
      io,
      onlineUsers,
      userId: reciverAccount.createdBy,
      type: "transaction",
      message: `₹${transactionAmount} received from ${senderName} (${senderAccountNumber})`,
      meta: { transactionId: tx._id, direction: "credit" },
    });

    res.status(200).json({
      transaction: tx,
      notifications: { sender: senderNote, receiver: receiverNote },
    });
  } catch (error) {
    console.error("newTransaction error:", error);
    return res.status(500).json({ error: "Transaction failed" });
  }
};

const myTransactions = async (req, res) => {
  const accountId = req.params.id; //account number sent from the fontend as Id
  try {
    const loggedInUserEmail = req.user?.userEmail;
    if (!loggedInUserEmail) {
      return res.status(401).json({ error: "Unauthorized access" });
    }

    const loggedInUserAccount = await Account.findOne({
      accountNumber: accountId,
    });
    if (!loggedInUserAccount) {
      return res.status(404).json({ error: "Account not found for user" });
    }
    const allTransactions = await Transaction.find({
      $or: [
        { senderAccountNumber: accountId },
        { recieverAccountNumber: accountId },
      ],
    }).sort({ createdAt: -1 }); //sort by newest first

    const allTransactionsSent = await Transaction.find({
      senderAccountNumber: accountId,
    });
    const allTransactionsRecieved = await Transaction.find({
      recieverAccountNumber: accountId,
    });

    return res
      .status(200)
      .json({ allTransactions, allTransactionsSent, allTransactionsRecieved });
  } catch (error) {
    res.status(500).json({ error: "Something went wrong" });
  }
};

module.exports = { newTransaction, myTransactions };
