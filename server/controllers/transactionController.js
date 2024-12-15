const { Account } = require("../models/accountModel");
const { transactionSchema } = require("../validations");
const mongoose = require("mongoose");

const transferMoney = async (req, res) => {
  try {
    const session = await mongoose.startSession();
    session.startTransaction();
    const validation = transactionSchema.safeParse(req.body);
    if (!validation.success) {
      return res.status(400).json({
        error: "Validation Error",
        details: validation.error.errors,
      });
    }

    const { recieverId, amount } = validation.data;

    const recieverAccount = await Account.findOne({ userId: recieverId });

    if (!recieverAccount) {
      await session.abortTransaction();
      return res.status(400).json({ error: "Reciever id does not exists" });
    }

    await Account.updateOne(
      { userId: req.user.userId },
      { $inc: { balance: -amount } }
    ).session(session);

    await Account.updateOne(
      { userId: recieverAccount.userId },
      { $inc: { balance: amount } }
    ).session(session);

    await session.commitTransaction();
    res.json({
      message: "Transfer successful",
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: "Internal server error" });
  }
};

const getBalance = async (req, res) => {
  try {
    const userId = req.user.userId;
    console.log(userId);
    const account = await Account.findOne({ userId: userId });
    if (!account) {
      return res.status(400).json({ error: "Account not found" });
    }
    return res.status(200).json({ balance: account.balance });
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: "Internal server error" });
  }
};

module.exports = { transferMoney, getBalance };
