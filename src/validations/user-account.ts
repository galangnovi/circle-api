import Joi from "joi";

export const registerScema = Joi.object({
    email: Joi.string().email().required(),
    password: Joi.string().min(6).required(),
    role: Joi.string().valid("user","seller", null)
})

export const loginScema = Joi.object({
    email: Joi.string().email().required(),
    password: Joi.string().required()
})