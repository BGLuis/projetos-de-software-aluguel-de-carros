import { Injectable, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { faker } from '@faker-js/faker';
import { Rent } from 'src/rentals/entities/rent.entity';
import { Customer } from 'src/customers/entities/customer.entity';
import { Automobile } from 'src/vehicles/entities/automobile.entity';
import { OrderStatus } from 'src/vehicles/entities/order-status.enum';

@Injectable()
export class RentSeeder {
	private readonly logger = new Logger(RentSeeder.name);

	constructor(
		@InjectRepository(Rent)
		private readonly rentRepository: Repository<Rent>,
		@InjectRepository(Customer)
		private readonly customerRepository: Repository<Customer>,
		@InjectRepository(Automobile)
		private readonly automobileRepository: Repository<Automobile>,
	) {}

	async seed(count: number = 30): Promise<Rent[]> {
		const rents: Rent[] = [];

		const customers = await this.customerRepository.find();
		const vehicles = await this.automobileRepository.find();

		if (customers.length === 0 || vehicles.length === 0) {
			this.logger.warn(
				'No customers or vehicles found. Please run customer and vehicle seeders first.',
			);
			return rents;
		}

		const statuses = Object.values(OrderStatus);

		for (let i = 0; i < count; i++) {
			const customer = faker.helpers.arrayElement(customers);
			const vehicle = faker.helpers.arrayElement(vehicles);
			const status = faker.helpers.arrayElement(statuses);

			const startDate = faker.date.between({
				from: '2024-01-01',
				to: '2024-12-31',
			});

			const endDate = faker.date.soon({
				days: faker.number.int({ min: 1, max: 30 }),
				refDate: startDate,
			});

			const days = Math.ceil(
				(endDate.getTime() - startDate.getTime()) /
					(1000 * 60 * 60 * 24),
			);
			const totalAmount = days * vehicle.dailyRate;

			const rent = this.rentRepository.create({
				client: customer,
				automobile: vehicle,
				data: startDate,
				value: totalAmount,
				status,
			});

			const savedRent = await this.rentRepository.save(rent);
			rents.push(savedRent);
		}

		this.logger.log(`Created ${count} rentals`);
		return rents;
	}
}
