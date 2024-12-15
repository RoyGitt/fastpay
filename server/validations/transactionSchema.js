const { z } = require("zod");

const transactionSchema = z.object({
  recieverId: z.string("No reciever id provided"),
  amount: z.number().positive("Amount must be a positive number."),
});

module.exports = { transactionSchema };
