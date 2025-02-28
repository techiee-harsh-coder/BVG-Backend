import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateServiceDto } from './dto/create-service.dto';
import { UpdateServiceDto } from './dto/update-service.dto';
import { deleteSingleFile, updateSingleFile, uploadSingleFile } from 'src/helper/file.helper';
import { InjectModel } from '@nestjs/mongoose';
import { Service, ServiceDocument } from './schema/service.schema';
import { Model } from 'mongoose';

@Injectable()
export class ServiceService {
  constructor(
    @InjectModel(Service.name)
    private readonly serviceModel: Model<ServiceDocument>,
  ) { }
  async create(createServiceDto: CreateServiceDto, file: Express.Multer.File | null) {
    if (file) {
      createServiceDto.icon = await uploadSingleFile(file, './public/service');
    }
    const data = this.serviceModel.create(createServiceDto);
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

  async findAll() {
    return await this.serviceModel.find({deletedAt:null});
  }

  async findOne(id: string) {
    return await this.serviceModel.findOne({_id:id,deletedAt:null});
  }

  async update(id: string, updateServiceDto: UpdateServiceDto, file: Express.Multer.File | null) {
    const existingData = await this.serviceModel.findOne({_id:id, deletedAt:null})
    if (!existingData) {
      throw new NotFoundException('Data not found.')
    }
    if (file) {
      updateServiceDto.icon = await updateSingleFile(file, existingData.icon, './public/service')
    } else {
      updateServiceDto.icon = existingData.icon;
    }
     return await this.serviceModel.findByIdAndUpdate(existingData._id,updateServiceDto,{new:true}).lean();
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
