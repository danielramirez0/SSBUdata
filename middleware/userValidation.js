const { validateUser } = require("../models/user");

function userValidation(req, res, next) {
  const { error } = validateUser(req.body.user);
  if (error) return res.status(400).send(error.details[0].message);
  try {
    return next();
  } catch (ex) {
    return res.status(400).send("Invalid token.");
  }
}

module.exports = userValidation;
