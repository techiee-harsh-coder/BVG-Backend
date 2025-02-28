import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateEmployeeDto } from './dto/create-employee.dto';
import { UpdateEmployeeDto } from './dto/update-employee.dto';
import { InjectModel } from '@nestjs/mongoose';
import { Employee, EmployeeDocument } from './schema/employee.schema';
import { Model } from 'mongoose';
import { updateSingleFile, uploadSingleFile } from 'src/helper/file.helper';

@Injectable()
export class EmployeeService {
  constructor(
    @InjectModel(Employee.name)
    private readonly employeeModel: Model<EmployeeDocument>,
  ) {}

  async create(
    createEmployeeDto: CreateEmployeeDto,
    image: Express.Multer.File,
  ) {
    if (image) {
      createEmployeeDto.image = await uploadSingleFile(
        image,
        './public/employee',
      );
    }
    const data = (await this.employeeModel.create(createEmployeeDto)).populate(
      'serviceId',
      '_id name',
    );
    return data;
  }

  async findAll() {
    return await this.employeeModel
      .find({ deletedAt: null })
      .populate('serviceId', '_id name')
      .lean();
  }

  async findOne(id: string) {
    return await this.employeeModel
      .findOne({ _id: id, deletedAt: null })
      .populate('serviceId', '_id name')
      .lean();
  }

  async update(
    id: string,
    updateEmployeeDto: UpdateEmployeeDto,
    file: Express.Multer.File,
  ) {
    const employee = await this.employeeModel.findOne({
      _id: id,
      deletedAt: null,
    });
    if (!employee) {
      throw new NotFoundException('Data Not Found');
    }

    if (file) {
      updateEmployeeDto.image = await updateSingleFile(
        file,
        updateEmployeeDto.image,
        './public/employee',
      );
    }
    return await this.employeeModel
      .findByIdAndUpdate(id, updateEmployeeDto, {
        new: true,
      })
      .populate('serviceId', '_id name')
      .lean();
  }

  async remove(id: string, request: Request | any) {
    const employee = await this.employeeModel.findOne({
      _id: id,
      deletedAt: null,
    });
    if (!employee) {
      throw new NotFoundException('Data Not Found');
    }
    return await this.employeeModel
      .findByIdAndUpdate(
        id,
        { deletedAt: new Date(), deletedBy: request?.userId || null },
        { new: true },
      )
      .populate('serviceId', '_id name')
      .lean();
  }

  async findWithPagination(page: number, limit: number, search: string) {
    const skip = (page - 1) * limit;
    let query = {};
    if (search) {
      query = { name: { $regex: new RegExp(search, 'i') } };
    }
    const [data, total] = await Promise.all([
      this.employeeModel
        .find({ ...query, deletedAt: null })
        .populate('serviceId','_id name')
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(limit)
        .lean(),
      this.employeeModel.countDocuments({ ...query, deletedAt: null }),
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
