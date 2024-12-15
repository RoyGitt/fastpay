const { Router } = require("express");
const router = Router();
const userRouter = require("./userRoutes");
const transactionRouter = require("./transactionRoutes");

router.use("/users", userRouter);
router.use("/transactions", transactionRouter);

module.exports = router;
