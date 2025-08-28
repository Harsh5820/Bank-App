const Account = require("../Models/AccountModel");
const User = require("../Models/userModel");

const createAccount = async (req, res) => {
  const { accountType } = req.body;
  const loggedInUser = await User.findOne({ _id: req.user._id });

  try {
    if (!accountType) {
      return res
        .status(400)
        .json({ error: "Missing account type!" });
    }

    let isUnique = false;
    let newAccountNumber;

    while (!isUnique) {
      newAccountNumber = Math.floor(100000000 + Math.random() * 900000000); // Ensures 9 digits
      const existingAccount = await Account.findOne({
        accountNumber: newAccountNumber,
      });
      if (!existingAccount) {
        isUnique = true;
      }
    }

    const newAccount = await Account.create({
      accountNumber: newAccountNumber,
      holderName: loggedInUser.userName,
      accountEmail: loggedInUser.userEmail,
      phoneNumber: loggedInUser.userPhoneNumber,
      accountType,
      createdBy: loggedInUser._id,
    });

    return res.status(201).json(newAccount);
  } catch (error) {
    return res
      .status(500)
      .json({ error: "Server error while creating account." });
  }
};

const myAccounts = async (req, res) => {
  const loggedInUserEmail = req.user?.userEmail;

  try {
    const myAccounts = await Account.find({
      accountEmail: loggedInUserEmail,
    });
    if (!myAccounts) {
      return res.status(400).json({ error: "No Account found !!" });
    }

    res.status(200).json(myAccounts);
  } catch (error) {
    console.log(error)
  }
};

const MyAccount = async (req, res) => {
  const { accountNumber } = req.body;
  try {
    const myAccount = await Account.findOne({ accountNumber: accountNumber });
    if (!myAccount) {
      return res.status(400).json({ error: "Account not found !!" });
    }
    res.status(200).json(myAccount);
  } catch (error) {
    res.status(400).json(error);
  }
};

const deleteAccount = async (req, res) => {
  const userId = req.user?._id;
  const deleteAccountId = req.params.id;
  const accountAlreadyDeleted = await Account.findById({
    _id: deleteAccountId,
  });
  const Accounts = await Account.find({ createdBy: userId });
  // console.log(Accounts)

  try {
    if (Accounts.length === 1) {
      return res
        .status(400)
        .json({ error: "Minimum 1 Account is mandatory !!" });
    }

    if (!accountAlreadyDeleted) {
      return res.status(400).json({ error: "Account does not exist" });
    }
    const deletedAccount = await Account.findByIdAndDelete({
      _id: deleteAccountId,
    });
    return res.status(200).json({ deletedAccount });
  } catch (error) {
    return res.status(400).json({ error: "Deleteion Failed !!" });
  }
};

module.exports = { createAccount, myAccounts, MyAccount, deleteAccount };
