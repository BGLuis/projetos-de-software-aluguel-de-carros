import { Injectable, Logger } from '@nestjs/common';
import { CustomerSeeder } from './customer.seeder';
import { VehicleSeeder } from './vehicle.seeder';
import { RentSeeder } from './rent.seeder';
import { BankSeeder } from './bank.seeder';
import { BankAgentSeeder } from './bank-agent.seeder';
import { CreditAgreementSeeder } from './credit-agreement.seeder';
import { ContractSeeder } from './contract.seeder';
import { AgentSeeder } from './agent.seeder';
import { LegalEntitySeeder } from './legal-entity.seeder';
import { EnterpriseSeeder } from './enterprise.seeder';

@Injectable()
export class SeederService {
	private readonly logger = new Logger(SeederService.name);
	constructor(
		private readonly customerSeeder: CustomerSeeder,
		private readonly vehicleSeeder: VehicleSeeder,
		private readonly rentSeeder: RentSeeder,
		private readonly bankSeeder: BankSeeder,
		private readonly legalEntitySeeder: LegalEntitySeeder,
		private readonly enterpriseSeeder: EnterpriseSeeder,
		private readonly agentSeeder: AgentSeeder,
		private readonly contractSeeder: ContractSeeder,
		private readonly creditAgreementSeeder: CreditAgreementSeeder,
		private readonly bankAgentSeeder: BankAgentSeeder,
	) {}

	async seedAll(): Promise<void> {
		this.logger.log('Starting database seeding...');

		try {
			this.logger.log('1. Seeding banks...');
			await this.bankSeeder.seed(10);

			this.logger.log('2. Seeding legal entities...');
			await this.legalEntitySeeder.seed(15);

			this.logger.log('3. Seeding enterprises...');
			await this.enterpriseSeeder.seed(10);

			this.logger.log('4. Seeding agents...');
			await this.agentSeeder.seed(8);

			this.logger.log('5. Seeding contracts...');
			await this.contractSeeder.seed(20);

			this.logger.log('6. Seeding credit agreements...');
			await this.creditAgreementSeeder.seed(25);

			this.logger.log('7. Seeding bank agents...');
			await this.bankAgentSeeder.seed(10);

			this.logger.log('8. Seeding customers...');
			await this.customerSeeder.seed(25);

			this.logger.log('9. Seeding vehicles...');
			await this.vehicleSeeder.seed(20);

			this.logger.log('10. Seeding rentals...');
			await this.rentSeeder.seed(40);

			this.logger.log('Database seeding completed successfully!');
		} catch (error) {
			this.logger.error('❌ Error during seeding:', error);
			throw error;
		}
	}

	async seedBanks(count?: number): Promise<void> {
		this.logger.log('🌱 Seeding banks...');
		await this.bankSeeder.seed(count);
	}

	async seedLegalEntities(count?: number): Promise<void> {
		this.logger.log('🌱 Seeding legal entities...');
		await this.legalEntitySeeder.seed(count);
	}

	async seedEnterprises(count?: number): Promise<void> {
		this.logger.log('🌱 Seeding enterprises...');
		await this.enterpriseSeeder.seed(count);
	}

	async seedAgents(count?: number): Promise<void> {
		this.logger.log('🌱 Seeding agents...');
		await this.agentSeeder.seed(count);
	}

	async seedContracts(count?: number): Promise<void> {
		this.logger.log('🌱 Seeding contracts...');
		await this.contractSeeder.seed(count);
	}

	async seedCreditAgreements(count?: number): Promise<void> {
		this.logger.log('🌱 Seeding credit agreements...');
		await this.creditAgreementSeeder.seed(count);
	}

	async seedBankAgents(count?: number): Promise<void> {
		this.logger.log('🌱 Seeding bank agents...');
		await this.bankAgentSeeder.seed(count);
	}

	async seedCustomers(count?: number): Promise<void> {
		this.logger.log('🌱 Seeding customers...');
		await this.customerSeeder.seed(count);
	}

	async seedVehicles(count?: number): Promise<void> {
		this.logger.log('🌱 Seeding vehicles...');
		await this.vehicleSeeder.seed(count);
	}

	async seedRentals(count?: number): Promise<void> {
		this.logger.log('🌱 Seeding rentals...');
		await this.rentSeeder.seed(count);
	}
}
