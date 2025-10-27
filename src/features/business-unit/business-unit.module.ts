import { Module } from "@nestjs/common";
import { SequelizeModule } from "@nestjs/sequelize";
import { BusinessUnitController } from "./business-unit.controller";
import { BusinessUnitService } from "./business-unit.service";
import { BusinessUnit } from "./entities/business-unit.entity";

@Module({
  imports: [SequelizeModule.forFeature([BusinessUnit])],
  controllers: [BusinessUnitController],
  providers: [BusinessUnitService],
})
export class BusinessUnitModule {}
