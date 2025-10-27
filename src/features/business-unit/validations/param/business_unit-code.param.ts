import * as Joi from "joi";
import { BusinessUnit } from "src/features/business-unit/entities/business-unit.entity";

export const businessUnitCodeParamSchema = Joi.string()
  .required()
  .external(async (value) => {
    const businessUnit = await BusinessUnit.findOne({
      where: { code: value },
    });
    if (!businessUnit) {
      throw new Joi.ValidationError(
        "any.invalid-business-unit-code",
        [
          {
            message: "Business unit not found",
            path: ["code"],
            type: "any.invalid-business-unit-code",
            context: {
              key: "code",
              label: "code",
              value,
            },
          },
        ],
        value,
      );
    }
    return businessUnit;
  });
