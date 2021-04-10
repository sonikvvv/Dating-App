const Joi = require("joi");

module.exports.rulesSchema = Joi.object({
    rule: Joi.object({
        title: Joi.string().required(),
        description: Joi.string().required(),
    }).required(),
});
