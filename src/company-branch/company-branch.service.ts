import { Injectable } from '@nestjs/common';
import { CreateCompanyBranchDto } from './dto/create-company-branch.dto';
import { UpdateCompanyBranchDto } from './dto/update-company-branch.dto';
import { InjectModel } from '@nestjs/mongoose';
import { CompanyBranch, CompanyBranchDocument } from './schema/company-branch.schema';
import { Model } from 'mongoose';
import { Company, CompanyDocument } from 'src/company/schema/company.schema';

@Injectable()
export class CompanyBranchService {
  constructor(
      @InjectModel(CompanyBranch.name) private readonly companyBranchModel: Model<CompanyBranchDocument>,
      @InjectModel(Company.name) private readonly companyModel: Model<CompanyDocument>
  ){}

  async create(createCompanyBranchDto: CreateCompanyBranchDto) {
    const branch = await this.companyBranchModel.create(createCompanyBranchDto);
    await this.companyModel.findByIdAndUpdate(createCompanyBranchDto.companyId,{$push:{branchId:branch._id}},{new:true});
    return branch;
  }

  async findAll() {
    return await this.companyBranchModel.find({deletedAt:null}).lean();
  }

  async findByCompanyId(id:string){
    return await this.companyBranchModel.find({companyId:id,deletedAt:null}).lean();
  }
  
  async findOne(id: string) {
    return await this.companyBranchModel.findOne({_id:id,deletedAt:null}).lean();
  }

  async update(id: string, updateCompanyBranchDto: UpdateCompanyBranchDto) {
    return await this.companyBranchModel.findByIdAndUpdate(id,{...updateCompanyBranchDto},{new:true}).lean();
  }

  async remove(id: string,req:Request|any) {
    const data = await this.companyBranchModel.findByIdAndUpdate(id,{deletedBy:req.userId||'',deletedAt:new Date()},{new:true}).lean();
    const deletedBarnch = await this.companyModel.findByIdAndUpdate(data.companyId,{$pull:{branchId:id}},{new:true});
    console.log(deletedBarnch)
    return data;
  }
}
