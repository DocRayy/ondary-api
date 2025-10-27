import * as Joi from "joi";
import { LocationSubmissionImage } from "../../entities/location-submission-image.entity";

export const locationSubmissionImageIdExternal = async (value) => {
  const locationSubmissionImage = await LocationSubmissionImage.findOne({
    where: { id: value.id, location_submission_id: value.submissionId },
  });
  if (!locationSubmissionImage) {
    throw new Joi.ValidationError(
      "any.invalid-location-submission-image-id",
      [
        {
          message: "location submission image not found",
          path: ["id"],
          type: "any.invalid-location-submission-image-id",
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
  return locationSubmissionImage;
};

export const locationSubmissionImageIdParamSchema = Joi.object()
  .required()
  .external(locationSubmissionImageIdExternal);
