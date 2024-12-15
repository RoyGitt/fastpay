const { Account } = require("../models/accountModel");

const checkBalanceMiddleware = async (req, res, next) => {
  try {
    const { amount } = req.body;
    if (!amount) {
      return res.status(400).json({ error: "Amount not mentioned" });
    }
    const senderAccount = await Account.findOne({ userId: req.user.userId });

    const senderBalance = senderAccount.balance;

    if (amount > senderBalance) {
      return res.status(400).json({ error: "Insufficient balance" });
    }
    next();
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: "Internal server error" });
  }
};

module.exports = checkBalanceMiddleware;
