import { IsNotEmpty, IsOptional, IsString } from "class-validator";

export class CreateServiceDto {
    @IsNotEmpty({message:"The name is required."})
    @IsString({message:"The name should be valid."})
    name:string;

    @IsNotEmpty({message:'the status is required.'})
    status:boolean;

    @IsOptional()
    @IsString({message:"The description should be valid."})
    description:string;

    icon:string;
    createdBy?:string;
    updatedBy?:string;
}
