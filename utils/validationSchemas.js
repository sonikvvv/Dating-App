const Joi = require("joi");

module.exports.badgeSchema = Joi.object({
    badge: Joi.object({
        title: Joi.string().required(),
        description: Joi.string().required(),
    }).required(),
});

module.exports.registerSchema = Joi.object({
    user: Joi.object({
        username: Joi.string().required(),
        email: Joi.string().email().required(),
        years: Joi.number().required(),
        password: Joi.string().required(),
    }).required(),
});

module.exports.ruleSchema = Joi.object({
    rule: Joi.object({
        title: Joi.string().required(),
        description: Joi.string().required(),
    }).required(),
});

module.exports.tagSchema = Joi.object({
    tag: Joi.object({
        title: Joi.string().required(),
    }).required(),
});

module.exports.userSchema = Joi.object({
    user: Joi.object({
        username: Joi.string().required(),
        email: Joi.string().email().required(),
        years: Joi.number().greater(18).required(),
        sex: Joi.string().allow(""),
        work: Joi.string().allow(""),
        orientation: Joi.string().allow(""),
        description: Joi.string().allow(""),
        position: Joi.string().allow(""),
        height: Joi.string().allow(""),
        weight: Joi.string().allow(""),
        bodyType: Joi.string().allow(""),
        relationshipStatus: Joi.string().allow(""),
        nsfw: Joi.string().allow(""),
    }).required(),
});
