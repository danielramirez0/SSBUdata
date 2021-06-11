const { User } = require("../models/user");
const { Profile } = require("../models/profile");
const { userValidation, profileValidation } = require("../middleware/validation");
const bcrypt = require("bcrypt");
const auth = require("../middleware/auth");
const express = require("express");
const router = express.Router();

//get all users
router.get("/", async (req, res) => {
  try {
    const users = await User.find();
    return res.send(users);
  } catch (ex) {
    return res.status(500).send(`Internal Server Error: ${ex}`);
  }
});

//get a user by ID
router.get("/:id", async (req, res) => {
  try {
    const user = await User.findById(req.params.id);
    return res.send(user);
  } catch (ex) {
    return res.status(500).send(`Internal Server Error: ${ex}`);
  }
});

//register new User
router.post("/", [userValidation, profileValidation], async (req, res) => {
  try {
    let user = await User.findOne({ email: req.body.user.email });
    if (user) return res.status(400).send("User already registered");

    const salt = await bcrypt.genSalt(10);

    user = new User({
      userName: req.body.user.userName,
      email: req.body.user.email,
      password: await bcrypt.hash(req.body.user.password, salt),
      profile: req.body.profile,
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

//put -- update a user's credentials
router.put("/:userId", async (req, res) => {
  try {
    const user = await User.findById(req.params.userId);
    if (!user) return res.status(400).send(`The user id "${req.params.userId}" does not exist.`);
    console.log(user);

    if (req.body.firstName != null) {
      user.firstName = req.body.firstName;
    }
    if (req.body.lastName != null) {
      user.lastName = req.body.lastName;
    }
    if (req.body.favoriteArtist != null) {
      user.favoriteArtist = req.body.favoriteArtist;
    }
    if (req.body.favoriteAlbum != null) {
      user.favoriteAlbum = req.body.favoriteAlbum;
    }
    if (req.body.favoriteSong != null) {
      user.favoriteSong = req.body.favoriteSong;
    }

    await user.save();
    return res.send(user);
  } catch (ex) {
    return res.status(500).send(`Internal Server Error: ${ex}`);
  }
});

// send a friend request
router.post("/:userId/friends/:friendId/", auth, async (req, res) => {
  try {
    const sender = await User.findById(req.params.userId);
    if (!sender) return res.status(400).send(`The user id "${req.params.userId}" does not exist.`);

    const receiver = await User.findById(req.params.friendId);
    if (!receiver)
      return res.status(400).send(`The friend user id "${req.params.friendId}" does not exist.`);

    let { error } = validateFriend({
      user_id: receiver._id,
      name: `${receiver.firstName} ${receiver.lastName}`,
    });

    if (error) return res.status(400).send(error);

    const newFriend = new Friend({
      user_id: receiver._id,
      name: `${receiver.firstName} ${receiver.lastName}`,
    });

    sender.friends.push(newFriend);

    await sender.save();

    let { err } = validateFriendRequest({
      user_id: sender._id,
      name: `${sender.firstName} ${sender.lastName}`,
    });

    if (err) return res.status(400).send(err);

    const inboundFriendRequest = new FriendRequest({
      user_id: sender._id,
      name: `${sender.firstName} ${sender.lastName}`,
    });

    receiver.friendRequests.push(inboundFriendRequest);

    await receiver.save();

    return res.send([sender, receiver]);
  } catch (ex) {
    return res.status(500).send(`Internal Server Error: ${ex}`);
  }
});

//post friend
router.post("/:userId/:friendId/addFriend", auth, async (req, res) => {
  try {
    const user = await User.findById(req.params.userId);
    if (!user) return res.status(400).send(`The user id "${req.params.userId}" does not exist.`);

    const accepted = await User.findById(req.params.friendId);
    if (!accepted)
      return res.status(400).send(`The user id "${req.params.friendId} does not exist.`);

    const newFriend = new Friend({
      user_id: accepted._id,
      name: `${accepted.firstName} ${accepted.lastName}`,
      pending: false,
    });

    user.friends.push(newFriend);
    await user.save();
    return res.send(user);
  } catch (ex) {
    return res.status(500).send(`Internal Server Error: ${ex}`);
  }
});

//delete friend
router.put("/:userId/:friendId/deleteFriend", auth, async (req, res) => {
  try {
    const user = await User.findById(req.params.userId);
    if (!user) return res.status(400).send(`The user id "${req.params.userId}" does not exist.`);

    const filteredFriend = user.friends.filter((friend) => friend._id != req.params.friendId);
    user.friends = filteredFriend;

    await user.save();
    return res.send(user);
  } catch (ex) {
    return res.status(500).send(`Internal Server Error: ${ex}`);
  }
});

//delete friend
router.put("/:userId/:friendId/deletePending", auth, async (req, res) => {
  try {
    const user = await User.findById(req.params.userId);
    if (!user) return res.status(400).send(`The user id "${req.params.userId}" does not exist.`);

    const falseFriend = user.friends.filter((friend) => friend.pending === false);
    console.log(falseFriend);

    const trueFriend = user.friends.filter((friend) => friend.pending === true);
    console.log(trueFriend);

    const filteredFriend = trueFriend.filter((friend) => friend.user_id != req.params.friendId);
    console.log(filteredFriend);

    Array.prototype.push.apply(falseFriend, filteredFriend);
    console.log(falseFriend);
    user.friends = falseFriend;

    await user.save();
    return res.send(user);
  } catch (ex) {
    return res.status(500).send(`Internal Server Error: ${ex}`);
  }
});

//delete friend from friend requests
router.put("/:userId/:friendId/deleteRequest", auth, async (req, res) => {
  try {
    const user = await User.findById(req.params.userId);
    if (!user) return res.status(400).send(`The user id "${req.params.userId}" does not exist.`);

    const filteredFriend = user.friendRequests.filter(
      (friend) => friend._id != req.params.friendId
    );
    user.friendRequests = filteredFriend;

    await user.save();
    return res.send(user);
  } catch (ex) {
    return res.status(500).send(`Internal Server Error: ${ex}`);
  }
});

//delete user
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
