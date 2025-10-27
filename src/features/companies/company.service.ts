import { Injectable } from "@nestjs/common";
import { InjectModel } from "@nestjs/sequelize";
import { Sequelize } from "sequelize-typescript";
import { QueryBuilderHelper } from "src/cores/helpers/query-builder.helper";
import { ResponseHelper } from "src/cores/helpers/response.helper";
import { CreateCompanyDto } from "./dto/create-company.dto";
import { UpdateCompanyDto } from "./dto/update-company.dto";
import { Company } from "./entities/company.entity";
@Injectable()
export class CompanyService {
  constructor(
    private response: ResponseHelper,
    private sequelize: Sequelize,
    @InjectModel(Company) private companyModel: typeof Company,
  ) {}

  async findAll(query: any) {
    try {
      const { count, data } = await new QueryBuilderHelper(
        this.companyModel,
        query,
      ).getResult();

      const result = {
        count: count,
        companies: data,
      };

      return this.response.success(result, 200, "Successfully get companies");
    } catch (error) {
      return this.response.fail(error, 400);
    }
  }

  async findOne(company: Company) {
    try {
      await company.reload({ include: ["branch"] });
      return this.response.success(company, 200, "Successfully get company");
    } catch (error) {
      return this.response.fail(error, 400);
    }
  }

  async create(createCompanyDto: CreateCompanyDto) {
    const transaction = await this.sequelize.transaction();
    try {
      const company = await this.companyModel.create(
        { ...createCompanyDto },
        { transaction },
      );

      await transaction.commit();

      return this.response.success(company, 200, "Successfully create company");
    } catch (error) {
      await transaction.rollback();
      return this.response.fail(error, 400);
    }
  }

  async update(company: Company, updateCompanyDto: UpdateCompanyDto) {
    const transaction = await this.sequelize.transaction();
    try {
      await company.update({ ...updateCompanyDto }, { transaction });
      await transaction.commit();
      return this.response.success(company, 200, "Successfully update company");
    } catch (error) {
      await transaction.rollback();
      return this.response.fail(error, 400);
    }
  }

  async remove(company: Company) {
    const transaction = await this.sequelize.transaction();
    try {
      await company.destroy({ transaction });
      await transaction.commit();
      return this.response.success({}, 200, "Successfully delete company");
    } catch (error) {
      await transaction.rollback();
      return this.response.fail(error, 400);
    }
  }
}
