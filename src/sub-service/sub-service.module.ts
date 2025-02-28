import { Module } from '@nestjs/common';
import { SubServiceService } from './sub-service.service';
import { SubServiceController } from './sub-service.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { SubService, SubServiceSchema } from './schema/sub-service.schema';

@Module({
  imports:[
    MongooseModule.forFeature([
      {name:SubService.name,schema:SubServiceSchema}
    ])
  ],
  controllers: [SubServiceController],
  providers: [SubServiceService],
})
export class SubServiceModule {}
