const Joi = require("joi");

module.exports.badgeSchema = Joi.object({
    badge: Joi.object({
        title: Joi.string().required(),
        description: Joi.string().required(),
    }).required(),
});
