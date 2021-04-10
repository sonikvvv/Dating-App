const Joi = require("joi");

module.exports.registerSchema = Joi.object({
    user: Joi.object({
        userName: Joi.string().required(),
        email: Joi.string().email().required(),
        years: Joi.number().required(),
        password: Joi.string().required(),
    }).required(),
});
