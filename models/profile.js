const mongoose = require("mongoose");
const Joi = require("joi");

const profileSchema = new mongoose.Schema({
  refID: { type: mongoose.Types.ObjectId, default: "60a00b00000000000c00000d" },
  goals: { type: Array, required: true },
  mainCharacter: { type: String },
  alternateCharacters: { type: Array, required: true },
  activeStudyingCharacter: { type: String },
  generalKnowledgeProgress: { type: Array, required: true },
  generalTechniqueProgress: { type: Array, required: true },
  characterKnowledgeProgress: { type: Array, required: true },
});

const Profile = mongoose.model("profile", profileSchema);

function validateProfile(profile) {
  const schema = Joi.object({
    goals: Joi.required(),
    mainCharacter: Joi.string(),
    alternateCharacters: Joi.array().required(),
    activeStudyingCharacter: Joi.string(),
    generalKnowledgeProgress: Joi.array().required(),
    generalTechniqueProgress: Joi.array().required(),
    characterKnowledgeProgress: Joi.array().required(),
  });
  return schema.validate(profile);
}

exports.Profile = Profile;
exports.validateProfile = validateProfile;
exports.profileSchema = profileSchema;
