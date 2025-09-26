import { Injectable, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { faker } from '@faker-js/faker';
import { Automobile } from 'src/vehicles/entities/automobile.entity';

@Injectable()
export class VehicleSeeder {
	private readonly logger = new Logger(VehicleSeeder.name);

	constructor(
		@InjectRepository(Automobile)
		private readonly automobileRepository: Repository<Automobile>,
	) {}

	async seed(count: number = 15): Promise<Automobile[]> {
		const vehicles: Automobile[] = [];

		const brands = [
			'Toyota',
			'Volkswagen',
			'Ford',
			'Chevrolet',
			'Honda',
			'Hyundai',
			'Nissan',
			'BMW',
			'Mercedes-Benz',
			'Audi',
		];

		const models = {
			Toyota: ['Corolla', 'Camry', 'RAV4', 'Prius', 'Hilux'],
			Volkswagen: ['Golf', 'Jetta', 'Tiguan', 'Passat', 'Polo'],
			Ford: ['Focus', 'Fiesta', 'EcoSport', 'Ranger', 'Ka'],
			Chevrolet: ['Onix', 'Cruze', 'Tracker', 'S10', 'Prisma'],
			Honda: ['Civic', 'Accord', 'CR-V', 'Fit', 'HR-V'],
			Hyundai: ['HB20', 'Elantra', 'Tucson', 'Creta', 'i30'],
			Nissan: ['Versa', 'Sentra', 'X-Trail', 'March', 'Kicks'],
			BMW: ['320i', 'X3', 'X5', 'Serie 1', 'Serie 3'],
			'Mercedes-Benz': ['C-Class', 'E-Class', 'GLA', 'A-Class', 'CLA'],
			Audi: ['A3', 'A4', 'Q3', 'Q5', 'A1'],
		};

		const colors = [
			'Branco',
			'Preto',
			'Prata',
			'Cinza',
			'Azul',
			'Vermelho',
			'Bege',
			'Marrom',
			'Verde',
			'Amarelo',
		];

		for (let i = 0; i < count; i++) {
			const brand = faker.helpers.arrayElement(brands);
			const brandModels =
				models[brand as keyof typeof models] || models.Toyota;
			const model = faker.helpers.arrayElement(brandModels);
			const color = faker.helpers.arrayElement(colors);
			const year = faker.number.int({ min: 2015, max: 2024 });

			const automobile = this.automobileRepository.create({
				plate: this.generatePlate(),
				chassi: this.generateChassi(),
				renavam: this.generateRenavam(),
				brand,
				model,
				year,
				color,
				dailyRate: faker.number.float({
					min: 80,
					max: 500,
					fractionDigits: 2,
				}),
				category: faker.helpers.arrayElement([
					'Econômico',
					'Compacto',
					'Intermediário',
					'Executivo',
					'SUV',
					'Pickup',
				]),
				available: true,
			});

			const savedVehicle =
				await this.automobileRepository.save(automobile);
			vehicles.push(savedVehicle);
		}

		this.logger.log(`Created ${count} vehicles`);
		return vehicles;
	}

	private generatePlate(): string {
		const letters = faker.string.alpha({ length: 3 }).toUpperCase();
		const numbers = faker.string.numeric(4);
		return `${letters}-${numbers}`;
	}

	private generateChassi(): string {
		const timestamp = Date.now().toString().slice(-8);
		const remaining = faker.string.alphanumeric(9).toUpperCase();
		return `${timestamp}${remaining}`;
	}

	private generateRenavam(): string {
		const timestamp = Date.now().toString().slice(-6);
		const remaining = faker.string.numeric(5);
		return `${timestamp}${remaining}`;
	}
}
