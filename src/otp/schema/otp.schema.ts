import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { HydratedDocument, Types } from "mongoose";

@Schema({ timestamps: true })

export class Otp {
    @Prop({ type: String, default: "phone" })
    type: "email" | "phone";

    @Prop({ type: String, default: "customer" })
    userType: "customer" | "admin" | "serviceman";

    @Prop({ type: Number, required: true })
    otp: number;

    @Prop({ type: Types.ObjectId })
    userId: string;

    @Prop({type:String})
    reason:string;

    @Prop({ required: true, default: 1 })
    sentOtp: number;
    updatedAt:Date;
}

export const OtpSchema = SchemaFactory.createForClass(Otp);
export type OtpDocument  = HydratedDocument<Otp>;