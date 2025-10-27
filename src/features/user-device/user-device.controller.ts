import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
  Query,
  UseGuards,
} from "@nestjs/common";
import { JwtAuthGuard } from "src/cores/guards/jwt-auth.guard";
import { JoiValidationParamPipe } from "src/cores/validators/pipes/joi-validation-param.pipe";
import { JoiValidationPipe } from "src/cores/validators/pipes/joi-validation.pipe";
import { CreateUserDeviceDto } from "./dto/create-user-device.dto";
import { UpdateUserDeviceDto } from "./dto/update-user-device.dto";
import { UserDevice } from "./entities/user-device.entity";
import { UserDeviceService } from "./user-device.service";
import { userDeviceIdParamSchema } from "./validations/param/user-device-id.param";
import { createUserDeviceSchema } from "./validations/request/create-user-device.request";

@Controller()
export class UserDeviceController {
  constructor(private userDeviceService: UserDeviceService) {}

  @UseGuards(JwtAuthGuard)
  @Get()
  async findAll(@Query() query) {
    return await this.userDeviceService.findAll(query);
  }

  @UseGuards(JwtAuthGuard)
  @Get(":id")
  async findOne(
    @Param("id", new JoiValidationParamPipe(userDeviceIdParamSchema))
    userDevice: UserDevice,
  ) {
    return await this.userDeviceService.findOne(userDevice);
  }

  @UseGuards(JwtAuthGuard)
  @Post()
  async create(
    @Body(new JoiValidationPipe(createUserDeviceSchema))
    createUserDeviceDto: CreateUserDeviceDto,
  ) {
    return await this.userDeviceService.create(createUserDeviceDto);
  }

  @UseGuards(JwtAuthGuard)
  @Put(":id")
  async update(
    @Param("id", new JoiValidationParamPipe(userDeviceIdParamSchema))
    userDevice: UserDevice,
    @Body(new JoiValidationPipe(createUserDeviceSchema))
    updateUserDeviceDto: UpdateUserDeviceDto,
  ) {
    return await this.userDeviceService.update(userDevice, updateUserDeviceDto);
  }

  @UseGuards(JwtAuthGuard)
  @Delete(":id")
  async remove(
    @Param("id", new JoiValidationParamPipe(userDeviceIdParamSchema))
    userDevice: UserDevice,
  ) {
    return this.userDeviceService.remove(userDevice);
  }
}
