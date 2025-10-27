import * as Joi from "joi";

export const updateBusinessUnitSchema = Joi.object({
  code: Joi.string().required(),
});
