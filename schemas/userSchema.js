const Joi = require("joi");

module.exports.registerSchema = Joi.object({
    user: Joi.object({
        userName: Joi.string().required(),
        email: Joi.string().email().required(),
        years: Joi.number().greater(18).required(),
        password: Joi.string().required(),
        //  images: Joi.string(),
        sex: Joi.string(),
        work: Joi.string(),
        orientation: Joi.string(),
        description: Joi.string(),
        position: Joi.string(),
        height: Joi.string(),
        weight: Joi.string(),
        bodyType: Joi.string(),
        relationshipStatus: Joi.string(),
        nsfw: Joi.string(),
    }).required(),
});
