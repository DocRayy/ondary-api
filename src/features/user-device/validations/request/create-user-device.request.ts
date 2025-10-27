import * as Joi from "joi";
import { User } from "src/features/user/entities/user.entity";
export const createUserDeviceSchema = Joi.object({
  user_id: Joi.number()
    .required()
    .external(async (value) => {
      const user = await User.findByPk(value);
      if (!user) {
        throw new Joi.ValidationError(
          "any.invalid-user-id",
          [
            {
              message: "user not found",
              path: ["id"],
              type: "any.invalid-user-id",
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
  token: Joi.string().required(),
  label: Joi.string().optional().allow(null, ""),
  is_active: Joi.boolean().required(),
});
