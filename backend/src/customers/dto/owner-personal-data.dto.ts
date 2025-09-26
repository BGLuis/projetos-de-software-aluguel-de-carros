import { IsOptional, IsEmail, IsArray, IsUUID } from 'class-validator';
import { Role } from 'src/auth/roles/role.entity';

export class OwnerPersonalDataDto {
	@IsUUID()
	id: string;

	@IsEmail()
	email: string;

	@IsArray()
	@IsOptional()
	roles?: Role[];

	@IsOptional()
	individual?: {
		id: string;
		name: string;
		email: string;
		address: string;
		cpf: string;
		profession: string;
		birthdate?: Date;
	};

	@IsOptional()
	legalEntity?: {
		id: string;
		cnpj: string;
		companyName: string;
		address: string;
	};

	@IsOptional()
	fountains?: {
		id: string;
		employerEntity: string;
		output: number;
	}[];
}
