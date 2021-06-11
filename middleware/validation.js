const { validateUser } = require("../models/user");
const { validateProfile } = require("../models/profile");

function userValidation(req, res, next) {
  const { error } = validateUser(req.body.user);
  if (error) return res.status(400).send(error.details[0].message);
  try {
    return next();
  } catch (ex) {
    return res.status(400).send("Invalid token.");
  }
}

function profileValidation(req, res, next) {
  const { error } = validateProfile(req.body.profile);
  if (error) return res.status(400).send(error.details[0].message);
  try {
    return next();
  } catch (ex) {
    return res.status(400).send("Invalid token.");
  }
}

module.exports = userValidation;
module.exports = profileValidation;
