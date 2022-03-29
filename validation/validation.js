const Joi = require('joi');

/* Validation while registeration. */
const registerValidation = (data) => {
    const schema = Joi.object({
        firstName: Joi.string()
                .alphanum()
                .min(4)
                .required(),
        lastName: Joi.string()
                .alphanum()
                .min(4)
                .required(),
        email: Joi.string()
                .min(10)
                .required()
                .email(),
        password: Joi.string()
                .min(8)
                .pattern(new RegExp('^[a-zA-Z0-9]{3,30}$'))
                .required(),
        confirmPassword: Joi.string()
                .min(8)
                .pattern(new RegExp('^[a-zA-Z0-9]{3,30}$'))
                .required()
      });
      return schema.validate(data);
};

const schemaLoginToken = Joi.object({
    token: Joi.string()
        .required(),
});

const schemaLogin = Joi.object({
    email: Joi.string()
        .min(10)
        .required()
        .email(),
    password: Joi.string()
        .min(8)
        .pattern(new RegExp('^[a-zA-Z0-9]{3,30}$'))
        .required(),
});

const loginValidation = (data) => {
    if(data.token) return schemaLoginToken(data)
    return schemaLogin.validate(data);
};

module.exports.registerValidation = registerValidation;
module.exports.loginValidation = loginValidation;