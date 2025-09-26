import { Module } from '@nestjs/common';
import { RentalsService } from './rentals.service';
import { RentalsController } from './rentals.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Rent } from './entities/rent.entity';
import { Customer } from 'src/customers/entities/customer.entity';
import { Automobile } from 'src/vehicles/entities/automobile.entity';
import { AuthModule } from 'src/auth/auth.module';

@Module({
	imports: [
		AuthModule,
		TypeOrmModule.forFeature([Rent, Customer, Automobile]),
	],
	controllers: [RentalsController],
	providers: [RentalsService],
	exports: [RentalsService],
})
export class RentalsModule {}
