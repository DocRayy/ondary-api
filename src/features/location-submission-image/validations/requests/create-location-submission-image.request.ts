import * as Joi from "joi";
import { updateLocationSubmissionImageSchema } from "./update-location-submission-image.request";

export const createLocationSubmissionImageSchema = Joi.object({
  submission_images: Joi.array()
    .items(Joi.object().concat(updateLocationSubmissionImageSchema))
    .optional()
    .default([]),
});
