import Joi from "../startup/customJoi";

const NewUserBodySchema = Joi.object({
  firstName: Joi.string()
    .max(50)
    .required(),
  lastName: Joi.string()
    .max(50)
    .required(),
  email: Joi.string()
    .email()
    .required(),
  password: Joi.string()
    .required()
    .ruleset.regex(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[a-zA-Z\d]{8,}$/)
    .rule({
      message:
        "Password requirements: Minimum eight characters, at least" +
        " one uppercase letter,one lowercase letter and one number"
    }),
  permissions: Joi.array().items(Joi.string())
});

const GetUserParamsSchema = Joi.object({
  id: Joi.objectId().required()
});

const UpdateUserBodySchema = Joi.object({
  firstName: Joi.string().max(50),
  lastName: Joi.string().max(50),
  permissions: Joi.array().items(Joi.string())
});

export { NewUserBodySchema, GetUserParamsSchema, UpdateUserBodySchema };
