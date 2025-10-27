import * as Joi from "joi";

export const createBranchSchema = Joi.object({
  address: Joi.string().required(),
  note: Joi.string().optional().allow(null, ""),
});
