const mongoose = require("mongoose");

const accountSchema = mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      trim: true,
    },
    balance: {
      type: Number,
      required: true,
      // validate: {
      //   validate: (value) => value > 0,
      //   message: "Amount must be positive",
      // },
      trim: true,
    },
  },
  { timestamps: true }
);

const Account = mongoose.model("Account", accountSchema);

module.exports = { Account };
