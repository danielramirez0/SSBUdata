const { Goal } = require("../models/goal");
const express = require("express");
const router = express.Router();

router.get("/", async (req, res) => {
  try {
    const goals = await Goal.find();
    if (!goals) return res.status(400).send("No goals found");
    return res.send(goals);
  } catch (ex) {
    return res.status(500).send(`Internal Server Error: ${ex}`);
  }
});

router.get("/:id", async (req, res) => {
  try {
    const goals = await Goal.findById(req.params.id);
    if (!goals) return res.status(400).send(`No goals found with ID ${req.params.id}`);
    return res.send(goals);
  } catch (ex) {
    return res.status(500).send(`Internal Server Error: ${ex}`);
  }
});

router.post("/", async (req, res) => {
  try {
    const goal = new Goal(req.body);
    await goal.save();
    return res.send(goal);
  } catch (ex) {
    return res.status(500).send(`Internal Server Error: ${ex}`);
  }
});

module.exports = router;
