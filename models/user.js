const mongoose = require("mongoose");
const Joi = require("joi");

const config = require("config");
const jwt = require("jsonwebtoken");

const userSchema = new mongoose.Schema({
  userName: { type: String, require: true, minlength: 3, maxlength: 255 },
  email: { type: String, require: true, minlength: 7, maxlength: 255 },
  password: { type: String, require: true, minlength: 5, maxlength: 1024 },
  profile: [Profile.schema],
});

userSchema.methods.generateAuthToken = function () {
  return jwt.sign(
    {
      _id: this._id,
      userName: this.userName,
    },
    config.get("jwtSecret")
  );
};

const User = mongoose.model("User", userSchema);

function validateUser(user) {
  const schema = Joi.object({
    userName: Joi.string().min(3).max(255).required(),
    email: Joi.string().min(7).max(255).required().email(),
    password: Joi.string().min(5).max(1024).required(),
  });
  return schema.validate(user);
}

exports.User = User;
exports.validateUser = validateUser;
exports.userSchema = userSchema;
