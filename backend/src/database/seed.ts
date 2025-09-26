import { NestFactory } from '@nestjs/core';
import { AppModule } from '../app.module';
import { SeederService } from './seeders/seeder.service';

async function bootstrap() {
	const app = await NestFactory.createApplicationContext(AppModule);
	const seederService = app.get(SeederService);

	const command = process.argv[2];

	try {
		switch (command) {
			case 'all': {
				await seederService.seedAll();
				break;
			}
			case 'customers': {
				const customerCount = parseInt(process.argv[3]) || 25;
				await seederService.seedCustomers(customerCount);
				break;
			}
			case 'vehicles': {
				const vehicleCount = parseInt(process.argv[3]) || 20;
				await seederService.seedVehicles(vehicleCount);
				break;
			}
			case 'rentals': {
				const rentalCount = parseInt(process.argv[3]) || 40;
				await seederService.seedRentals(rentalCount);
				break;
			}
			case 'banks': {
				const bankCount = parseInt(process.argv[3]) || 10;
				await seederService.seedBanks(bankCount);
				break;
			}
			case 'legal-entities': {
				const legalEntityCount = parseInt(process.argv[3]) || 15;
				await seederService.seedLegalEntities(legalEntityCount);
				break;
			}
			case 'enterprises': {
				const enterpriseCount = parseInt(process.argv[3]) || 10;
				await seederService.seedEnterprises(enterpriseCount);
				break;
			}
			case 'agents': {
				const agentCount = parseInt(process.argv[3]) || 8;
				await seederService.seedAgents(agentCount);
				break;
			}
			case 'contracts': {
				const contractCount = parseInt(process.argv[3]) || 20;
				await seederService.seedContracts(contractCount);
				break;
			}
			case 'credit-agreements': {
				const creditCount = parseInt(process.argv[3]) || 25;
				await seederService.seedCreditAgreements(creditCount);
				break;
			}
			case 'bank-agents': {
				const bankAgentCount = parseInt(process.argv[3]) || 12;
				await seederService.seedBankAgents(bankAgentCount);
				break;
			}
			default: {
				console.log('Available commands:');
				console.log('  all                    - Seed all data');
				console.log(
					'  banks [n]              - Seed banks (default: 10)',
				);
				console.log(
					'  legal-entities [n]     - Seed legal entities (default: 15)',
				);
				console.log(
					'  enterprises [n]        - Seed enterprises (default: 10)',
				);
				console.log(
					'  agents [n]             - Seed agents (default: 8)',
				);
				console.log(
					'  contracts [n]          - Seed contracts (default: 20)',
				);
				console.log(
					'  credit-agreements [n]  - Seed credit agreements (default: 25)',
				);
				console.log(
					'  bank-agents [n]        - Seed bank agents (default: 12)',
				);
				console.log(
					'  customers [n]          - Seed customers (default: 25)',
				);
				console.log(
					'  vehicles [n]           - Seed vehicles (default: 20)',
				);
				console.log(
					'  rentals [n]            - Seed rentals (default: 40)',
				);
				break;
			}
		}
	} catch (error) {
		console.error('Seeding failed:', error);
		process.exit(1);
	} finally {
		await app.close();
	}
}

void bootstrap();
