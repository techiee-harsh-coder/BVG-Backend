import { Controller, Get, Post, Body, Patch, Param, Delete, Req, Session, HttpException, HttpStatus } from '@nestjs/common';
import { AdminService } from './admin.service';
import { CreateAdminDto, ForgotPassword, LoginAdminDto, VerifyForgotPasswordDto } from './dto/create-admin.dto';
import { UpdateAdminDto } from './dto/update-admin.dto';
import { Request } from 'express';

@Controller('admin')
export class AdminController {
  constructor(private readonly adminService: AdminService) {}
  @Get('generate-captcha')
  generateCaptcha(@Req() request) {
    const captcha = this.adminService.generateCaptcha();
    request.session.captchaSolution = captcha.text;
    return { image: captcha.data };
  }
  @Post()
  create(@Body() createAdminDto: CreateAdminDto) {
    return this.adminService.create(createAdminDto);
  }
  @Post("verify-login-captcha")
  verifyCaptcha(@Body('token') token: string, @Session() session: Record<string, any>, @Req() request: Request) {
    const isValid = session.captchaSolution === token;
    if (isValid) {
      return { success: true };
    } else {
      throw new HttpException('Invalid Captcha', HttpStatus.BAD_REQUEST);
    }
  }

  @Post('login')
  login(@Body() loginAdminDto: LoginAdminDto) {
    return this.adminService.login(loginAdminDto);
  }

  @Post("forgot-password")
  forgotPassword(@Body() forgotPasswordDto: ForgotPassword, @Req() request: Request) {
    return this.adminService.forgotPassword(forgotPasswordDto,request);
  }

  @Post("verify-user")
  verifyForgotPassword(@Body() verifyUserDto: VerifyForgotPasswordDto) {
    return this.adminService.verifyForgotPassword(verifyUserDto);
  }

  @Post("resend-otp")
  otpVerification(@Body() verifyOtpDto: ForgotPassword,@Req() request: Request) {
    return this.adminService.resend(verifyOtpDto,request);
  }
  
  @Get()
  findAll() {
    return this.adminService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.adminService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateAdminDto: UpdateAdminDto) {
    return this.adminService.update(+id, updateAdminDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.adminService.remove(+id);
  }
}
