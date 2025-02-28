import { Module } from '@nestjs/common';
import { CustomersService } from './customers.service';
import { CustomersController } from './customers.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { Customer, CustomerSchema } from './schema/customer.schema';
import { JwtService } from '@nestjs/jwt';
import { AccessToken, AccessTokenSchema } from './schema/access-token.schema';
import { OtpService } from 'src/otp/otp.service';
import { Otp, OtpSchema } from 'src/otp/schema/otp.schema';

@Module({
  imports:[
    MongooseModule.forFeature([
      {name:Customer.name, schema:CustomerSchema},
      {name:AccessToken.name, schema:AccessTokenSchema},
      {name:Otp.name, schema:OtpSchema},
    ])
  ],
  controllers: [CustomersController],
  providers: [CustomersService, OtpService],
})
export class CustomersModule {}
