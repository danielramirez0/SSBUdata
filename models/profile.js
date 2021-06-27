const mongoose = require("mongoose");
const Joi = require("joi");
const { Progress } = require("./progress");
const { Goal } = require("./goal");

const profileSchema = new mongoose.Schema({
  refID: { type: mongoose.Types.ObjectId, default: "60a00b00000000000c00000d" },
  goals: [Goal.schema],
  mainCharacter: { type: String, default: "none" },
  alternateCharacters: { type: Array, default: [] },
  activeStudyingCharacter: { type: String, default: "none" },
  generalKnowledgeProgress: [],
  generalTechniqueProgress: [],
  // generalTechniqueProgress: [Progress.schema],
  characterKnowledgeProgress: [Progress.schema],
});

const Profile = mongoose.model("profile", profileSchema);

function validateProfile(profile) {
  const schema = Joi.object({
    refID: Joi.allow(),
    goals: Joi.array(),
    mainCharacter: Joi.string(),
    alternateCharacters: Joi.array(),
    activeStudyingCharacter: Joi.string(),
    generalKnowledgeProgress: Joi.array(),
    generalTechniqueProgress: Joi.array(),
    characterKnowledgeProgress: Joi.array(),
  });
  return schema.validate(profile);
}

exports.Profile = Profile;
exports.validateProfile = validateProfile;
exports.profileSchema = profileSchema;
