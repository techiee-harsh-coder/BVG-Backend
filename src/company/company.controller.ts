import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
  Req,
  UseInterceptors,
  UploadedFile,
  Query,
} from '@nestjs/common';
import { CompanyService } from './company.service';
import { CreateCompanyDto } from './dto/create-company.dto';
import { UpdateCompanyDto } from './dto/update-company.dto';
import { AdminGuard } from 'src/admin/admin-guard/admin-guard.guard';
import { FileInterceptor } from '@nestjs/platform-express';

@Controller('company')
export class CompanyController {
  constructor(private readonly companyService: CompanyService) {}

  @Post()
  @UseGuards(AdminGuard)
  @UseInterceptors(FileInterceptor('logo'))
  create(
    @Body() createCompanyDto: CreateCompanyDto,
    @Req() req: Request | any,
    @UploadedFile() file: Express.Multer.File,
  ) {
    createCompanyDto.createdBy = req.userId || '';
    return this.companyService.create(createCompanyDto, file);
  }

  @Get()
  @UseGuards(AdminGuard)
  findAll() {
    return this.companyService.findAll();
  }

  @Get(':id')
  @UseGuards(AdminGuard)
  findOne(@Param('id') id: string) {
    return this.companyService.findOne(id);
  }

  @Patch(':id')
  @UseGuards(AdminGuard)
  @UseInterceptors(FileInterceptor('logo'))
  update(
    @Param('id') id: string,
    @Body() updateCompanyDto: UpdateCompanyDto,
    @Req() req: Request | any,
    @UploadedFile() file: Express.Multer.File,
  ) {
    updateCompanyDto.updatedBy = req.userId || '';
    return this.companyService.update(id, updateCompanyDto, file);
  }

  @Delete(':id')
  @UseGuards(AdminGuard)
  remove(@Param('id') id: string, @Req() req: Request | any) {
    return this.companyService.remove(id, req);
  }

  @Get('pagination/all')
  @UseGuards(AdminGuard)
  async findWithPagination(
    @Query('page') page: number,
    @Query('limit') limit: number,
    @Query('search') search: string,
  ) {
    return this.companyService.findWithPagination(page, limit, search);
  }
}
