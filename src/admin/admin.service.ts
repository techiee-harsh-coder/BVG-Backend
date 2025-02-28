import { Injectable, UnprocessableEntityException } from '@nestjs/common';
import { CreateAdminDto, VerifyForgotPasswordDto, LoginAdminDto, ForgotPassword } from './dto/create-admin.dto';
import { UpdateAdminDto } from './dto/update-admin.dto';
import { InjectModel } from '@nestjs/mongoose';
import { Admin, AdminDocument } from './schema/admin.schema';
import { Model } from 'mongoose';
import * as svgCaptcha from 'svg-captcha';
import { compare } from 'bcrypt';
import { JwtService } from '@nestjs/jwt';
import { OtpService } from 'src/otp/otp.service';
import { Request } from 'express';
import {hash} from 'bcrypt';
@Injectable()
export class AdminService {
  constructor(
    @InjectModel(Admin.name)
    private readonly adminModel:Model<AdminDocument>,
    private jwtService:JwtService,
    private otpService:OtpService,
  ){}
  async create(createAdminDto: CreateAdminDto) {
    const user = await this.adminModel.findOne({ email: createAdminDto.email, deletedAt: null });
    if (user) {
      throw new UnprocessableEntityException({ email: 'The user already exist' } );
    }
    if (createAdminDto.name.toLowerCase() == 'super admin') {
      throw new UnprocessableEntityException({ name: 'The user name cannot be '+createAdminDto.name } );
    }
    const userData = await this.adminModel.create({
      ...createAdminDto,
    });
    return userData;
  }

  generateCaptcha() {
    const captcha = svgCaptcha.create({
      size: 6,
      noise: 3,
      color: true,
      background: '#FFA07A',
    });
    return captcha;
  }

  async login(loginAdminDto: LoginAdminDto): Promise<any> {
    const user = await this.adminModel.findOne({ email: loginAdminDto.email, status: true, deletedAt: null });
    if (!user) {
      throw new UnprocessableEntityException( { password: 'Invalid Credential!' } );
    }
    const isPwdMatch = await compare(loginAdminDto.password, user.password);
    if (!isPwdMatch) {
      throw new UnprocessableEntityException({password:"Invalid credential"});
    }
    const verifiedAuth = await this.adminModel.findById(user._id).select(['name','email','profile']).lean();
    return {
      ...verifiedAuth,
      token: await this.jwtService.signAsync(verifiedAuth),
    };
  }

  async verifyForgotPassword(forgotPasswordDto: VerifyForgotPasswordDto): Promise<any> {
    const user = await this.adminModel.findOne({ email: forgotPasswordDto.email, status: true, deletedAt: null });
    if (!user) {
      throw new UnprocessableEntityException( { email: 'User does not exist!' } );
    }
    const otp = await this.otpService.verificationOtp({
      otp:forgotPasswordDto.otp,
      reason:'forgot-password',
      type:'email',
      userId:String(user._id),
      userType:'admin'
    })
    if(!otp.status){   throw new UnprocessableEntityException({otp:otp.message});}
    forgotPasswordDto.password = await hash(forgotPasswordDto.password,10);
    await user.updateOne({password:forgotPasswordDto.password})
    return { success: true, message: "Password changed successfully" };
  }

  async forgotPassword(forgotPassword:ForgotPassword,req:Request){
    const user = await this.adminModel.findOne({email:forgotPassword.email, status:true,deletedAt:null});
    if (!user) {
      throw new UnprocessableEntityException( { email: 'User does not exist!' } );
    }
    const otp = await this.otpService.sendOtp({
      reason:"forgot-password",
      to:user.email,
      type:'email',
      userId:String(user._id),
      userType:'admin',
      req
    });
    if(!otp.status){   throw new UnprocessableEntityException({otp:otp.message}); }
    return otp;
  }

  async resend(forgotPassword:ForgotPassword,req:Request){
    const user = await this.adminModel.findOne({email:forgotPassword.email, status:true,deletedAt:null});
    if (!user) {
      throw new UnprocessableEntityException( { password: 'User does not exist!' } );
    }
    const otp = await this.otpService.resendOtp({
      reason:"forgot-password",
      to:user.email,
      type:'email',
      userId:String(user._id),
      userType:'admin',
      req
    });
    if(!otp.status){   throw new UnprocessableEntityException({otp:otp.message}); }
    return otp;
  }

  findAll() {
    return `This action returns all admin`;
  }

  findOne(id: number) {
    return `This action returns a #${id} admin`;
  }

  update(id: number, updateAdminDto: UpdateAdminDto) {
    return `This action updates a #${id} admin`;
  }

  remove(id: number) {
    return `This action removes a #${id} admin`;
  }

}
