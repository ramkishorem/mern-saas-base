import Joi from "@hapi/joi";
import joiObjectId from "joi-objectid";

Joi.objectId = joiObjectId(Joi);

export default Joi;
