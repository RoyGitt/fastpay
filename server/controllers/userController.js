const { JWT_SECRET } = require("../config/dotenv");

const {
  createUserSchema,
  loginSchema,
  updateUserSchema,
} = require("../validations/userSchema");
const { User } = require("../models/userModel");
const bcrypt = require("bcrypt");
var jwt = require("jsonwebtoken");
const { Account } = require("../models/accountModel");

const getUsers = async (req, res) => {
  try {
    const user = req.user;
    console.log(user);
    const users = await User.find({ _id: { $ne: user.userId } });

    res.status(200).json({ users });
  } catch (error) {
    console.log(error);
    res.status(500).json("Internal server error");
  }
};

const signInUser = async (req, res) => {
  try {
    const validation = loginSchema.safeParse(req.body);
    if (!validation.success) {
      return res.status(400).json({
        error: "Validation Error",
        details: validation.error.errors,
      });
    }

    const { email, password } = validation.data;

    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({ error: "User does not exists" });
    }
    const passwordMatch = await bcrypt.compare(password, user.password);

    if (!passwordMatch) {
      return res.status(401).json({ error: "Invalid Credentials" });
    }

    const authToken = jwt.sign({ userId: user._id }, JWT_SECRET, {
      expiresIn: "14d",
    });

    return res
      .status(200)
      .json({ message: "User logged in successfully", token: authToken });
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: "Internal server error" });
  }
};

const signUp = async (req, res) => {
  try {
    const validation = createUserSchema.safeParse(req.body);
    if (!validation.success) {
      return res.status(400).json({
        error: "Validation Error",
        details: validation.error.errors,
      });
    }

    const { email, password, firstName, lastName } = validation.data;

    const userExists = await User.findOne({ email });
    if (userExists) {
      return res
        .status(400)
        .json({ error: "User with this email already exists" });
    }
    const hashedPassword = await bcrypt.hash(password, 10);

    const newUser = await User.create({
      email,
      password: hashedPassword,
      firstName,
      lastName,
    });

    const newUserId = newUser._id;

    await Account.create({
      userId: newUserId,
      balance: 10000,
    });

    const authToken = jwt.sign({ userId: newUserId }, JWT_SECRET, {
      expiresIn: "14d",
    });

    return res
      .status(201)
      .json({ message: "User created successfully", token: authToken });
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: "Internal server error" });
  }
};

const updateUser = async (req, res) => {
  try {
    const validation = updateUserSchema.safeParse(req.body);
    if (!validation.success) {
      return res.status(400).json({
        error: "Validation Error",
        details: validation.error.errors,
      });
    }

    const { oldPassword, newPassword, newEmail } = validation.data;

    const user = await User.findOne({ _id: req.user.userId });
    if (!user) {
      return res.status(400).json({ error: "User does not exists" });
    }

    const passwordMatch = await bcrypt.compare(oldPassword, user.password);
    if (!passwordMatch) {
      return res.status(401).json({ error: "Invalid Credentials" });
    }

    let updatedData = {};
    if (newPassword) {
      newHashedPassword = await bcrypt.hash(newPassword, 10);
      updatedData.password = newHashedPassword;
    }

    if (newEmail) {
      const emailExists = await User.findOne({ email: newEmail });
      if (emailExists) {
        return res.status(409).json({ error: "Email already in use" });
      }
      updatedData.email = newEmail;
    }

    await User.findByIdAndUpdate(
      req.user.userId,
      { $set: updatedData },
      { new: true }
    );

    return res
      .status(200)
      .json({ message: "User is successfully updated", token: authToken });
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: "Internal server error" });
  }
};

module.exports = { getUsers, signInUser, signUp, updateUser };
