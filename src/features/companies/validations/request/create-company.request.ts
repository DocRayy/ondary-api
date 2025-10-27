import * as Joi from "joi";

export const createCompanySchema = Joi.object({
  name: Joi.string().required(),
  note: Joi.string().optional().allow(null, ""),
});
