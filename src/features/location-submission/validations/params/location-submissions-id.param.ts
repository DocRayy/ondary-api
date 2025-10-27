import * as Joi from "joi";
import { LocationSubmission } from "../../entities/location-submission.entity";

export const locationSubmissionIdExternal = async (value) => {
  const locationSubmission = await LocationSubmission.findOne({
    where: { id: value },
  });
  if (!locationSubmission) {
    throw new Joi.ValidationError(
      "any.invalid-location-submission-id",
      [
        {
          message: "location submission not found",
          path: ["id"],
          type: "any.invalid-location-submission-id",
          context: {
            key: "id",
            label: "id",
            value,
          },
        },
      ],
      value,
    );
  }
  return locationSubmission;
};

export const locationSubmissionIdParamSchema = Joi.number()
  .required()
  .external(locationSubmissionIdExternal);
