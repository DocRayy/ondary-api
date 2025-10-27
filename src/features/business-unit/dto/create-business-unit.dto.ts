export class CreateBusinessUnitDto {
  business_units: Array<{
    company_id: number;
    branch_id: number;
    code: string;
  }>;
}
