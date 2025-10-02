import { Injectable, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { faker } from '@faker-js/faker';
import { Individual } from 'src/users/entities/individual.entity';
import { Customer } from 'src/customers/entities/customer.entity';
import { Fountain } from 'src/customers/entities/fountains.entity';
import { PasswordEncryption } from 'src/encryption/password-encryption.provider';
import { Role } from 'src/auth/roles/role.entity';

@Injectable()
export class CustomerSeeder {
	private readonly logger = new Logger(CustomerSeeder.name);

	constructor(
		@InjectRepository(Individual)
		private readonly individualRepository: Repository<Individual>,
		@InjectRepository(Customer)
		private readonly customerRepository: Repository<Customer>,
		@InjectRepository(Fountain)
		private readonly fountainRepository: Repository<Fountain>,
		private readonly passwordEncryption: PasswordEncryption,
	) {}

	async seed(
		count: number = 20,
	): Promise<{ customers: Customer[]; individuals: Individual[] }> {
		const customers: Customer[] = [];
		const individuals: Individual[] = [];

		faker.setDefaultRefDate('2024-01-01');

		for (let i = 0; i < count; i++) {
			const hashedPassword =
				await this.passwordEncryption.encrypt('123456789');

			const individual = this.individualRepository.create({
				name: faker.person.fullName(),
				email: faker.internet.email().toLowerCase(),
				password: hashedPassword,
				cpf: this.generateCPF(),
				profession: faker.person.jobTitle(),
				address: `${faker.location.streetAddress()}, ${faker.location.city()} - ${faker.location.state()}`,
				birthdate: faker.date.birthdate({
					min: 18,
					max: 70,
					mode: 'age',
				}),
				roles: [Role.CLIENT],
			});

			const savedIndividual =
				await this.individualRepository.save(individual);
			individuals.push(savedIndividual);

			const customer = this.customerRepository.create({
				email: savedIndividual.email,
				password: hashedPassword,
				roles: [Role.CLIENT],
				individual: savedIndividual,
			});

			const savedCustomer = await this.customerRepository.save(customer);
			customers.push(savedCustomer);

			const fountainCount = faker.number.int({ min: 1, max: 3 });
			for (let j = 0; j < fountainCount; j++) {
				const fountain = this.fountainRepository.create({
					employerEntity: faker.company.name(),
					output: faker.number.int({ min: 1000, max: 15000 }),
					customer: savedCustomer,
				});

				await this.fountainRepository.save(fountain);
			}
		}

		this.logger.log(
			`Created ${count} customers with their individuals and fountains`,
		);
		return { customers, individuals };
	}

	private generateCPF(): string {
		const timestamp = Date.now().toString();
		const cpf = timestamp.padStart(11, '0').slice(-11);
		return cpf;
	}
}
