const { Tech } = require("../models/tech");
const express = require("express");
const router = express.Router();

router.get("/", async (req, res) => {
  try {
    const techs = await Tech.find();
    if (!techs) return res.status(400).send("No techs found");
    return res.send(techs);
  } catch (ex) {
    return res.status(500).send(`Internal Server Error: ${ex}`);
  }
});

router.get("/:id", async (req, res) => {
  try {
    const techs = await Tech.findById(req.params.id);
    if (!techs) return res.status(400).send(`No techs found with ID ${req.params.id}`);
    return res.send(techs);
  } catch (ex) {
    return res.status(500).send(`Internal Server Error: ${ex}`);
  }
});

router.post("/", async (req, res) => {
  try {
    const tech = new Tech(req.body);
    await tech.save();
    return res.send(tech);
  } catch (ex) {
    return res.status(500).send(`Internal Server Error: ${ex}`);
  }
});

module.exports = router;
