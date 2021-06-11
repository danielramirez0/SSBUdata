const mongoose = require("mongoose");
const Joi = require("joi");

const profileSchema = new mongoose.Schema({
  refID: { type: mongoose.Types.ObjectId, required: true },
  goals: { type: Array, required: true },
  mainCharacter: { type: String, required: true },
  alternateCharacters: { type: Array, required: true },
  activeStudyingCharacter: { type: String, required: true },
  generalKnowledgeProgress: { type: Array, required: true },
  generalTechniqueProgress: { type: Array, required: true },
  characterKnowledgeProgress: { type: Array, required: true },
});

const Profile = mongoose.model("profile", profileSchema);

function validateProfile(profile) {
  const schema = Joi.object({
    refID: Joi.required(),
    goals: Joi.required(),
    mainCharacter: Joi.string().required(),
    alternateCharacters: Joi.array().required(),
    activeStudyingCharacter: Joi.string().required(),
    generalKnowledgeProgress: Joi.array().required(),
    generalTechniqueProgress: Joi.array().required(),
    characterKnowledgeProgress: Joi.array().required(),
  });
  return schema.validate(profile);
}

exports.Profile = Profile;
exports.validateProfile = validateProfile;
exports.profileSchema = profileSchema;
