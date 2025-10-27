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
import { BranchService } from "./branch.service";
import { CreateBranchDto } from "./dto/create-branch.dto";
import { Branch } from "./entities/branch.entity";
import { branchIdParamSchema } from "./validations/param/branch-id.param";
import { createBranchSchema } from "./validations/request/create-branch.request";

@Controller()
export class BranchController {
  constructor(private readonly branchService: BranchService) {}

  @UseGuards(JwtAuthGuard)
  @Post()
  create(
    @Body(new JoiValidationParamPipe(createBranchSchema))
    createBranchDto: CreateBranchDto,
  ) {
    return this.branchService.create(createBranchDto);
  }

  @UseGuards(JwtAuthGuard)
  @Get()
  async findAll(@Query() query) {
    return await this.branchService.findAll(query);
  }

  @UseGuards(JwtAuthGuard)
  @Get(":id")
  findOne(
    @Param("id", new JoiValidationParamPipe(branchIdParamSchema))
    branch: Branch,
  ) {
    return this.branchService.findOne(branch);
  }

  @UseGuards(JwtAuthGuard)
  @Put(":id")
  update(
    @Param("id", new JoiValidationParamPipe(branchIdParamSchema))
    branch: Branch,
    @Body(new JoiValidationParamPipe(createBranchSchema))
    updateBranchDto: CreateBranchDto,
  ) {
    return this.branchService.update(branch, updateBranchDto);
  }

  @UseGuards(JwtAuthGuard)
  @Delete(":id")
  remove(
    @Param("id", new JoiValidationParamPipe(branchIdParamSchema))
    branch: Branch,
  ) {
    return this.branchService.remove(branch);
  }
}
