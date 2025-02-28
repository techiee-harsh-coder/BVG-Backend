import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards, UseInterceptors, UploadedFile, Req } from '@nestjs/common';
import { SubServiceService } from './sub-service.service';
import { CreateSubServiceDto } from './dto/create-sub-service.dto';
import { UpdateSubServiceDto } from './dto/update-sub-service.dto';
import { AdminGuard } from 'src/admin/admin-guard/admin-guard.guard';
import { FileInterceptor } from '@nestjs/platform-express';

@Controller('sub-service')
export class SubServiceController {
  constructor(private readonly subServiceService: SubServiceService) {}

  @Post()
    @UseGuards(AdminGuard)
    @UseInterceptors(FileInterceptor('icon'))
  create(@Body() createSubServiceDto: CreateSubServiceDto,@UploadedFile() icon:Express.Multer.File|null,@Req() request:Request|any) {
    createSubServiceDto.createdBy = request?.userId||null;
    return this.subServiceService.create(createSubServiceDto,icon);
  }

  @Get()
  findAll() {
    return this.subServiceService.findAll();
  }

  @Get(':id')
  @UseGuards(AdminGuard)
  findOne(@Param('id') id: string) {
    return this.subServiceService.findOne(+id);
  }

  @Patch(':id')
  @UseGuards(AdminGuard)
  @UseInterceptors(FileInterceptor('icon'))
  update(@Param('id') id: string, @Body() updateSubServiceDto: UpdateSubServiceDto,@UploadedFile() icon:Express.Multer.File|null,@Req() request:Request|any) {
    updateSubServiceDto.updatedBy = request?.userId;
    return this.subServiceService.update(id, updateSubServiceDto,icon);
  }

  @Delete(':id')
  @UseGuards(AdminGuard)
    remove(@Param('id') id: string,@Req() request:Request|any) {
      return this.subServiceService.remove(id,request?.userId as any);
  }
}
