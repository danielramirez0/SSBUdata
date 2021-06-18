const { Character } = require("../models/characer");
const express = require("express");
const router = express.Router();

// get all characters
router.get("/", async (req, res) => {
  try {
    const characters = await Character.find();
    return res.send(characters);
  } catch (ex) {
    return res.status(500).send(`Internal Server Error: ${ex}`);
  }
});

module.exports = router;
