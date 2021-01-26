////////VALIDATION
const Joi = require("@hapi/joi");

const registerValidation = (data)=>{

    const schema = Joi.object({
        fname: Joi.string()
        .min(3)
        .required(),
        lname: Joi.string()
        .min(3)
        .required(),
        email: Joi.string()
        .email()
        .min(6)
        .required(),
        password: Joi.string()
        .min(6)
        .required()
    });
    
    return schema.validate(data);
};

const loginValidation = (data)=>{

    const schema = Joi.object({
        
        email: Joi.string()
        .email()
        .min(6)
        .required(),
        password: Joi.string()
        .min(6)
        .required()
    });
    
    return schema.validate(data);
};

const passwordValidation = (data)=>{

    const schema = Joi.object({
        oldPassword: Joi.string()
        .min(6)
        .required(),
        newPassword: Joi.string()
        .min(6)
        .required()
    });
    
    return schema.validate(data);
};

module.exports.registerValidation = registerValidation;
module.exports.loginValidation = loginValidation;
module.exports.passwordValidation = passwordValidation;

