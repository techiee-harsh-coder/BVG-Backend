import { Module } from '@nestjs/common';
import { CompanyBranchService } from './company-branch.service';
import { CompanyBranchController } from './company-branch.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { CompanyBranch, CompanyBranchSchema } from './schema/company-branch.schema';
import { Company, CompanySchema } from 'src/company/schema/company.schema';

@Module({
  imports:[MongooseModule.forFeature([{name:CompanyBranch.name,schema:CompanyBranchSchema},{name:Company.name,schema:CompanySchema}])],
  controllers: [CompanyBranchController],
  providers: [CompanyBranchService],
})
export class CompanyBranchModule {}
