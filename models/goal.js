const mongoose = require("mongoose");

const goalSchema = new mongoose.Schema({
  refID: { type: mongoose.Schema.Types.ObjectId },
  text: { type: String },
  completed: { type: Boolean, default: false },
  color: { type: String, default: "" },
});

const Goal = mongoose.model("goal", goalSchema);

exports.Goal = Goal;
exports.goalSchema = goalSchema;
