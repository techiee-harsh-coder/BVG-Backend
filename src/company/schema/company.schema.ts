import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument, Schema as MongooseSchema } from 'mongoose';
import { Admin } from 'src/admin/schema/admin.schema';
import { CompanyBranch } from 'src/company-branch/schema/company-branch.schema';

@Schema({ timestamps: true })
export class Company {
  @Prop({ type: String, required: true })
  name: string;

  @Prop({ type: String, required: true })
  email: string;

  @Prop({ type: String, required: true })
  address: string;

  @Prop({ type: String, default: '' })
  logo: string;

  @Prop({ type: String, default: '' })
  gstNumber: string;

  @Prop({ type: Boolean, default: true })
  status: boolean;

  @Prop({
    type: [{ type: MongooseSchema.Types.ObjectId, ref: 'CompanyBranch' }],
    default: [],
  })
  branchId: CompanyBranch[];

  @Prop({ type: String, required:true })
  phone: string;

  @Prop({
    type: {
      name: { type: String, required: true },
      email: { type: String, required: true },
      phone: { type: String, required: true },
    },
    required: true,
    _id:false
  })
  contactPerson: { name: string; email: string; phone: string };

  @Prop({ type: Date, default: null })
  deletedAt: Date | null;

  @Prop({ type: MongooseSchema.Types.ObjectId, default: null, ref: 'Admin' })
  deletedBy: string;

  @Prop({ type: MongooseSchema.Types.ObjectId, default: null, ref: 'Admin' })
  createdBy: string;

  @Prop({ type: MongooseSchema.Types.ObjectId, default: null, ref: 'Admin' })
  updatedBy: string;
}

export const CompanySchema = SchemaFactory.createForClass(Company);

export type CompanyDocument = HydratedDocument<Company>;
