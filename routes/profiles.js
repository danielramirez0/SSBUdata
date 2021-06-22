const { Profile } = require("../models/profile");
const mongoose = require("mongoose");
const profileValidation = require("../middleware/profileValidation");
const auth = require("../middleware/auth");
const express = require("express");
const { ref } = require("joi");
const router = express.Router();

router.get("/", async (req, res) => {
  try {
    const profiles = await Profile.find();
    if (!profiles) return res.status(400).send("No profiles found");
    return res.send(profiles);
  } catch (ex) {
    return res.status(500).send(`Internal Server Error: ${ex}`);
  }
});

router.get("/:id", async (req, res) => {
  try {
    const profile = await Profile.findById(req.params.id);
    if (!profile) return res.status(400).send(`No profile found with ID ${req.params.id}`);
    return res.send(profile);
  } catch (ex) {
    return res.status(500).send(`Internal Server Error: ${ex}`);
  }
});

//get a user profile by user ID
router.get("/ref/:refID", auth, async (req, res) => {
  try {
    const id = mongoose.Types.ObjectId(`${req.params.refID}`);
    const profile = await Profile.findOne({ refID: id });
    if (!profile) return res.status(400).send(`No profile found with refID ${req.params.refID}.`);
    return res.send(profile);
  } catch (ex) {
    return res.status(500).send(`Internal Server Error: ${ex}`);
  }
});

// add user profile
router.post("/", profileValidation, async (req, res) => {
  try {
    const profile = new Profile(req.body);
    await profile.save();
    return res.send(profile);
  } catch (ex) {
    return res.status(500).send(`Internal Server Error: ${ex}`);
  }
});

// Update a user profile
router.put("/:refID", [auth, profileValidation], async (req, res) => {
  try {
    let profile = await Profile.findOne(req.params.refID);
    if (!profile)
      return res.status(400).send(`A profile with refID ${req.params.refID} does not exist`);
    profile = req.body;

    await profile.save();
    return res.send(profile);
  } catch (ex) {
    return res.status(500).send(`Internal Server Error: ${ex}`);
  }
});

module.exports = router;
