import { Module } from "@nestjs/common";
import { ConfigModule } from "@nestjs/config";
import { EventEmitterModule } from "@nestjs/event-emitter";
import { PassportModule } from "@nestjs/passport";
import { ScheduleModule } from "@nestjs/schedule";
import { SequelizeModule } from "@nestjs/sequelize";
import { AppController } from "./app.controller";
import { AppService } from "./app.service";
import routerConfig from "./cores/configs/router.config";
import { sequelizeConfigAsync } from "./cores/configs/sequelize.config";
import { NotificationListener } from "./cores/event-emitter/notification.listener";
import { ResponseModule } from "./cores/modules/response/response.module";
import { AuthModule } from "./features/auth/auth.module";
import { BranchModule } from "./features/branch/branch.module";
import { BusinessUnitModule } from "./features/business-unit/business-unit.module";
import { CompanyModule } from "./features/companies/company.module";
import { LocationSubmissionImageModule } from "./features/location-submission-image/location-submission-image.module";
import { LocationSubmissionModule } from "./features/location-submission/location-submission.module";
import { NotificationModule } from "./features/notification/public/notification.module";
import { UserDeviceModule } from "./features/user-device/user-device.module";
import { UserModule } from "./features/user/user.module";

@Module({
  imports: [
    PassportModule,
    ConfigModule.forRoot({
      envFilePath: ".env",
      isGlobal: true,
      cache: true,
    }),
    SequelizeModule.forRootAsync(sequelizeConfigAsync),
    EventEmitterModule.forRoot(),
    routerConfig,
    AuthModule,
    ResponseModule,
    UserModule,
    NotificationModule,
    // WhatsappWebModule,
    UserDeviceModule,
    ScheduleModule.forRoot(),
    CompanyModule,
    BranchModule,
    BusinessUnitModule,
    LocationSubmissionModule,
    LocationSubmissionImageModule,
  ],
  controllers: [AppController],
  providers: [AppService, NotificationListener],
})
export class AppModule {}
