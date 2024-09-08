const Joi = require('joi');

const { EmployeeStatus } = require("../common/constant")


const createEmployeeSchema = Joi.object({
    fullName: Joi.string()
        .min(3)
        .max(50)
        .pattern(/^[a-zA-Z\s-.'\u00C0-\u024F\u1E00-\u1EFF]+$/, 'valid characters')
        .required()
        .messages({
            'string.base': "'{#key}' should be a string",
            'string.empty': "'{#key}' cannot be empty",
            'string.min': "'{#key}' should have a minimum length of {#limit}",
            'string.max': "'{#key}' should have a maximum length of {#limit}",
            'string.pattern.name': "'{#key}' can only contain letters and spaces",
            'any.required': "'{#key}' is required",
        }),
    username: Joi.string()
        .alphanum()
        .min(3)
        .max(30)
        .required()
        .messages({
            'string.base': "'{#key}' should be a string",
            'string.empty': "'{#key}' cannot be empty",
            'string.min': "'{#key}' should have a minimum length of {#limit}",
            'string.max': "'{#key}' should have a maximum length of {#limit}",
            'string.alphanum': "'{#key}' can only contain alphanumeric characters",
            'any.required': "'{#key}' is required",
        }),
    email: Joi.string()
        .email({ minDomainSegments: 2 })
        .required()
        .messages({
            'string.base': "'{#key}' should be a string",
            'string.empty': "'{#key}' cannot be empty",
            'string.email': "'{#key}' must be a valid email",
            'any.required': "'{#key}' is required",
        }),
    phoneNumber: Joi.string()
        .pattern(/^[0-9]{10,15}$/, 'numbers')
        .required()
        .messages({
            'string.base': "'{#key}' should be a string",
            'string.empty': "'{#key}' cannot be empty",
            'string.pattern.name': "'{#key}' must be a valid phone number containing only digits and must be 10 to 15 digits long",
            'any.required': "'{#key}' is required",
        }),
    password: Joi.string()
        .min(8)
        .required()
        .messages({
            'string.base': "'{#key}' should be a string",
            'string.empty': "'{#key}' cannot be empty",
            'string.min': "'{#key}' should have a minimum length of {#limit}",
            'any.required': "'{#key}' is required",
        }),
    status: Joi.string()
        .valid(...Object.values(EmployeeStatus))
        .optional()
        .default(EmployeeStatus.ACTIVE)
        .messages({
            'string.base': "'{#key}' should be a string",
            'any.only': "'{#key}' must be one of {#valids}",
        }),
});

const updateEmployeeSchema = Joi.object({
    fullName: Joi.string()
        .min(3)
        .max(50)
        .pattern(/^[a-zA-Z\s-.'\u00C0-\u024F\u1E00-\u1EFF]+$/, 'valid characters')
        .optional()
        .messages({
            'string.base': "'{#key}' should be a string",
            'string.empty': "'{#key}' cannot be empty",
            'string.min': "'{#key}' should have a minimum length of {#limit}",
            'string.max': "'{#key}' should have a maximum length of {#limit}",
            'string.pattern.name': "'{#key}' can only contain letters and spaces",
        }),
    username: Joi.string()
        .alphanum()
        .min(3)
        .max(30)
        .optional()
        .messages({
            'string.base': "'{#key}' should be a string",
            'string.empty': "'{#key}' cannot be empty",
            'string.min': "'{#key}' should have a minimum length of {#limit}",
            'string.max': "'{#key}' should have a maximum length of {#limit}",
            'string.alphanum': "'{#key}' can only contain alphanumeric characters",
        }),
    email: Joi.string()
        .email({ minDomainSegments: 2 })
        .optional()
        .messages({
            'string.base': "'{#key}' should be a string",
            'string.empty': "'{#key}' cannot be empty",
            'string.email': "'{#key}' must be a valid email",
        }),
    phoneNumber: Joi.string()
        .pattern(/^[0-9]{10,15}$/, 'numbers')
        .optional()
        .messages({
            'string.base': "'{#key}' should be a string",
            'string.empty': "'{#key}' cannot be empty",
            'string.pattern.name': "'{#key}' must be a valid phone number containing only digits and must be 10 to 15 digits long",
        }),
    password: Joi.string()
        .min(8)
        .optional()
        .messages({
            'string.base': "'{#key}' should be a string",
            'string.empty': "'{#key}' cannot be empty",
            'string.min': "'{#key}' should have a minimum length of {#limit}",
        }),
    status: Joi.string()
        .valid(...Object.values(EmployeeStatus))
        .optional()
        .messages({
            'string.base': "'{#key}' should be a string",
            'any.only': "'{#key}' must be one of {#valids}",
        }),
});




module.exports = { createEmployeeSchema, updateEmployeeSchema };