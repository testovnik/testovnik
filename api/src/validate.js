const Joi = require('@hapi/joi');

const registerValidation = (data) => {
    const schema = Joi.object({
        username: Joi.string().min(2).required(),
        email: Joi.string().min(6).required().email(),
        password: Joi.string().min(6).required(),
        firstName: Joi.string().min(2).max(100),
        lastName: Joi.string().min(2).max(100),
    });

    return schema.validate(data, {
        abortEarly: false,
    });
};

const loginValidation = (data) => {
    const schema = Joi.object({
        // TODO: decide how the user will log in, whether we will use username / login
        // or email.
        // username: Joi.string().min(2).required(),
        email: Joi.string().min(6).required().email(),
        password: Joi.string().min(6).required(),
    });

    return schema.validate(data, {
        abortEarly: false,
    });
};

module.exports.registerValidation = registerValidation;
module.exports.loginValidation = loginValidation;
