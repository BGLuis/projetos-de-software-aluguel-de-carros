import {
	IsString,
	IsArray,
	ValidateNested,
	ArrayMinSize,
	ArrayMaxSize,
	IsEmail,
} from 'class-validator';
import { Type } from 'class-transformer';
import { CreateFountainDto } from './create-fountain.dto';
import { SignUpAuthDto } from 'src/auth/dto/signup-auth.dto';

export class CreateCustomerDto extends SignUpAuthDto {
	@IsString()
	address: string;

	@IsString()
	rg: string;

	@IsString()
	cpf: string;

	@IsString()
	profession: string;

	@IsArray()
	@ValidateNested({ each: true })
	@Type(() => CreateFountainDto)
	@ArrayMinSize(1)
	@ArrayMaxSize(3)
	fountains: CreateFountainDto[];
}
