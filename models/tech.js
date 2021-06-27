const mongoose = require("mongoose");

const techSchema = new mongoose.Schema({
  tech: { type: String },
  input: { type: Array, default: [] },
  video: { type: Boolean, default: false },
  videoLink: { type: String, default: "" },
});

const Tech = mongoose.model("techs", techSchema);

exports.Tech = Tech;
exports.techSchema = techSchema;
