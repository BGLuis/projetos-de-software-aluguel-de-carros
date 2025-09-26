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
import { VehiclesService } from './vehicles.service';
import { CreateAutomobileDto } from './dto/create-automobile.dto';
import { UpdateAutomobileDto } from './dto/update-automobile.dto';
import { JwtAuthGuard } from 'src/auth/guard/jwt-auth.guard';

@Controller('vehicles')
@UseGuards(JwtAuthGuard)
export class VehiclesController {
	constructor(private readonly vehiclesService: VehiclesService) {}

	@Post()
	create(@Body() createAutomobileDto: CreateAutomobileDto) {
		return this.vehiclesService.create(createAutomobileDto);
	}

	@Get()
	findAll() {
		return this.vehiclesService.findAll();
	}

	@Get(':id')
	findOne(@Param('id') id: string) {
		return this.vehiclesService.findOne(id);
	}

	@Patch(':id')
	update(
		@Param('id') id: string,
		@Body() updateAutomobileDto: UpdateAutomobileDto,
	) {
		return this.vehiclesService.update(id, updateAutomobileDto);
	}

	@Delete(':id')
	remove(@Param('id') id: string) {
		return this.vehiclesService.remove(id);
	}
}
