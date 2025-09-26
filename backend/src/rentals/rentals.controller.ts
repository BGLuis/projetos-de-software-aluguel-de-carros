import {
	Controller,
	Get,
	Post,
	Body,
	Patch,
	Param,
	Delete,
	UseGuards,
} from '@nestjs/common';
import { RentalsService } from './rentals.service';
import { CreateRentDto } from './dto/create-rent.dto';
import { UpdateRentDto } from './dto/update-rent.dto';
import { JwtAuthGuard } from 'src/auth/guard/jwt-auth.guard';

@Controller('rentals')
@UseGuards(JwtAuthGuard)
export class RentalsController {
	constructor(private readonly rentalsService: RentalsService) {}

	@Post()
	create(@Body() createRentDto: CreateRentDto) {
		return this.rentalsService.create(createRentDto);
	}

	@Get()
	findAll() {
		return this.rentalsService.findAll();
	}

	@Get('customer/:customerId')
	findByCustomer(@Param('customerId') customerId: string) {
		return this.rentalsService.findByCustomer(customerId);
	}

	@Get(':id')
	findOne(@Param('id') id: string) {
		return this.rentalsService.findOne(id);
	}

	@Patch(':id')
	update(@Param('id') id: string, @Body() updateRentDto: UpdateRentDto) {
		return this.rentalsService.update(id, updateRentDto);
	}

	@Delete(':id')
	remove(@Param('id') id: string) {
		return this.rentalsService.remove(id);
	}
}
