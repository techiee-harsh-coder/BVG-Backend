import { IsArray, IsEmail, IsMongoId, IsNotEmpty, IsNumber, IsObject, IsOptional, IsString, Matches, ValidateNested } from "class-validator";
import { Admin } from "src/admin/schema/admin.schema";

export class LocationDto {
  type: string;

  @IsNotEmpty({ message: 'Coordinates are required' })
  @IsArray({ message: 'Coordinates must be an array' })
  @IsNumber(
    {},
    {
      each: true,
      message: 'Each item in the coordinates array must be a number',
    },
  )
  coordinates: number[];
}

export class CreateEmployeeDto {
  @IsNotEmpty({ message: 'Name is required' })
  @IsString()
  name: string;

  @IsOptional()
  salaryExpt: string;

  @IsNotEmpty({ message: 'Address is required' })
  @IsString()
  address: string;

  @IsOptional()
  about: string;

  @IsNotEmpty({ message: 'Education is required' })
  @IsString()
  education: string;

  @IsOptional()
  email: string;

  @IsOptional()
  experience: string;

  @IsNotEmpty({ message: 'Phone Number is required' })
  @Matches(/^\d{10}$/, {
    message: 'Enter Valid Phone Number',
  })
  phone: string;

  @IsNotEmpty({ message: 'Service Info. is required' })
  @IsArray()
  serviceId: string[];

  @IsNotEmpty({ message: 'Language is required' })
  @IsArray()
  language: string[];

  @IsNotEmpty({ message: 'Location is required' })
  @IsObject({ message: 'Location must be an object' })
  location: LocationDto;

  @IsOptional()
  status: boolean;

  @IsNotEmpty({ message: 'Adhaar Number is required' })
  @Matches(/^\d{12}$/, {
    message: 'Enter Valid Adhaar Number',
  })
  adhaarNo: string;

  @IsOptional()
  isAdhaarVerified: boolean;

  image?: string;
  deletedAt?: Date | null;
  deletedBy?: string;
  createdBy?: Admin;
  updatedBy?: Admin;
}
