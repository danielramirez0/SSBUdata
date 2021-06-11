const mongoose = require("mongoose");
const Joi = require("joi");

const characterSchema = new mongoose.Schema({
  movement: { type: Array, required: true },
  attacks: { type: Array, required: true },
  specials: { type: Array, required: true },
  attributes: { type: Array, required: true },
});

const Profile = mongoose.model("character", characterSchema);

function validateProfile(character) {
  const schema = Joi.object({
    movement: Joi.array().required(),
    attacks: Joi.array().required(),
    specials: Joi.array().required(),
    attributes: Joi.array().required(),
  });
  return schema.validate(friend);
}

exports.Profile = Profile;
exports.validateProfile = validateProfile;
exports.characterSchema = characterSchema;
