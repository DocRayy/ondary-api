import { Injectable } from "@nestjs/common";
import { InjectModel } from "@nestjs/sequelize";
import { Sequelize } from "sequelize-typescript";
import { QueryBuilderHelper } from "src/cores/helpers/query-builder.helper";
import { ResponseHelper } from "src/cores/helpers/response.helper";
import { CreateUserDeviceDto } from "./dto/create-user-device.dto";
import { UpdateUserDeviceDto } from "./dto/update-user-device.dto";
import { UserDevice } from "./entities/user-device.entity";

@Injectable()
export class UserDeviceService {
  constructor(
    private response: ResponseHelper,
    private sequelize: Sequelize,
    @InjectModel(UserDevice)
    private userDeviceModel: typeof UserDevice,
  ) {}

  async findAll(query: any) {
    try {
      const { count, data } = await new QueryBuilderHelper(
        this.userDeviceModel,
        query,
      ).getResult();

      const result = {
        count: count,
        user_devices: data,
      };

      return this.response.success(
        result,
        200,
        "Successfully get user devices",
      );
    } catch (error) {
      return this.response.fail(error, 400);
    }
  }

  async findOne(userDevice: UserDevice) {
    try {
      return this.response.success(
        userDevice,
        200,
        "Successfully get user device",
      );
    } catch (error) {
      return this.response.fail(error, 400);
    }
  }

  async create(createUserDeviceDto: CreateUserDeviceDto) {
    const transaction = await this.sequelize.transaction();
    try {
      const userDevice = await this.userDeviceModel.create(
        {
          ...createUserDeviceDto,
        },
        { transaction },
      );

      await transaction.commit();

      return this.response.success(
        userDevice,
        200,
        "Successfully create user device",
      );
    } catch (error) {
      await transaction.rollback();
      return this.response.fail(error, 400);
    }
  }

  async update(
    userDevice: UserDevice,
    updateUserDeviceDto: UpdateUserDeviceDto,
  ) {
    const transaction = await this.sequelize.transaction();
    try {
      await userDevice.update({ ...updateUserDeviceDto }, { transaction });
      await transaction.commit();
      return this.response.success(
        userDevice,
        200,
        "Successfully update user device",
      );
    } catch (error) {
      await transaction.rollback();
      return this.response.fail(error, 400);
    }
  }

  async remove(userDevice: UserDevice) {
    const transaction = await this.sequelize.transaction();
    try {
      await userDevice.destroy({ transaction });
      await transaction.commit();
      return this.response.success({}, 200, "Successfully delete user device");
    } catch (error) {
      await transaction.rollback();
      return this.response.fail(error, 400);
    }
  }
}
