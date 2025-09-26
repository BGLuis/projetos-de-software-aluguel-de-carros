import { IsString, IsNumber } from 'class-validator';

export class CreateFountainDto {
	@IsString()
	employerEntity: string;

	@IsNumber()
	output: number;
}
