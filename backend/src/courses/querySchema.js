import Joi from "../customJoi";

const NewCourseBodySchema = Joi.object({
  name: Joi.string()
    .min(3)
    .max(150)
    .required(),
  hours: Joi.number().required(),
  tags: Joi.array().items(
    Joi.string()
      .min(3)
      .max(150)
  )
});

const GetCourseParamsSchema = Joi.object({
  id: Joi.objectId().required()
});

const UpdateCourseBodySchema = Joi.object({
  name: Joi.string()
    .min(3)
    .max(150),
  hours: Joi.number(),
  tags: Joi.array().items(
    Joi.string()
      .min(3)
      .max(150)
  )
});

export { NewCourseBodySchema, GetCourseParamsSchema, UpdateCourseBodySchema };
