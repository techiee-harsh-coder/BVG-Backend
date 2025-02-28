import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { MongooseModule } from '@nestjs/mongoose';
import { V1Module } from './v1/v1.module';
import { OtpModule } from './otp/otp.module';
import { JwtModule } from '@nestjs/jwt';
import { AdminModule } from './admin/admin.module';
import { ServiceModule } from './service/service.module';
import { SubServiceModule } from './sub-service/sub-service.module';
import { EmployeeModule } from './employee/employee.module';
import { PackagesModule } from './packages/packages.module';
import { CompanyModule } from './company/company.module';
import { CompanyBranchModule } from './company-branch/company-branch.module';

@Module({
  imports: [
    MongooseModule.forRoot(
      'mongodb+srv://harsh:AtSPY6K2YkTjIQ1b@cluster0.gpsbn.mongodb.net/bvg',
    ),
    JwtModule.register({
      global: true,
      secret: 'bvgjwtsecret',
      signOptions: { expiresIn: '365d' },
    }),
    V1Module,
    OtpModule,
    AdminModule,
    ServiceModule,
    SubServiceModule,
    EmployeeModule,
    PackagesModule,
    CompanyModule,
    CompanyBranchModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
