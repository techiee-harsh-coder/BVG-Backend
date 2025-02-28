import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { HydratedDocument, Types } from "mongoose";

@Schema({
    timestamps:true,
})
export class Customer {

    @Prop({type:String})
    firstName:string;

    @Prop({type:String,default:""})
    lastName:string;

    @Prop({type:Number, required:true})
    phone:number;

    @Prop({type:String,required:true})
    email:string;

    @Prop({type:String,default:""})
    profilePic:string;

    @Prop({type:String, default:null})
    fcmToken:string;

    @Prop({type:Boolean, default: true})
    status: boolean;

    @Prop({type:Boolean, default: false})
    // isPhoneVerified: boolean;
    isEmailVerified: boolean;

    @Prop({type:Date,default: null})
    deletedAt:Date|null;

    @Prop({type:Types.ObjectId,default: null})
    deletedBy:string;

}

export const CustomerSchema = SchemaFactory.createForClass(Customer);
export type CustomerDocument = HydratedDocument<Customer>;