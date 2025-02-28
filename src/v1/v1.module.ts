import { Module } from '@nestjs/common';
import { CustomersModule } from './customers/customers.module';
import { BaseServiceService } from './base-service/base-service.service';

@Module({
    imports:[
        CustomersModule
    ],
    providers: [BaseServiceService]
})
export class V1Module {}
