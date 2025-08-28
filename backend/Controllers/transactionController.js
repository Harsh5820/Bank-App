const Transaction = require("../Models/TransactionModel");
const Account = require("../Models/AccountModel");
const User = require("../Models/userModel");

const newTransaction = async (req, res) => {
  const userID = req.user?._id;
  const { senderAccountNumber, recieverAccountNumber, transactionAmount } =
    req.body;
  // console.log("reciver account number", recieverAccountNumber.length());

  try {
    if (!senderAccountNumber || !recieverAccountNumber || !transactionAmount) {
      return res.status(400).json({ error: "All fields are mandatory !!" });
    }

    if (recieverAccountNumber.toString().length !== 9) {
      return res
        .status(400)
        .json({ error: "Account number should be 9 digits only" });
    }
    const recieverCheck = await Account.findOne({
      accountNumber: recieverAccountNumber,
    });
    if (!recieverCheck) {
      return res
        .status(400)
        .json({ error: "Reciever account number is incorrect" });
    }

    const senderAccount = await Account.findOne({
      accountNumber: senderAccountNumber,
    });

    const senderName = senderAccount.holderName;
    const reciverAccount = await Account.findOne({
      accountNumber: recieverAccountNumber,
    });
    const recieverName = reciverAccount.holderName;
    if (transactionAmount <= 0) {
      return res
        .status(400)
        .json({ error: "Transaction amount should be more than 0" });
    }
    const senderAccountBalance = senderAccount?.accountBalance;
    if (transactionAmount > senderAccountBalance) {
      return res.status(400).json({ error: "Insufficient Funds!!" });
    }
    const newTransaction = await Transaction.create({
      senderAccountNumber,
      recieverAccountNumber,
      transactionAmount,
      senderName,
      recieverName
    });

    senderAccount.accountBalance -= transactionAmount;
    reciverAccount.accountBalance += transactionAmount;

    await senderAccount.save();
    await reciverAccount.save();

    res.status(200).json({newTransaction,senderName, recieverName});
  } catch (error) {
    console.log(error);
    return res.status(400).json(error);
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

    res
      .status(200)
      .json({ allTransactions, allTransactionsSent, allTransactionsRecieved });
  } catch (error) {
    console.error("Error fetching user transactions:", error);
    res.status(500).json({ error: "Something went wrong" });
  }
};

module.exports = { newTransaction, myTransactions };
