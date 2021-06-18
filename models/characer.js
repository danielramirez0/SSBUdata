const mongoose = require("mongoose");
const Joi = require("joi");

const characterSchema = new mongoose.Schema({
  movement: { type: Object, required: true },
  attacks: { type: Object, required: true },
  specials: { type: Object, required: true },
  grabs: { type: Object, required: true },
  attributes: { type: Object, required: true },
});

const Character = mongoose.model("character", characterSchema);

function validateCharacter(character) {
  const schema = Joi.object({
    movement: Joi.array().required(),
    attacks: Joi.array().required(),
    specials: Joi.array().required(),
    attributes: Joi.array().required(),
  });
  return schema.validate(friend);
}

exports.Character = Character;
exports.validateCharacter = validateCharacter;
exports.characterSchema = characterSchema;
