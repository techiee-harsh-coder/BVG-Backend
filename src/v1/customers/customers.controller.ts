import { Controller, Get, Post, Body, Req, Param, UseGuards, Delete, Query, Patch } from '@nestjs/common';
import { CustomersService } from './customers.service';
import { Request } from 'express';
import { AdminGuard } from 'src/admin/admin-guard/admin-guard.guard';

@Controller('v1/customers')
export class CustomersController {
  constructor(private readonly customersService: CustomersService) { }

  @Post('registration')
  register(@Body('body') body: string, @Req() req: Request) {
    console.log(body);
    return this.customersService.register(body, req);
  }
  @Post('login')
  login(@Body('body') body: string, @Req() req: Request) {
    return this.customersService.login(body, req);
  }
  @Post('resend')
  resend(@Body('body') body: string, @Req() req: Request) {
    return this.customersService.resend(body, req);
  }
  @Post('verify-otp')
  verify(@Body('body') body: string) {
    return this.customersService.verify(body);
  }

  @Get()
  @UseGuards(AdminGuard)
  getAll() {
    return this.customersService.getAll();
  }

  @Get(":id")
  @UseGuards(AdminGuard)
  getOne(@Param('id') id: string) {
    return this.customersService.getOne(id);
  }

  @Delete(":id")
  @UseGuards(AdminGuard)
  remove(
    @Param('id') id: string,
    @Req() request:Request|any
  ) {
    return this.customersService.remove(id,request);
  }

    @Get('pagination/all')
    @UseGuards(AdminGuard)
    async findWithPagination(
      @Query('page') page: number,
      @Query('limit') limit: number,
      @Query('search') search: string,
    ) {
      return this.customersService.findWithPagination(page, limit, search);
    }

    @Patch(':id')
    @UseGuards(AdminGuard)
    async handleStatus(
      @Param('id') id: string,
    ) {
      return this.customersService.handleStatus(id);
    }
}
