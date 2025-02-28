import { Injectable } from '@nestjs/common';
import { BaseServiceService } from '../base-service/base-service.service';
import { InjectModel } from '@nestjs/mongoose';
import { Customer, CustomerDocument } from './schema/customer.schema';
import { JwtService } from '@nestjs/jwt';
import { Model } from 'mongoose';
import { AccessToken, AccessTokenDocument } from './schema/access-token.schema';
import { Request } from 'express';
import { OtpService } from 'src/otp/otp.service';

@Injectable()
export class CustomersService extends BaseServiceService {
  constructor(
    @InjectModel(Customer.name)
    private readonly customerModel: Model<CustomerDocument>,
    @InjectModel(AccessToken.name)
    private readonly accessTokenModel: Model<AccessTokenDocument>,
    private jwtService: JwtService,
    private otpService: OtpService,
  ) {
    super();
  }

  async register(encryptedCredentials: string, req: Request) {
    const decryptedData: any = this.decrypt(encryptedCredentials);
    // if (!decryptedData?.firstName || !decryptedData?.phone) {
    //   return this.error('Either a valid name or a 10-digit phone number is required.');
    // }
    if (!decryptedData?.firstName?.match(/^[a-zA-Z\s'-]{1,50}$/) || !String(decryptedData?.phone).match(/^\d{10}$/) || !decryptedData?.email?.match(/^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/)) {
      return this.error('Either a valid name or a 10-digit phone number is required or a valid email');
    }
    // const isUserExist = await this.customerModel.findOne({ phone: decryptedData.phone, deletedAt: null });
    const isUserExist = await this.customerModel.findOne({ email: decryptedData.email, deletedAt: null });
    if (isUserExist && isUserExist.isEmailVerified) {
      // return this.error('This phone number is already exist!')
      return this.error('This email is already exist!')
    }
    const newUser = isUserExist || await this.customerModel.create({ fcmToken: decryptedData?.fcmToken || '', phone: decryptedData.phone, firstName: decryptedData.firstName , lastName:decryptedData?.lastName || '' , email:decryptedData?.email })
    // const otp = await this.otpService.sendOtp({
    //   req, reason: "registration", to: newUser.phone, type: "phone", userId: String(newUser._id), userType: 'customer'
    // })
    const otp = await this.otpService.sendOtp({
      req, reason: "registration", to: newUser.email, type: "email", userId: String(newUser._id), userType: 'customer'
    })
    if (otp.status) {
      return this.success(otp.message);
    } else {
      return this.error(otp.message)
    }
  }

  async attemptLogin(phone: number) {
    const user = await this.customerModel.findOne({ phone, deletedAt: null }).select(['name','phone','profile','isEmailVerified']).lean();
    const token = this.jwtService.sign({ _id: user._id, firstName: user.firstName, phone: user.phone });
    await this.accessTokenModel.deleteMany({userId:user._id});
    await this.accessTokenModel.create({
      accessToken: token,
      userId: user._id,
      userType:'customer'
    });

    return { user, token }
  }

  async verify(encryptedCredentials: string){
    const decryptedData: any = this.decrypt(encryptedCredentials);
    if (!decryptedData?.email && !decryptedData?.phone) {
      return this.error('The mobile number is required.');
    }
    if(!decryptedData?.otp){
      return this.error("The OTP is required.")
    }
    const user = await this.customerModel.findOne({phone:decryptedData.phone, deletedAt:null});
    if(!user){
      return this.error("The user is not exist.")
    }
    const otp = await this.otpService.verificationOtp({ otp:Number(decryptedData.otp),reason:user.isEmailVerified?"login":"registration",type:'phone',userId:String(user._id), userType:'customer' })
    if(otp.status){
      const data = await this.attemptLogin(user.phone);
      await user.updateOne({isEmailVerified:true});
      return this.success(user?.isEmailVerified?"Login successfully":"Registration successfully", data)
    }else{
      return this.error(otp.message);
    }
  }

  async resend(encryptedCredentials: string,req:Request){
    const decryptedData: any = this.decrypt(encryptedCredentials);
    if (!decryptedData?.email && !decryptedData?.phone) {
      return this.error('The mobile number is required.');
    }
    const user = await this.customerModel.findOne({phone:decryptedData.phone, deletedAt:null});
    if(!user){
      return this.error("The user is not exist.")
    }
    const otp = await this.otpService.resendOtp({ req,reason:user.isEmailVerified?"login":"registration",type:'phone',userId:String(user._id), userType:'customer',to:Number(decryptedData.phone)})
    if(otp.status){
      return this.success(otp.message)
    }else{
      return this.error(otp.message);
    }
  }

  async login(encryptedCredentials: string, req: Request) {
    const decryptedData: any = this.decrypt(encryptedCredentials);
    if (!decryptedData?.name && !decryptedData?.phone) {
      return this.error('The mobile number is required.');
    }
    const isUserExist = await this.customerModel.findOne({ phone: decryptedData.phone, deletedAt: null });
    if (!isUserExist.isEmailVerified) {
      return this.error('The user is not exist!')
    }
    const otp = await this.otpService.sendOtp({
      req, reason: "login", to: isUserExist.phone, type: "phone", userId: String(isUserExist._id), userType: 'customer'
    })
    if (otp.status) {
      return this.success(otp.message);
    } else {
      return this.error(otp.message)
    }
  }

  async getAll(){
    return await this.customerModel.find({deletedAt:null}).lean();
  }

  async getOne(id:string){
    return await this.customerModel.findOne({_id:id,deletedAt:null}).lean();
  }

  async remove(id:string,request:Request|any){
    return await this.customerModel.findByIdAndUpdate(id,{deletedAt:new Date(),deletedBy:request.userId || '',status:false},{new:true})
  }

  async findWithPagination(page: number, limit: number, search: string) {
    const skip = (page - 1) * limit;
    let query = {};
    if (search) {
      query = { 'firstName': { $regex: new RegExp(search, 'i') } };
    }
    const [data, total] = await Promise.all([
      this.customerModel.find({ ...query, deletedAt: null }).sort({ createdAt: -1 }).skip(skip).limit(limit).lean(),
      this.customerModel.countDocuments({ ...query, deletedAt: null }),
    ]);
    return {
      page: page,
      limit: limit,
      search: search,
      total: total,
      data: data,
    };
  }

  async handleStatus(id:string){
    const customer = await this.customerModel.findOne({_id:id,deletedAt:null});
    return await this.customerModel.findByIdAndUpdate(id,{status:!customer?.status},{new:true});
  }
}
