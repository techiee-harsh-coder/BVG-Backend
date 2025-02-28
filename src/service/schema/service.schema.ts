import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { HydratedDocument, Types } from "mongoose";
import { Admin } from "src/admin/schema/admin.schema";

@Schema({
  timestamps: true,
})
export class Service {
  @Prop({ type: String })
  name: string;

  @Prop({ type: String, default: "No description available" })
  description: string;

  @Prop({ type: String,default:null })
  icon: string;

  @Prop({ type: Boolean, default: true })
  status: boolean;

  @Prop({ type: Date, default: null })
  deletedAt: Date | null;

  @Prop({ type: Types.ObjectId, default: null })
  deletedBy: string;

  @Prop({ type: Types.ObjectId, default: null, ref: 'Admin' })
  createdBy: Admin;
}

export const ServiceSchema = SchemaFactory.createForClass(Service);
export type ServiceDocument = HydratedDocument<Service>;
