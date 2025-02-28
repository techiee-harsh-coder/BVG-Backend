import { Injectable } from '@nestjs/common';
import { CreateCompanyDto } from './dto/create-company.dto';
import { UpdateCompanyDto } from './dto/update-company.dto';
import { InjectModel } from '@nestjs/mongoose';
import { Company, CompanyDocument } from './schema/company.schema';
import { Model } from 'mongoose';
import { updateSingleFile, uploadSingleFile } from 'src/helper/file.helper';

@Injectable()
export class CompanyService {
  constructor(
    @InjectModel(Company.name) private readonly companyModel: Model<CompanyDocument>
  ){}

  async create(createCompanyDto: CreateCompanyDto,file:Express.Multer.File) {
    if(file){
      createCompanyDto.logo = await uploadSingleFile(file,'./public/company')
    }
    return (await this.companyModel.create(createCompanyDto)).populate('branchId','_id name');
  }

  async findAll() {
    return await this.companyModel.find({deletedAt:null}).populate('branchId','_id name').lean();
  }

  async findOne(id: string) {
    return await this.companyModel.findOne({_id:id,deletedAt:null}).populate('branchId','_id name').lean();
  }

  async update(id: string, updateCompanyDto: UpdateCompanyDto,file:Express.Multer.File) {
    const company = await this.companyModel.findById(id);
    if(file){
      updateCompanyDto.logo = await updateSingleFile(file,company.logo,'./public/company');
    }
    else{
      updateCompanyDto.logo = company.logo;
    }
    return await this.companyModel.findByIdAndUpdate(id, updateCompanyDto, { new: true }).populate('branchId','_id name').lean();
  }

  async remove(id: string,req:Request|any) {
    return await this.companyModel.findByIdAndUpdate(id, { deletedAt: new Date(),deletedBy:req.userId || '' }, { new: true }).populate('branchId','_id name address status contactPerson').lean();
  }

  async findWithPagination(page: number, limit: number, search: string) {
    const skip = (page - 1) * limit;
    let query = {};
    if (search) {
      query = { name: { $regex: new RegExp(search, 'i') } };
    }
    const [data, total] = await Promise.all([
      this.companyModel
        .find({ ...query, deletedAt: null })
        .populate('branchId','_id name')
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(limit)
        .lean(),
      this.companyModel.countDocuments({ ...query, deletedAt: null }),
    ]);
    return {
      page: page,
      limit: limit,
      search: search,
      total: total,
      data: data,
    };
  }
}
