const Joi = require('@hapi/joi');

const registerValidation = (data) => {
  const schema = Joi.object({
    username: Joi.string().min(6).required(),
    email: Joi.string().min(6).required().email(),
    password: Joi.string().min(6).required(),
  });

  return schema.validate(data, {
    abortEarly: false,
  });
};

const loginValidation = (data) => {
  const schema = Joi.object({
    email: Joi.string().min(6).required().email(),
    password: Joi.string().min(6).required(),
  });

  return schema.validate(data, {
    abortEarly: false,
  });
};

module.exports.registerValidation = registerValidation;
module.exports.loginValidation = loginValidation;
