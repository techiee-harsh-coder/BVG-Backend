import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { HydratedDocument, Schema as MongooseSchema } from "mongoose";
import { Admin } from "src/admin/schema/admin.schema";
import { Service } from "src/service/schema/service.schema";

@Schema({ timestamps: true })
export class Employee {
  @Prop({ type: String })
  name: string;

  @Prop({ type: String,default:"No Data Available" })
  about: string;

  @Prop({ type: [String] })
  language: string[];

  @Prop({ type: String })
  education: string;

  @Prop({ type: String, default: null })
  image: string;

  @Prop({ type: String, default: null })
  email: string;

  @Prop({ type: String, required: true })
  adhaarNo: string;

  @Prop({ type: Boolean, default: false })
  isAdhaarVerified: boolean;

  @Prop({ type: String, default: 0 })
  experience: string;

  @Prop({ type: [{ type: MongooseSchema.Types.ObjectId, ref: 'Service' }] })
  serviceId: Service[];

  @Prop({ type: String, default: 'Open for discussion' })
  salaryExpt: string;

  @Prop({ type: String, default: 'No Address Available' })
  address: string;

  @Prop({ type: { type: String, default: 'Point' }, coordinates: [Number] })
  location: { type: string; coordinates: number[] };

  @Prop({ type: String })
  phone: string;

  @Prop({ type: Boolean, default: true })
  status: boolean;

  @Prop({ type: Date, default: null })
  deletedAt: Date | null;

  @Prop({ type: MongooseSchema.Types.ObjectId, default: null, ref: 'Admin' })
  deletedBy: string;

  @Prop({ type: MongooseSchema.Types.ObjectId, default: null, ref: 'Admin' })
  createdBy: Admin;

  @Prop({ type: MongooseSchema.Types.ObjectId, default: null, ref: 'Admin' })
  updatedBy: Admin;
}

export const EmployeeSchema = SchemaFactory.createForClass(Employee);

export type EmployeeDocument = HydratedDocument<Employee>;
