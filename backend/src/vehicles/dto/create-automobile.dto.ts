import { IsString } from 'class-validator';

export class CreateAutomobileDto {
	@IsString()
	plate: string;

	@IsString()
	brand: string;

	@IsString()
	model: string;

	@IsString()
	chassi: string;

	@IsString()
	renavam: string;
}
