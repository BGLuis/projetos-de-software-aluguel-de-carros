import { PartialType } from '@nestjs/mapped-types';
import { CreateRentDto } from './create-rent.dto';
import { IsOptional, IsEnum } from 'class-validator';
import { OrderStatus } from 'src/vehicles/entities/order-status.enum';

export class UpdateRentDto extends PartialType(CreateRentDto) {
	@IsOptional()
	@IsEnum(OrderStatus)
	status?: OrderStatus;
}
