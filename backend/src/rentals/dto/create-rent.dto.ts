import { IsString, IsOptional, IsEnum, IsNumber, Min } from 'class-validator';
import { OrderStatus } from 'src/vehicles/entities/order-status.enum';

export class CreateRentDto {
	@IsString()
	customerId: string;

	@IsString()
	automobileId: string;

	@IsOptional()
	@IsEnum(OrderStatus)
	status?: OrderStatus = OrderStatus.ON_ANALYSIS;

	@IsNumber()
	@Min(0)
	value: number;
}
