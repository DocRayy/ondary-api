import { Module } from "@nestjs/common";
import { SequelizeModule } from "@nestjs/sequelize";
import { UserDevice } from "./entities/user-device.entity";
import { UserDeviceController } from "./user-device.controller";
import { UserDeviceService } from "./user-device.service";

@Module({
  imports: [SequelizeModule.forFeature([UserDevice])],
  controllers: [UserDeviceController],
  providers: [UserDeviceService],
})
export class UserDeviceModule {}
