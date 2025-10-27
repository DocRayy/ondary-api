import * as Joi from "joi";
import { createLocationSubmissionImageSchema } from "src/features/location-submission-image/validations/requests/create-location-submission-image.request";

export const createLocationSubmissionSchema = Joi.object({
  gps_lat: Joi.string().required(),
  gps_lng: Joi.string().required(),
  address: Joi.string().optional().allow(null, ""),
  note: Joi.string().optional().allow(null, "").default(""),
  status: Joi.number().required(),
}).concat(createLocationSubmissionImageSchema);
