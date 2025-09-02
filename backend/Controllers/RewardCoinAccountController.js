const RewardCoinAccount = require("../Models/RewardCoinAccountModel");
const Account = require("../Models/AccountModel");

const myRewardCoinAccount = async (req, res) => {
  const userId = req.user?._id;
  try {
    if (!userId) {
      return res.status(400).json({ error: "userid invalid" });
    }
    const myRewardCoinAccount = await RewardCoinAccount.findOne({
      createdBy: userId,
    });
    if (!myRewardCoinAccount) {
      const data = await RewardCoinAccount.create({ createdBy: userId });
      return res.status(200).json(data);
    }

    return res.status(200).json(myRewardCoinAccount);
  } catch (error) {
    return res.status(400).json(error);
  }
};

const RewardCoinWithdraw = async (req, res) => {
  const userId = req.user?._id;
  const { coinAmount } = req.body;
  const userRewardAccount = await RewardCoinAccount.findOne({
    createdBy: userId,
  });
  const userRewardAccountBalance = userRewardAccount?.coinBalance;
  const userAccount = await Account.findOne({ createdBy: userId });

  try {
    if (!coinAmount) {
      return res
        .status(400)
        .json({ error: "Please mention the number of coins" });
    }
    if (coinAmount <= 0) {
      return res
        .status(400)
        .json({ error: "Coin amount cannot be less than or equal to 0" });
    }
    if (coinAmount > userRewardAccountBalance) {
      return res.status(400).json({ error: "Insufficient balance" });
    }
    const addbalance = coinAmount * 0.1; //each coin is worth 10 paise

    userAccount.accountBalance += addbalance;
    userRewardAccount.coinBalance -= coinAmount;

    await userAccount.save();
    await userRewardAccount.save();
    return res.status(200).json("Transaction complete");
  } catch (error) {
    return res.status(400).json(error);
  }
};

module.exports = { myRewardCoinAccount, RewardCoinWithdraw };
