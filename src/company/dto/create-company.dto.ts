import { Type } from 'class-transformer';
import {
  IsArray,
  IsEmail,
  IsNotEmpty,
  IsOptional,
  Matches,
  ValidateNested,
} from 'class-validator';

export class ContactPersonDto {
  @IsNotEmpty({ message: 'Contact Person Name is required' })
  name: string;

  @IsNotEmpty({ message: 'Contact Person Email is required' })
  @IsEmail({},{message:"Enter valid email"})
  email: string;

  @IsNotEmpty({ message: 'Contact Person Phone number required' })
  @Matches(/^\d{10}$/, {
    message: 'Phone number must contain exactly 10 digits',
  })
  phone: string;
}

export class CreateCompanyDto {
  @IsNotEmpty({ message: 'Name is required' })
  name: string;

  @IsNotEmpty({ message: 'Email is required' })
  @IsEmail()
  email: string;

  @IsNotEmpty({ message: 'Address is required' })
  address: string;

  @IsOptional()
  @IsArray()
  branchId: string[];

  @IsNotEmpty({ message: 'Phone number is required' })
  @Matches(/^\d{10}$/, {
    message: 'Phone number must contain exactly 10 digits',
  })
  phone: string;

  @IsNotEmpty({ message: 'Contact Person details are required' })
  @ValidateNested()
  @Type(()=>ContactPersonDto)
  contactPerson: ContactPersonDto;

  @IsOptional()
  gstNumber: string;

  @IsOptional()
  status: boolean;

  logo?: string;
  deletedAt?: Date | null;
  deletedBy?: string;
  createdBy?: string;
  updatedBy?: string;
}
