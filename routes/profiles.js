const { Profile } = require("../models/profile");
const { profileValidation } = require("../middleware/validation");
const auth = require("../middleware/auth");
const express = require("express");
const router = express.Router();

//get a user profile by user ID
router.get("/:refId", auth, async (req, res) => {
  try {
    const profile = await Profile.findOne(req.params.refId);
    if (!profile) return res.status(400).send(`No profile found with refID ${req.params.id}.`);
    return res.send(profile);
  } catch (ex) {
    return res.status(500).send(`Internal Server Error: ${ex}`);
  }
});

// add user profile document
router.post("/:refId", async (req, res) => {
  try {
    const existingProfile = await Profile.findById(req.params.refId);
    if (existingProfile)
      return res
        .status(400)
        .send(`Profile already exists, use PUT method to update with ${existingProfile._id}`);
    const profile = new Profile({
      refID: req.body.profile.refID,
      goals: req.body.profile.goals,
      mainCharacter: req.body.profile.mainCharacter,
      alternateCharacters: req.body.profile.alternateCharacters,
      activeStudyingCharacter: req.body.profile.activeStudyingCharacter,
      generalKnowledgeProgress: req.body.profile.generalKnowledgeProgress,
      characterKnowledgeProgress: req.body.profile.characterKnowledgeProgress,
    });

    await profile.save();
    return res.send(profile);
  } catch (ex) {
    return res.status(500).send(`Internal Server Error: ${ex}`);
  }
});

// Update a user profile
router.put("/:id/:refId", [auth, profileValidation], async (req, res) => {
  try {
    const profile = await Profile.findOne(req.params.refID);
    if (!profile)
      return res.status(400).send(`A profile with refID ${req.params.refId} does not exist`);
    const profile = req.body.profile;

    await profile.save();
    return res.send(profile);
  } catch (ex) {
    return res.status(500).send(`Internal Server Error: ${ex}`);
  }
});

module.exports = router;