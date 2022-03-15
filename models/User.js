const mongoose = require("mongoose");
const Joi = require("joi");

const userSchema = new mongoose.Schema({
  email: {
    type: String,
    required: [true, "Email is reuiqred"],
    unique: true,
    lowercase: true,
  },
  name: {
    type: String,
    required: [true, "Name is required"],
  },
});

const User = mongoose.model("User", userSchema);

const validateUser = (user) => {
  const schema = Joi.object({
    email: Joi.string().email().required(),
    name: Joi.string().required(),
  });

  return schema.validate(user);
};

module.exports = {
  User,
  validateUser,
};
