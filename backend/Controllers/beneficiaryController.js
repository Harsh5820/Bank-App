const Beneficiary = require("../Models/BeneficiaryModel");
const Account = require("../Models/AccountModel");

const addBeneficiary = async (req, res) => {
  const userId = req.user?._id;
  const {
    beneficiaryAccountNumber,
    beneficiaryNickName,
    beneficiaryTransactionLimit,
  } = req.body;

  try {
    if (!beneficiaryAccountNumber || !beneficiaryTransactionLimit) {
      return res.status(400).json({ error: "All fields are mandatory" });
    }

    if (beneficiaryAccountNumber.toString().length !== 9) {
      return res.status(400).json({ error: "Account number must be 9 digits" });
    }
    if (beneficiaryTransactionLimit <= 0) {
      return res
        .status(400)
        .json({ error: "Transaction limit must be positive" });
    }

    const existingBeneficiary = await Beneficiary.findOne({
      createdBy: userId,
      beneficiaryAccountNumber,
    });
    if (existingBeneficiary) {
      return res.status(400).json({ error: "Beneficiary already exists" });
    }

    const beneficiaryAccount = await Account.findOne({
      accountNumber: beneficiaryAccountNumber,
    });
    if (!beneficiaryAccount) {
      return res.status(400).json({ error: "Beneficiary account not found" });
    }

    const loggedInUserAccount = await Account.findOne({ createdBy: userId });
    if (!loggedInUserAccount) {
      return res.status(400).json({ error: "User does not have an account" });
    }

    if (
      beneficiaryAccount.accountNumber === loggedInUserAccount.accountNumber
    ) {
      return res
        .status(400)
        .json({ error: "You cannot add yourself as a beneficiary" });
    }

    const newBeneficiary = await Beneficiary.create({
      beneficiaryName: beneficiaryAccount.holderName,
      beneficiaryAccountNumber,
      beneficiaryNickName,
      beneficiaryTransactionLimit,
      beneficiaryPhoneNumber: beneficiaryAccount.phoneNumber,
      createdBy: userId,
    });

    // Better: use cron or background worker instead of setTimeout
    setTimeout(async () => {
      try {
        await Beneficiary.findByIdAndUpdate(newBeneficiary._id, {
          beneficiaryStatus: "Approved",
        });
      } catch (err) {
        console.error("Auto-approval error:", err.message);
      }
    }, 6000);

    return res.status(201).json({ success: true, data: newBeneficiary });
  } catch (error) {
    console.error("addBeneficiary error:", error.message);
    return res.status(500).json({ error: "Something went wrong" });
  }
};

const myBeneficiaries = async (req, res) => {
  const userId = req.user?._id;
  try {
    const myBeneficiaries = await Beneficiary.find({
      createdBy: userId,
      beneficiaryStatus: { $in: ["Approved", "Pending for Approval"] },
    });

    return res.status(200).json(myBeneficiaries);
  } catch (error) {
    return res.status(500).json({ error: "Failed to fetch beneficiaries" });
  }
};

const myBeneficiary = async (req, res) => {
  const userId = req.user?._id;
  const { id } = req.params;

  try {
    const myBeneficiary = await Beneficiary.findOne({
      _id: id,
      createdBy: userId, // 🔑 ownership check
    });

    if (!myBeneficiary) {
      return res.status(404).json({ error: "Beneficiary not found" });
    }

    return res.status(200).json(myBeneficiary);
  } catch (error) {
    return res.status(500).json({ error: "Failed to fetch beneficiary" });
  }
};

const editBeneficiary = async (req, res) => {
  const userId = req.user?._id;
  const { id } = req.params;
  const {
    beneficiaryAccountNumber,
    beneficiaryNickName,
    beneficiaryTransactionLimit,
  } = req.body;

  try {
    if (!beneficiaryAccountNumber) {
      return res
        .status(400)
        .json({ error: "Beneficiary Account number is mandatory" });
    }

    const beneficiaryAccount = await Account.findOne({
      accountNumber: beneficiaryAccountNumber,
    });

    if (!beneficiaryAccount) {
      return res
        .status(400)
        .json({ error: "Beneficiary Account Number is incorrect" });
    }

    const updatedBeneficiary = await Beneficiary.findOneAndUpdate(
      { _id: id, createdBy: userId }, // 🔑 secure update
      {
        beneficiaryAccountNumber,
        beneficiaryNickName,
        beneficiaryTransactionLimit,
      },
      { new: true }
    );

    if (!updatedBeneficiary) {
      return res.status(404).json({ error: "Beneficiary not found" });
    }

    return res.status(200).json(updatedBeneficiary);
  } catch (error) {
    return res.status(500).json({ error: "Failed to update beneficiary" });
  }
};

const deleteBeneficiary = async (req, res) => {
  const userId = req.user?._id;
  const { id } = req.params;

  try {
    const deletedBeneficiary = await Beneficiary.findOneAndDelete({
      _id: id,
      createdBy: userId, // 🔑 secure delete
    });

    if (!deletedBeneficiary) {
      return res.status(404).json({ error: "Beneficiary not found" });
    }

    return res
      .status(200)
      .json({ message: "Beneficiary deleted successfully" });
  } catch (error) {
    return res.status(500).json({ error: "Failed to delete beneficiary" });
  }
};

module.exports = {
  addBeneficiary,
  myBeneficiaries,
  editBeneficiary,
  deleteBeneficiary,
  myBeneficiary,
};
