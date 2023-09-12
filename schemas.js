const Joi = require('joi');

module.exports.postSchema = Joi.object({
        post: Joi.object({
        description: Joi.string().required(),
        image: Joi.string().required()
    }).required(),
});