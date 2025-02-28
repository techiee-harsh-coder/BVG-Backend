import { Request } from "express";

export class SendOtpDto{
    userId:string;
    reason:string="login";  
    userType:"customer" | "admin" | "serviceman";
    type:"email" | "phone";
    to:string|number;
    req?:Request;
}

export class VerifyOtpDto{
    otp:number;
    userId:string;
    reason:string="login";
    userType:"customer" | "admin" | "serviceman";
    type:"email" | "phone";
}

export class ResendOtpDto{
    userId:string;
    reason:string="login";
    userType:"customer" | "admin" | "serviceman";
    type:"email" | "phone";
    to:string|number;
    req?:Request;
}
export class DeleteOtpDto{
    userId:string;
    reason:string="login";
    userType:"customer" | "admin" | "serviceman";
    type:"email" | "phone";
}