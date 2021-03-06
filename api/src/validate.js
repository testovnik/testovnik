const Joi = require('@hapi/joi');

const registerValidation = data => {
    const schema = Joi.object({
        username: Joi.string().min(2).required(),
        email: Joi.string().min(6).required().email(),
        password: Joi.string().min(6).required(),
    });

    return schema.validate(data, {
        abortEarly: false,
    });
};

const loginValidation = data => {
    const schema = Joi.object({
        email: Joi.string().min(6).required().email(),
        password: Joi.string().min(6).required(),
    });

    return schema.validate(data, {
        abortEarly: false,
    });
};

const testCreationValidation = data => {
    const schema = Joi.object({
        name: Joi.string().max(500).required(),
        description: Joi.string(),
        tags: Joi.array().items(Joi.string().max(64)),
        category: Joi.string().required(),
    });

    return schema.validate(data, {
        abortEarly: false,
    });
};

const questionValidation = data => {
    const schema = Joi.object({
        text: Joi.string().required(),
        answers: Joi.array()
            .items(
                Joi.object({
                    id: Joi.number(),
                    text: Joi.string().required(),
                })
            )
            .required(),
        correctAnswers: Joi.array().items(Joi.number()).required(),
    });

    return schema.validate(data, {
        abortEarly: false,
    });
};

module.exports.registerValidation = registerValidation;
module.exports.loginValidation = loginValidation;
module.exports.testCreationValidation = testCreationValidation;
module.exports.questionValidation = questionValidation;
