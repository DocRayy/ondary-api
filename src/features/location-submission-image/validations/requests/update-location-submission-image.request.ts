import * as Joi from "joi";

export const updateLocationSubmissionImageSchema = Joi.object({
  note: Joi.string().required(),
});
