const Joi = require('joi');

/* Validation while registeration. */
const registerValidation = (data) => {
    const schema = Joi.object({
        firstName: Joi.string()
                .alphanum()
                .min(4)
                .required()
                .label("First Name"),
        lastName: Joi.string()
                .alphanum()
                .min(4)
                .required()
                .label("Last Name"),
        email: Joi.string()
                .min(10)
                .required()
                .email()
                .label("E-mail"),
        password: Joi.string()
                .regex(/^[a-zA-Z0-9]{8,30}$/)
                .min(8)
                .required()
                .label("Password"),
        confirmPassword: Joi.string()
                .regex(/^[a-zA-Z0-9]{8,30}$/)
                .min(8)
                .required()
                .label("Confirm Password")
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
        .email()
        .label("E-mail"),
    password: Joi.string()
        .min(8)
        .pattern(new RegExp('^[a-zA-Z0-9]{3,30}$'))
        .required()
        .label("Password"),
});

const loginValidation = (data) => {
    if(data.token) return schemaLoginToken(data)
    return schemaLogin.validate(data);
};


module.exports.registerValidation = registerValidation;
module.exports.loginValidation = loginValidation;