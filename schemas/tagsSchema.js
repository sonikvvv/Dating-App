const Joi = require("joi");

module.exports.tagsSchema = Joi.object({
    tag: Joi.object({
        title: Joi.string().required()
    }).required(),
});
