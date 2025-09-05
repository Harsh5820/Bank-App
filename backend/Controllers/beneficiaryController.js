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
      return res.status(400).json({ error: "All fields are mandatory !!!" });
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
      return res
        .status(400)
        .json({ error: "Beneficiary Account Number is Incorrect" });
    }
    const loggedInUserAccount = await Account.findOne({ createdBy: userId });
    if (!loggedInUserAccount) {
      return res
        .status(400)
        .json({ error: "Logged user does not have an account" });
    }
    if (
      beneficiaryAccount.accountNumber === loggedInUserAccount.accountNumber
    ) {
      return res
        .status(400)
        .json({ error: "You cannot add yourself as beneficiary" });
    }

    const newBeneficiary = await Beneficiary.create({
      beneficiaryName: beneficiaryAccount.holderName,
      beneficiaryAccountNumber,
      beneficiaryNickName,
      beneficiaryTransactionLimit,
      beneficiaryPhoneNumber: beneficiaryAccount.phoneNumber,
      createdBy: userId,
    });
    if (!newBeneficiary) {
      return res.status(400).json({
        error: "Error in adding beneficiary, please try again after some time.",
      });
    }

    if (newBeneficiary) {
      // Schedule auto-approval
      setTimeout(async () => {
        try {
          await Beneficiary.findByIdAndUpdate(newBeneficiary._id, {
            beneficiaryStatus: "Approved",
          });
          console.log(`Beneficiary ${newBeneficiary._id} auto-approved`);
        } catch (err) {
          console.error("Error auto-approving beneficiary:", err);
        }
      }, 6000); //6 seconds
    }
    return res.status(200).json(newBeneficiary);
  } catch (error) {
    return res.status(400).json(error);
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
    return res.status(400).json(error);
  }
};

const myBeneficiary = async (req, res) => {
  const { id } = req.params;
  try {
    const myBeneficiary = await Beneficiary.findOne({ _id: id });
    if (!myBeneficiary) {
      return res.status(400).json({ error: "Benefiicary not found !!" });
    }
    return res.status(200).json(myBeneficiary);
  } catch (error) {
    return res.status(400).json(error);
  }
};

const editBeneficiary = async (req, res) => {
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
        .json({ error: "Beneficiary Account number is mandatory !!" });
    }

    const beneficiaryAccount = await Account.findOne({
      accountNumber: beneficiaryAccountNumber,
    });
    if (!beneficiaryAccount) {
      return res
        .status(400)
        .json({ error: "Beneficiary Account Number is Incorrect" });
    }
    const updatedBeneficiary = await Beneficiary.findByIdAndUpdate(
      { _id: id },
      {
        beneficiaryAccountNumber: beneficiaryAccountNumber,
        beneficiaryNickName: beneficiaryNickName,
        beneficiaryTransactionLimit: beneficiaryTransactionLimit,
      },
      { new: true }
    );
    console.log("a");
    return res.status(200).json(updatedBeneficiary);
  } catch (error) {
    return res.status(400).json(error);
  }
};

const deleteBeneficiary = async (req, res) => {
  const { id } = req.params;

  try {
    const deleteBeneficiary = await Beneficiary.findByIdAndDelete({ _id: id });

    return res.status(200).json(deleteBeneficiary);
  } catch (error) {
    return res.status(400).json(error);
  }
};

module.exports = {
  addBeneficiary,
  myBeneficiaries,
  editBeneficiary,
  deleteBeneficiary,
  myBeneficiary,
};
