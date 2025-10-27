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
import { BusinessUnitService } from "./business-unit.service";
import { CreateBusinessUnitDto } from "./dto/create-business-unit.dto";
import { UpdateBusinessUnitDto } from "./dto/update-business-unit.dto";
import { BusinessUnit } from "./entities/business-unit.entity";
import { businessUnitCodeParamSchema } from "./validations/param/business_unit-code.param";
import { businessUnitIdParamSchema } from "./validations/param/business_unit-id.param";
import { createBusinessUnitSchema } from "./validations/request/create-business-unit.request";
import { updateBusinessUnitSchema } from "./validations/request/update-business-unit.request";

@Controller()
export class BusinessUnitController {
  constructor(private readonly businessUnitService: BusinessUnitService) {}

  @UseGuards(JwtAuthGuard)
  @Post()
  create(
    @Body(new JoiValidationParamPipe(createBusinessUnitSchema))
    createBusinessUnitDto: CreateBusinessUnitDto,
  ) {
    return this.businessUnitService.create(createBusinessUnitDto);
  }

  @UseGuards(JwtAuthGuard)
  @Get()
  findAll(@Query() query) {
    return this.businessUnitService.findAll(query);
  }

  @Get(":code")
  findOne(
    @Param("code", new JoiValidationParamPipe(businessUnitCodeParamSchema))
    businessUnit: BusinessUnit,
  ) {
    return this.businessUnitService.findOne(businessUnit);
  }

  @UseGuards(JwtAuthGuard)
  @Put(":id")
  update(
    @Param("id", new JoiValidationParamPipe(businessUnitIdParamSchema))
    businessUnit: BusinessUnit,
    @Body(new JoiValidationParamPipe(updateBusinessUnitSchema))
    updateBusinessUnitDto: UpdateBusinessUnitDto,
  ) {
    return this.businessUnitService.update(businessUnit, updateBusinessUnitDto);
  }

  @UseGuards(JwtAuthGuard)
  @Delete()
  async remove(
    @Body(new JoiValidationParamPipe(createBusinessUnitSchema))
    businessUnitDto: CreateBusinessUnitDto,
  ) {
    return this.businessUnitService.remove(businessUnitDto);
  }
}
