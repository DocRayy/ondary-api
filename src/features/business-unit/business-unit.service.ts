import { Injectable } from "@nestjs/common";
import { InjectModel } from "@nestjs/sequelize";
import { Op } from "sequelize";
import { Sequelize } from "sequelize-typescript";
import { QueryBuilderHelper } from "src/cores/helpers/query-builder.helper";
import { ResponseHelper } from "src/cores/helpers/response.helper";
import { CreateBusinessUnitDto } from "./dto/create-business-unit.dto";
import { UpdateBusinessUnitDto } from "./dto/update-business-unit.dto";
import { BusinessUnit } from "./entities/business-unit.entity";

@Injectable()
export class BusinessUnitService {
  constructor(
    @InjectModel(BusinessUnit)
    private readonly businessUnitModel: typeof BusinessUnit,
    private readonly response: ResponseHelper,
    private readonly sequelize: Sequelize,
  ) {}

  async create(createBusinessUnitDto: CreateBusinessUnitDto) {
    const transaction = await this.sequelize.transaction();
    try {
      const businessUnits = await this.businessUnitModel.bulkCreate(
        createBusinessUnitDto.business_units,
        { transaction },
      );

      await transaction.commit();
      return this.response.success(
        businessUnits,
        200,
        "Successfully create business unit",
      );
    } catch (error) {
      await transaction.rollback();
      return this.response.fail(error, 400);
    }
  }

  async findAll(query: any) {
    try {
      const { count, data } = await new QueryBuilderHelper(
        this.businessUnitModel,
        query,
      )
        .load("branch", "company")
        .getResult();

      const result = {
        count: count,
        business_units: data,
      };

      return this.response.success(
        result,
        200,
        "Successfully get business units",
      );
    } catch (error) {
      return this.response.fail(error, 400);
    }
  }

  async findOne(businessUnit: BusinessUnit) {
    try {
      await businessUnit.reload({ include: ["company", "branch"] });
      return this.response.success(
        businessUnit,
        200,
        "Successfully get business unit",
      );
    } catch (error) {
      return this.response.fail(error, 400);
    }
  }

  async update(
    businessUnit: BusinessUnit,
    updateBusinessUnitDto: UpdateBusinessUnitDto,
  ) {
    const checkBusinessUnit = await this.businessUnitModel.findOne({
      where: {
        code: updateBusinessUnitDto.code,
        id: { [Op.ne]: businessUnit.id },
      },
    });
    if (checkBusinessUnit) {
      return this.response.fail("Business unit code already exists", 400);
    }

    const transaction = await this.sequelize.transaction();
    try {
      await businessUnit.update({ ...updateBusinessUnitDto }, { transaction });
      await transaction.commit();
      return this.response.success(
        businessUnit,
        200,
        "Successfully update business unit",
      );
    } catch (error) {
      await transaction.rollback();
      return this.response.fail(error, 400);
    }
  }

  async remove(businessUnitDto: CreateBusinessUnitDto) {
    const transaction = await this.sequelize.transaction();
    try {
      await this.businessUnitModel.destroy({
        where: {
          [Op.or]: businessUnitDto.business_units,
        },
        transaction,
      });
      await transaction.commit();
      return this.response.success(
        {},
        200,
        "Successfully delete business unit",
      );
    } catch (error) {
      await transaction.rollback();
      return this.response.fail(error, 400);
    }
  }
}
