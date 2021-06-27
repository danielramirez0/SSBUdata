const mongoose = require("mongoose");

const termSchema = new mongoose.Schema({
  term: { type: String },
  definition: { type: String },
});

const Term = mongoose.model("term", termSchema);

exports.Term = Term;
exports.termSchema = termSchema;
