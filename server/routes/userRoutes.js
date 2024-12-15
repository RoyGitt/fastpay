const { Router } = require("express");
const router = Router();
const {
  getUsers,
  signInUser,
  updateUser,
  signUp,
} = require("../controllers/userController");
const authMiddleWare = require("../middlewares/authMiddleware");

router.get("/", authMiddleWare, getUsers);
router.put("/update-user", authMiddleWare, updateUser);
router.post("/signin", signInUser);
router.post("/signup", signUp);

module.exports = router;
