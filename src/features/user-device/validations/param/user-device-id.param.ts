import * as Joi from "joi";
import { UserDevice } from "../../entities/user-device.entity";

export const userDeviceIdExternal = async (value) => {
  const userDevice = await UserDevice.findOne({
    where: { id: value },
  });

  if (!userDevice) {
    throw new Joi.ValidationError(
      "any.invalid-user-device-id",
      [
        {
          message: "user device not found",
          path: ["id"],
          type: "any.invalid-user-device-id",
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
  return userDevice;
};

export const userDeviceIdParamSchema = Joi.number()
  .required()
  .external(userDeviceIdExternal);
