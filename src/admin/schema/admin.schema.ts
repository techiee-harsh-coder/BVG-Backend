import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { HydratedDocument, Types } from "mongoose";

@Schema({
    timestamps:true,
})
export class Admin {

    @Prop({type:String})
    name:string;

    @Prop({type:String, required:true})
    password:string;

    @Prop({type:String})
    email:string;

    @Prop({type:String})
    profile:string;

    @Prop({type:Types.ObjectId, default:null})
    roleId:string;

    @Prop({type:Boolean, default: true})
    status: boolean;

    @Prop({type:Date,default: null})
    deletedAt:Date|null;

    @Prop({type:Types.ObjectId,default: null})
    deletedBy:string;

}

export const AdminSchema = SchemaFactory.createForClass(Admin);
export type AdminDocument = HydratedDocument<Admin>;
