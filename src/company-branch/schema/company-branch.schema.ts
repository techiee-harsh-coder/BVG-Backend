import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument,Schema as MongooseSchema } from "mongoose";

@Schema({timestamps:true})
export class CompanyBranch {
  @Prop({ type: String, required: true })
  name: string;

  @Prop({ type: String, required: true })
  address: string;

  @Prop({type:Boolean,default:true})
  status:boolean

  @Prop({
    type:{
    name: { type: String, required: true },
    email: { type: String, required: true },
    phone: { type: String, required: true },
    },
    required: true,
    _id:false
  })
  contactPerson: { name: string; email: string; phone: string };

  @Prop({type:MongooseSchema.Types.ObjectId,ref:'Company',required:true})
  companyId:string

  @Prop({ type: Date, default: null })
  deletedAt: Date | null;

  @Prop({ type: MongooseSchema.Types.ObjectId, default: null, ref: 'Admin' })
  deletedBy: string;

  @Prop({ type: MongooseSchema.Types.ObjectId, default: null, ref: 'Admin' })
  createdBy: string;

  @Prop({ type: MongooseSchema.Types.ObjectId, default: null, ref: 'Admin' })
  updatedBy: string;
}

export const CompanyBranchSchema = SchemaFactory.createForClass(CompanyBranch);

export type CompanyBranchDocument = HydratedDocument<CompanyBranch>;
