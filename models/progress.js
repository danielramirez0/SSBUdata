const mongoose = require("mongoose");

const progressSchema = new mongoose.Schema({
  refID: { type: mongoose.Types.ObjectId },
  // complete: { type: Boolean, default: false },
});

const Progress = mongoose.model("progress", progressSchema);

exports.Progress = Progress;
exports.progressSchema = progressSchema;
