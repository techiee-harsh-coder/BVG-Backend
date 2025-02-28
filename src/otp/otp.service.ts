import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Otp, OtpDocument } from './schema/otp.schema';
import { Model } from 'mongoose';
import { DeleteOtpDto, ResendOtpDto, SendOtpDto, VerifyOtpDto } from './dto/all.dto';
import { randomInt } from 'crypto';
import { otpTemplate } from 'src/templates/email.templates';
import { getHost } from 'src/helper/start.helper';
import { sendMail } from 'src/helper/email.helper';
import { loginTemplate } from 'src/templates/sms.templates';
import { sendSms } from 'src/helper/sms.helper';

@Injectable()
export class OtpService {
    constructor(
        @InjectModel(Otp.name)
        private readonly otpModel:Model<OtpDocument>
    ){}

    async sendOtp(sendOtp: SendOtpDto): Promise<{ status: boolean, message: string }> {
        const today = new Date();
        today.setUTCHours(0, 0, 0, 0);
        const otpAttemptsToday = await this.otpModel.countDocuments({
            userId: sendOtp.userId,
            userType: sendOtp.userType,
            type: sendOtp.type,
            reason: sendOtp.reason,
            createdAt: { $gt: today },
        });
        if (otpAttemptsToday >= 15) {
          return { status: false, message: 'You have exceeded the maximum OTP attempts for today!' };
        }
        const newOtp = randomInt(100000, 999999);
        if (sendOtp?.type === 'email' && typeof sendOtp.to ==="string") {
          const host =sendOtp.req?getHost(sendOtp.req):"";
          const otpTemp = otpTemplate(newOtp, host);
          sendMail({
            email: sendOtp.to,
            subject: 'OTP Verification',
            html: otpTemp,
          });
        } else {
          const templates =  loginTemplate(newOtp);
          await sendSms(String(sendOtp.to), templates);
        }
        await this.otpModel.create({ otp: newOtp, sentOtp: 1, reason: sendOtp.reason, userId: sendOtp.userId, userType: sendOtp.userType, type:sendOtp.type});
        return { status: true, message: 'OTP sent successfully!' };
      }
      async verificationOtp(verifyOtpDto: VerifyOtpDto): Promise<{ status: boolean, message: string }> {
        const otp = await this.otpModel.findOne({
            userId: verifyOtpDto.userId,
            otp: verifyOtpDto.otp,
            userType: verifyOtpDto.userType,
            reason: verifyOtpDto.reason,
            type:verifyOtpDto.type
        });
    
        if (!otp) {
          return { status: false, message: 'The OTP is invalid!' };
        }
    
        const tenMinutesAgo = new Date(new Date().getTime() - 10 * 60 * 1000);
        if (otp?.updatedAt < tenMinutesAgo) {
          return { status: false, message: 'OTP has expired!' };
        }
        await this.otpModel.deleteMany({
            userId: verifyOtpDto.userId,
            userType: verifyOtpDto.userType,
            reason: verifyOtpDto.reason,
            type:verifyOtpDto.type
        });
    
        return { status: true, message: "The OTP has been matched successfully" };
      }
      async resendOtp(resendOtp: ResendOtpDto): Promise<{ status: boolean, message: string }> {
        const data = await this.otpModel.findOne( {
          userId: String(resendOtp.userId),
          userType: resendOtp.userType,
          type: resendOtp.type,
          reason: resendOtp.reason,
          sentOtp: { $lte: 5 },
        }
      ).sort({ createdAt: -1 });
        if (!data) {
          return { status: false, message: 'You have reached the maximum number of OTP resend!' };
        }
        const newOtp = randomInt(100000, 999999);
        if (resendOtp?.type === 'email' && typeof resendOtp.to ==="string") {
            const host =resendOtp.req?getHost(resendOtp.req):"";
          const otpTemp = otpTemplate(newOtp, host);
          sendMail({
            email: resendOtp.to,
            subject: 'OTP Verification',
            html: otpTemp,
          })
        } else {
          const templates = loginTemplate(newOtp)
          await sendSms(String(resendOtp.to), templates);
          
        }
        await data.updateOne({sentOtp:data.sentOtp+1,otp:newOtp})
        return { status: true, message: 'A new OTP sent successfully!' };
      }
      async deleteOtp(deleteOtp: DeleteOtpDto): Promise<{ status: boolean, message: string }> {
        const result = await this.otpModel.deleteMany({ ...deleteOtp });
        if (result) {
          return { status: true, message: 'OTP deleted successfully' };
        } else {
          return { status: false, message: 'OTP not found' };
        }
      }
}
