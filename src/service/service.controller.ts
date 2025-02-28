import { Controller, Get, Post, Body, Patch, Param, Delete, UseInterceptors, UseGuards, Req, UploadedFile, Query } from '@nestjs/common';
import { ServiceService } from './service.service';
import { CreateServiceDto } from './dto/create-service.dto';
import { UpdateServiceDto } from './dto/update-service.dto';
import { FileInterceptor } from '@nestjs/platform-express';
import { AdminGuard } from 'src/admin/admin-guard/admin-guard.guard';
import { Request } from 'express';

@Controller('service')
export class ServiceController {
  constructor(private readonly serviceService: ServiceService) {}

  @Post()
  @UseGuards(AdminGuard)
  @UseInterceptors(FileInterceptor('icon'))
  create(
    @Body() createServiceDto: CreateServiceDto,
    @UploadedFile() icon: Express.Multer.File | null,
    @Req() request: Request | any,
  ) {
    createServiceDto.createdBy = request?.userId || null;
    return this.serviceService.create(createServiceDto, icon);
  }

  @Get()
  @UseGuards(AdminGuard)
  findAll() {
    return this.serviceService.findAll();
  }

  @Get(':id')
  @UseGuards(AdminGuard)
  findOne(@Param('id') id: string) {
    return this.serviceService.findOne(id);
  }

  @Patch(':id')
  @UseGuards(AdminGuard)
  @UseInterceptors(FileInterceptor('icon'))
  update(
    @Param('id') id: string,
    @Body() updateServiceDto: UpdateServiceDto,
    @UploadedFile() icon: Express.Multer.File | null,
    @Req() request: Request | any,
  ) {
    updateServiceDto.updatedBy = request?.userId;
    return this.serviceService.update(id, updateServiceDto, icon);
  }

  @Delete(':id')
  @UseGuards(AdminGuard)
  remove(@Param('id') id: string, @Req() request: Request | any) {
    return this.serviceService.remove(id, request?.userId as any);
  }

  @Get('pagination/all')
  @UseGuards(AdminGuard)
  async findWithPagination(
    @Query('page') page: number,
    @Query('limit') limit: number,
    @Query('search') search: string,
  ) {
    return this.serviceService.findWithPagination(page, limit, search);
  }
}
