const Transaction = require("../Models/TransactionModel");
const Account = require("../Models/AccountModel");
const RewardCoinAccount = require("../Models/RewardCoinAccountModel");
const Notifications = require("../Models/NotificationModel");
const User = require("../Models/userModel");
const mongoose = require("mongoose");

const newTransaction = async (req, res) => {
  const userID = req.user?._id;
  let { senderAccountNumber, recieverAccountNumber, transactionAmount } =
    req.body;

  transactionAmount = Number(transactionAmount);

  if (!senderAccountNumber || !recieverAccountNumber || !transactionAmount) {
    return res.status(400).json({ error: "All fields are mandatory" });
  }
  if (recieverAccountNumber.toString().length !== 9) {
    return res.status(400).json({ error: "Receiver account must be 9 digits" });
  }
  if (transactionAmount <= 0) {
    return res.status(400).json({ error: "Transaction amount must be > 0" });
  }

  const session = await mongoose.startSession();
  session.startTransaction();

  try {
    const senderAccount = await Account.findOne({
      accountNumber: senderAccountNumber,
      createdBy: userID,
    }).session(session);

    if (!senderAccount) {
      throw new Error("Sender account not found or unauthorized");
    }

    const receiverAccount = await Account.findOne({
      accountNumber: recieverAccountNumber,
    }).session(session);

    if (!receiverAccount) {
      throw new Error("Receiver account not found");
    }

    if (transactionAmount > senderAccount.accountBalance) {
      throw new Error("Insufficient funds");
    }

    senderAccount.accountBalance -= transactionAmount;
    receiverAccount.accountBalance += transactionAmount;

    const userRewardAccount = await RewardCoinAccount.findOneAndUpdate(
      { createdBy: userID },
      { $inc: { coinBalance: transactionAmount * 0.1 } },
      { new: true, upsert: true, session }
    );

    const newTxn = await Transaction.create(
      [
        {
          senderAccountNumber,
          recieverAccountNumber,
          transactionAmount,
          senderName: senderAccount.holderName,
          recieverName: receiverAccount.holderName,
        },
      ],
      { session }
    );

    await Promise.all([
      senderAccount.save({ session }),
      receiverAccount.save({ session }),
    ]);

    await Notifications.insertMany(
      [
        {
          userId: userID,
          notificationType: "transaction",
          notificationTitle: "Transaction Alert",
          notificationMessage: `You sent ₹${transactionAmount} to ${receiverAccount.holderName}`,
        },
        {
          userId: receiverAccount.createdBy,
          notificationType: "transaction",
          notificationTitle: "Transaction Alert",
          notificationMessage: `You received ₹${transactionAmount} from ${senderAccount.holderName}`,
        },
      ],
      { session }
    );

    await session.commitTransaction();
    session.endSession();

    res.status(200).json(newTxn[0]);
  } catch (error) {
    await session.abortTransaction();
    session.endSession();
    console.error("newTransaction error:", error.message);
    return res
      .status(400)
      .json({ error: error.message || "Transaction failed" });
  }
};

const myTransactions = async (req, res) => {
  const accountNumberToFetch = req.params.id;
  const userId = req.user._id;

  try {
    // ✅ Ensure the account belongs to the logged-in user
    const loggedInUserAccount = await Account.findOne({
      accountNumber: accountNumberToFetch,
      createdBy:userId
    });
  

    if (!loggedInUserAccount) {
      return res.status(403).json({
        error: "You do not have access to this account",
      });
    }

    // ✅ Fetch all transactions for this account
    const allTransactions = await Transaction.find({
      $or: [
        { senderAccountNumber: accountNumberToFetch },
        { recieverAccountNumber: accountNumberToFetch },
      ],
    }).sort({ createdAt: -1 });

    // ✅ Directly query sent & received transactions separately
    const [allTransactionsSent, allTransactionsRecieved] = await Promise.all([
      Transaction.find({ senderAccountNumber: accountNumberToFetch }).sort({
        createdAt: -1,
      }),
      Transaction.find({ recieverAccountNumber: accountNumberToFetch }).sort({
        createdAt: -1,
      }),
    ]);

    return res.status(200).json({
      allTransactions,
      allTransactionsSent,
      allTransactionsRecieved,
    });
  } catch (error) {
    console.error("myTransactions error:", error.message);
    return res.status(500).json({ error: "Something went wrong" });
  }
};

module.exports = { newTransaction, myTransactions };
