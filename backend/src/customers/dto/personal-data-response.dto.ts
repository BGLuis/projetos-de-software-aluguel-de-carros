import { Type } from 'class-transformer';
import {
	IsUUID,
	IsEmail,
	IsArray,
	IsOptional,
	ValidateNested,
} from 'class-validator';
import { Role } from 'src/auth/roles/role.entity';

class IndividualDataDto {
	@IsUUID()
	id: string;

	@IsOptional()
	name?: string;

	@IsEmail()
	@IsOptional()
	email?: string;

	@IsOptional()
	address?: string;

	@IsOptional()
	cpf?: string;

	@IsOptional()
	profession?: string;

	@IsOptional()
	birthdate?: Date;
}

class LegalEntityDataDto {
	@IsUUID()
	id: string;

	@IsOptional()
	cnpj?: string;

	@IsOptional()
	companyName?: string;

	@IsOptional()
	address?: string;
}

export class PersonalDataResponseDto {
	@IsUUID()
	id: string;

	@IsEmail()
	email: string;

	@IsArray()
	@IsOptional()
	roles?: Role[];

	@ValidateNested()
	@Type(() => IndividualDataDto)
	@IsOptional()
	individual?: IndividualDataDto;

	@ValidateNested()
	@Type(() => LegalEntityDataDto)
	@IsOptional()
	legalEntity?: LegalEntityDataDto;
}
