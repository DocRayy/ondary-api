import { Injectable } from "@nestjs/common";
import { InjectModel } from "@nestjs/sequelize";
import { Sequelize } from "sequelize-typescript";
import { QueryBuilderHelper } from "src/cores/helpers/query-builder.helper";
import { ResponseHelper } from "src/cores/helpers/response.helper";
import { CreateBranchDto } from "./dto/create-branch.dto";
import { Branch } from "./entities/branch.entity";

@Injectable()
export class BranchService {
  constructor(
    @InjectModel(Branch)
    private branchModel: typeof Branch,
    private response: ResponseHelper,
    private sequelize: Sequelize,
  ) {}

  async create(createBranchDto: CreateBranchDto) {
    const transaction = await this.sequelize.transaction();
    try {
      const branch = await this.branchModel.create(
        {
          ...createBranchDto,
        },
        { transaction },
      );

      await transaction.commit();

      return this.response.success(branch, 200, "Successfully create branch");
    } catch (error) {
      await transaction.rollback();
      return this.response.fail(error, 400);
    }
  }

  async findAll(query: any) {
    try {
      const { count, data } = await new QueryBuilderHelper(
        this.branchModel,
        query,
      ).getResult();

      const result = {
        count: count,
        branches: data,
      };

      return this.response.success(result, 200, "Successfully get branches");
    } catch (error) {
      return this.response.fail(error, 400);
    }
  }

  async findOne(branch: Branch) {
    try {
      await branch.reload({ include: ["companies"] });
      return this.response.success(branch, 200, "Successfully get branch");
    } catch (error) {
      return this.response.fail(error, 400);
    }
  }

  async update(branch: Branch, updateBranchDto: CreateBranchDto) {
    const transaction = await this.sequelize.transaction();
    try {
      await branch.update({ ...updateBranchDto }, { transaction });
      await transaction.commit();

      return this.response.success(branch, 200, "Successfully update branch");
    } catch (error) {
      await transaction.rollback();
      return this.response.fail(error, 400);
    }
  }

  async remove(branch: Branch) {
    const transaction = await this.sequelize.transaction();
    try {
      await branch.destroy({ transaction });
      await transaction.commit();
      return this.response.success({}, 200, "Successfully delete branch");
    } catch (error) {
      await transaction.rollback();
      return this.response.fail(error, 400);
    }
  }
}
