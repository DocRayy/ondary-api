import { RouterModule } from "@nestjs/core";
import { AuthModule } from "src/features/auth/auth.module";
import { BranchModule } from "src/features/branch/branch.module";
import { BusinessUnitModule } from "src/features/business-unit/business-unit.module";
import { CompanyModule } from "src/features/companies/company.module";
import { LocationSubmissionImageModule } from "src/features/location-submission-image/location-submission-image.module";
import { LocationSubmissionModule } from "src/features/location-submission/location-submission.module";
import { NotificationModule } from "src/features/notification/public/notification.module";
import { UserDeviceModule } from "src/features/user-device/user-device.module";
import { UserModule } from "src/features/user/user.module";

export default RouterModule.register([
  {
    path: "/api/v1",
    children: [
      {
        path: "auth",
        module: AuthModule,
      },
      {
        path: "users",
        module: UserModule,
      },
      {
        path: "notifications",
        module: NotificationModule,
      },
      {
        path: "user-devices",
        module: UserDeviceModule,
      },
      {
        path: "companies",
        module: CompanyModule,
      },
      {
        path: "branches",
        module: BranchModule,
      },
      {
        path: "business-units",
        module: BusinessUnitModule,
      },
      {
        path: "location-submissions",
        module: LocationSubmissionModule,
        children: [
          {
            path: ":submissionId/images",
            module: LocationSubmissionImageModule,
          },
        ],
      },
    ],
  },
]);
