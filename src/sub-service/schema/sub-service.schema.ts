import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { HydratedDocument, Types } from "mongoose";
import { Admin } from "src/admin/schema/admin.schema";
import { Service } from "src/service/schema/service.schema";

@Schema({
    timestamps:true,
})
export class SubService {

    @Prop({type:String})
    name:string;

    @Prop({type:String})
    description:string;

    @Prop({type:String})
    icon:string;

    @Prop({type:Types.ObjectId,default: null,ref:"Service"})
    serviceId:Service;


    @Prop({type:Boolean, default: true})
    status: boolean;

    @Prop({type:Date,default: null})
    deletedAt:Date|null;

    @Prop({type:Types.ObjectId,default: null})
    deletedBy:string;
    
    @Prop({type:Types.ObjectId,default: null,ref:"Admin"})
    createdBy:Admin;

}

export const SubServiceSchema = SchemaFactory.createForClass(SubService);
export type SubServiceDocument = HydratedDocument<SubService>;
