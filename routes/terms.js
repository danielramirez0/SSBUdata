const mongoose = require("mongoose");
const { Term } = require("../models/term");
const express = require("express");
const router = express.Router();

router.get("/", async (req, res) => {
  try {
    const terms = await Term.find();
    if (!terms) return res.status(400).send("No terms found");
    return res.send(terms);
  } catch (ex) {
    return res.status(500).send(`Internal Server Error: ${ex}`);
  }
});

router.get("/:id", async (req, res) => {
  try {
    const terms = await Term.findById(req.params.id);
    if (!terms) return res.status(400).send(`No terms found with ID ${req.params.id}`);
    return res.send(terms);
  } catch (ex) {
    return res.status(500).send(`Internal Server Error: ${ex}`);
  }
});

router.post("/", async (req, res) => {
  try {
    const term = new Term(req.body);
    await term.save();
    return res.send(term);
  } catch (ex) {
    return res.status(500).send(`Internal Server Error: ${ex}`);
  }
});

module.exports = router;
