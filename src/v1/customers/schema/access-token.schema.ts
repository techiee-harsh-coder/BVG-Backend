import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { HydratedDocument, Types } from "mongoose";

@Schema({
    timestamps:true,
})
export class AccessToken {

    @Prop({type:String})
    accessToken:string;
    
    @Prop({type:Types.ObjectId, required:true})
    userId:string;

    @Prop({type:String})
    userType:"admin"|'serviceman'|'customer'

}

export const AccessTokenSchema = SchemaFactory.createForClass(AccessToken);

export type AccessTokenDocument = HydratedDocument<AccessToken>;