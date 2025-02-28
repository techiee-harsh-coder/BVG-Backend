import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards, Req, Query } from '@nestjs/common';
import { CompanyBranchService } from './company-branch.service';
import { CreateCompanyBranchDto } from './dto/create-company-branch.dto';
import { UpdateCompanyBranchDto } from './dto/update-company-branch.dto';
import { AdminGuard } from 'src/admin/admin-guard/admin-guard.guard';

@Controller('company-branch')
export class CompanyBranchController {
  constructor(private readonly companyBranchService: CompanyBranchService) {}

  @Post()
  @UseGuards(AdminGuard)
  create(@Body() createCompanyBranchDto: CreateCompanyBranchDto,@Req() req: Request|any,) {
    createCompanyBranchDto.createdBy = req.userId || '';
    return this.companyBranchService.create(createCompanyBranchDto);
  }

  @Get()
  @UseGuards(AdminGuard)
  findAll() {
    return this.companyBranchService.findAll();
  }

  @Get(':id')
  @UseGuards(AdminGuard)
  findOne(@Param('id') id: string) {
    return this.companyBranchService.findOne(id);
  }

  @Get('company/:id')
  @UseGuards(AdminGuard)
  findByCompanyId(@Param('id') id: string) {
    return this.companyBranchService.findByCompanyId(id);
  }

  @Patch(':id')
  @UseGuards(AdminGuard)
  update(@Param('id') id: string, @Body() updateCompanyBranchDto: UpdateCompanyBranchDto,@Req() req:Request|any) {
    updateCompanyBranchDto.updatedBy = req.userId || '';
    return this.companyBranchService.update(id, updateCompanyBranchDto);
  }

  @Delete(':id')
  @UseGuards(AdminGuard)
  remove(@Param('id') id: string,@Req() req:Request|any) {
    return this.companyBranchService.remove(id,req);
  }
}
