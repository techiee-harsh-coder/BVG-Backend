import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards, UseInterceptors, UploadedFile, Req, Query } from '@nestjs/common';
import { EmployeeService } from './employee.service';
import { CreateEmployeeDto } from './dto/create-employee.dto';
import { UpdateEmployeeDto } from './dto/update-employee.dto';
import { AdminGuard } from 'src/admin/admin-guard/admin-guard.guard';
import { FileInterceptor } from '@nestjs/platform-express';

@Controller('employee')
export class EmployeeController {
  constructor(private readonly employeeService: EmployeeService) {}

  @Post()
  @UseGuards(AdminGuard)
  @UseInterceptors(FileInterceptor('image'))
  create(
    @Body() createEmployeeDto: CreateEmployeeDto,
    @UploadedFile() image: Express.Multer.File,
    @Req() req: Request | any,
  ) {
    createEmployeeDto.createdBy = req?.userId || null;
    return this.employeeService.create(createEmployeeDto, image);
  }

  @Get()
  // @UseGuards(AdminGuard)
  findAll() {
    return this.employeeService.findAll();
  }

  @Get(':id')
  @UseGuards(AdminGuard)
  findOne(@Param('id') id: string) {
    return this.employeeService.findOne(id);
  }

  @Patch(':id')
  @UseGuards(AdminGuard)
  @UseInterceptors(FileInterceptor('image'))
  update(
    @Param('id') id: string,
    @Body() updateEmployeeDto: UpdateEmployeeDto,
    @Req() request: Request | any,
    @UploadedFile() file: Express.Multer.File,
  ) {
    updateEmployeeDto.updatedBy = request?.userId || null;
    return this.employeeService.update(id, updateEmployeeDto, file);
  }

  @Delete(':id')
  @UseGuards(AdminGuard)
  remove(
    @Param('id') id: string,
    @Req() request: Request | any,
  ) {
    return this.employeeService.remove(id,request);
  }

  @Get('pagination/all')
    @UseGuards(AdminGuard)
    async findWithPagination(
      @Query('page') page: number,
      @Query('limit') limit: number,
      @Query('search') search: string,
    ) {
      return this.employeeService.findWithPagination(page, limit, search);
    }
}
