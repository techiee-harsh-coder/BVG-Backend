import { Module } from '@nestjs/common';
import { AdminService } from './admin.service';
import { AdminController } from './admin.controller';
import { Admin, AdminSchema } from './schema/admin.schema';
import { MongooseModule } from '@nestjs/mongoose';
import { hash } from 'bcrypt';
import { JwtService } from '@nestjs/jwt';
import { Otp, OtpSchema } from 'src/otp/schema/otp.schema';
import { OtpService } from 'src/otp/otp.service';

@Module({
  imports:[ MongooseModule.forFeatureAsync([
    {
      name: Admin.name,
      useFactory() {
        return AdminSchema.pre('save', async function (next) {
          if (!this.isModified('password')) return next();
          const hashPassword: string = await hash(this.password,10);
          this.password = hashPassword;
          next();
        });
      },
    },
    {name:Otp.name, useFactory(){return OtpSchema}}
  ])
  ],
  controllers: [AdminController],
  providers: [AdminService,OtpService],
})
export class AdminModule {}
