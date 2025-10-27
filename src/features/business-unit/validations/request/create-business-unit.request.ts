import * as Joi from "joi";
import { Branch } from "src/features/branch/entities/branch.entity";
import { Company } from "src/features/companies/entities/company.entity";
import { BusinessUnit } from "../../entities/business-unit.entity";

export const createBusinessUnitSchema = Joi.object({
  business_units: Joi.array().items(
    Joi.object({
      company_id: Joi.number()
        .required()
        .external(async (value) => {
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
        }),
      branch_id: Joi.number()
        .required()
        .external(async (value) => {
          const branch = await Branch.findOne({
            where: { id: value },
          });

          if (!branch) {
            throw new Joi.ValidationError(
              "any.invalid-company-id",
              [
                {
                  message: "Branch not found",
                  path: ["id"],
                  type: "any.invalid-branch-id",
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
        }),
      code: Joi.string()
        .required()
        .external(async (value) => {
          const businessUnit = await BusinessUnit.findOne({
            where: { code: value },
          });

          if (businessUnit) {
            throw new Joi.ValidationError(
              "any.invalid-business-unit-code",
              [
                {
                  message: "Business unit code already exists",
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
        }),
    }),
  ),
});
