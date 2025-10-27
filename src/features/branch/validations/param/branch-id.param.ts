import * as Joi from "joi";
import { Branch } from "src/features/branch/entities/branch.entity";

export const branchIdExternal = async (value) => {
  const branch = await Branch.findOne({
    where: { id: value },
  });

  if (!branch) {
    throw new Joi.ValidationError(
      "any.invalid-branch-id",
      [
        {
          message: "branch not found",
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
  return branch;
};

export const branchIdParamSchema = Joi.number()
  .required()
  .external(branchIdExternal);
