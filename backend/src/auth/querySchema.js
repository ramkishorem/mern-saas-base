import Joi from "../customJoi";

const LoginBodySchema = Joi.object({
  email: Joi.string()
    .email()
    .required(),
  password: Joi.string().required()
});

export { LoginBodySchema };
