import Joi from "../startup/customJoi";

const LoginBodySchema = Joi.object({
  email: Joi.string()
    .email()
    .required(),
  password: Joi.string().required()
});

export { LoginBodySchema };
