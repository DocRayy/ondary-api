import * as Joi from "joi";
import { BusinessUnit } from "src/features/business-unit/entities/business-unit.entity";

export const businessUnitIdExternal = async (value) => {
  const businessUnit = await BusinessUnit.findOne({
    where: { id: value },
  });
  if (!businessUnit) {
    throw new Joi.ValidationError(
      "any.invalid-business-unit-id",
      [
        {
          message: "Business unit not found",
          path: ["id"],
          type: "any.invalid-business-unit-id",
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
  return businessUnit;
};

export const businessUnitIdParamSchema = Joi.number()
  .required()
  .external(businessUnitIdExternal);
