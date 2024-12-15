const { Router } = require("express");
const {
  transferMoney,
  getBalance,
} = require("../controllers/transactionController");
const authMiddleWare = require("../middlewares/authMiddleware");
const checkBalanceMiddleware = require("../middlewares/checkBalanceMiddleware");
const router = Router();

router.get("/", authMiddleWare, checkBalanceMiddleware, transferMoney);
router.get("/get-balance", authMiddleWare, getBalance);

module.exports = router;
