const { User } = require("../models/user");
const userValidation = require("../middleware/userValidation");
const bcrypt = require("bcrypt");
const auth = require("../middleware/auth");
const express = require("express");
const router = express.Router();

// get all users
router.get("/", async (req, res) => {
  try {
    const users = await User.find();
    return res.send(users);
  } catch (ex) {
    return res.status(500).send(`Internal Server Error: ${ex}`);
  }
});

// get a user by ID
router.get("/:id", async (req, res) => {
  try {
    const user = await User.findById(req.params.id);
    return res.send(user);
  } catch (ex) {
    return res.status(500).send(`Internal Server Error: ${ex}`);
  }
});

// register new User
router.post("/", userValidation, async (req, res) => {
  try {
    let user = await User.findOne({ email: req.body.user.email });
    if (user) return res.status(400).send("User already registered");

    const salt = await bcrypt.genSalt(10);

    user = new User({
      userName: req.body.user.userName,
      email: req.body.user.email,
      password: await bcrypt.hash(req.body.user.setupPassword, salt),
      profileID: req.body.user.profileID,
    });

    await user.save();

    const { password, ...userData } = user._doc;

    const token = user.generateAuthToken();

    return res
      .header("x-auth-token", token)
      .header("access-control-expose-headers", "x-auth-token")
      .send(userData);
  } catch (ex) {
    return res.status(500).send(`Internal Server Error: ${ex}`);
  }
});

// update user userName or email
router.put("/:id/", auth, async (req, res) => {
  try {
    const user = findById(req.params.id);
    if (!user) return res.status(400).send(`There is no user with Id ${req.params.id}`);
    user.userName = req.body.user.userName;
    user.email = req.body.user.email;

    await user.save();
    return res.send(user);
  } catch (ex) {
    return res.status(500).send(`Internal Server Error: ${ex}`);
  }
});

// update user password
router.put("/:id/changePassword", auth, async (req, res) => {
  try {
    const user = findById(req.params.id);
    if (!user) return res.status(400).send(`There is no user with Id ${req.params.id}`);
    const salt = await bcrypt.genSalt(10);
    user.password = await bcrypt.hash(req.body.password, salt);
    await user.save();
  } catch (ex) {
    return res.status(500).send(`Internal Server Error: ${ex}`);
  }
});

// delete user
router.delete("/:id", async (req, res) => {
  try {
    const user = await User.findByIdAndRemove(req.params.id);

    if (!user) return res.status(400).send(`The user id "${req.params.id}" does not exist.`);

    return res.send(user);
  } catch (ex) {
    return res.status(500).send(`Internal Server Error: ${ex}`);
  }
});

module.exports = router;
