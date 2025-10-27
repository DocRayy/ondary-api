import { Module } from "@nestjs/common";
import { SequelizeModule } from "@nestjs/sequelize";
import { BranchController } from "./branch.controller";
import { BranchService } from "./branch.service";
import { Branch } from "./entities/branch.entity";

@Module({
  imports: [SequelizeModule.forFeature([Branch])],
  controllers: [BranchController],
  providers: [BranchService],
})
export class BranchModule {}
