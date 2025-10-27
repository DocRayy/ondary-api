import * as Joi from "joi";
import { Company } from "../../entities/company.entity";

export const companyIdExternal = async (value) => {
  const company = await Company.findOne({
    where: { id: value },
  });

  if (!company) {
    throw new Joi.ValidationError(
      "any.invalid-company-id",
      [
        {
          message: "Company not found",
          path: ["id"],
          type: "any.invalid-company-id",
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
  return company;
};

export const companyIdParamSchema = Joi.number()
  .required()
  .external(companyIdExternal);
