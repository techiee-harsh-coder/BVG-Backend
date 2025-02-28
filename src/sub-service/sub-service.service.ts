import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateSubServiceDto } from './dto/create-sub-service.dto';
import { UpdateSubServiceDto } from './dto/update-sub-service.dto';
import { SubService, SubServiceDocument } from './schema/sub-service.schema';
import { Model } from 'mongoose';
import { deleteSingleFile, updateSingleFile, uploadSingleFile } from 'src/helper/file.helper';
import { InjectModel } from '@nestjs/mongoose';

@Injectable()
export class SubServiceService {
 constructor(
     @InjectModel(SubService.name)
     private readonly serviceModel: Model<SubServiceDocument>,
   ) { }
   async create(createSubServiceDto: CreateSubServiceDto, file: Express.Multer.File | null) {
     if (file) {
       createSubServiceDto.icon = await uploadSingleFile(file, './public/sub-service');
     }
     const data = this.serviceModel.create(createSubServiceDto);
     return data;
   }
 
   async findWithPagination(page: number, limit: number, search: string) {
     const skip = (page - 1) * limit;
     let query = {};
     if (search) {
       query = { 'name': { $regex: new RegExp(search, 'i') } };
     }
     const [data, total] = await Promise.all([
       this.serviceModel.find({ ...query, deletedAt: null }).sort({ createdAt: -1 }).skip(skip).limit(limit).lean(),
       this.serviceModel.countDocuments({ ...query, deletedAt: null }),
     ]);
     return {
       page: page,
       limit: limit,
       search: search,
       total: total,
       data: data,
     };
   }
 
   findAll() {
     return `This action returns all service`;
   }
 
   findOne(id: number) {
     return `This action returns a #${id} service`;
   }
 
   async update(id: string, updateSubServiceDto: UpdateSubServiceDto, file: Express.Multer.File | null) {
     const existingData = await this.serviceModel.findOne({_id:id, deletedAt:null})
     if (!existingData) {
       throw new NotFoundException('Data not found.')
     }
     if (file) {
       updateSubServiceDto.icon = await updateSingleFile(file, existingData.icon, './public/sub-service')
     } else {
       updateSubServiceDto.icon = existingData.icon;
     }
      return await this.serviceModel.findByIdAndUpdate(existingData._id,updateSubServiceDto).lean();
   }
 
   async remove(id: string, userId:string) {
     const existingData = await this.serviceModel.findOne({_id:id, deletedAt:null})
     if (!existingData) {
       throw new NotFoundException('Data not found.')
     }
 
     await deleteSingleFile(existingData.icon);
     const data = await this.serviceModel.findByIdAndUpdate(existingData._id,{ deletedAt: new Date(), deletedBy:userId }, { new: true });
     return data;
   }
}
