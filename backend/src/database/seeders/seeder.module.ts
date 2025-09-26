import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { SeederService } from './seeder.service';

// Seeders
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

// Entities
import { Individual } from 'src/users/entities/individual.entity';
import { Customer } from 'src/customers/entities/customer.entity';
import { Fountain } from 'src/customers/entities/fountains.entity';
import { Automobile } from 'src/vehicles/entities/automobile.entity';
import { Rent } from 'src/rentals/entities/rent.entity';
import { Bank } from 'src/banking/entities/bank.entity';
import { BankAgent } from 'src/banking/entities/bank-agent.entity';
import { CreditAgreement } from 'src/banking/entities/credit-agreement.entity';
import { Contract } from 'src/contracts/entities/contract.entity';
import { Agent } from 'src/contracts/entities/agent.entity';
import { LegalEntity } from 'src/customers/entities/legal-entity.entity';
import { Enterprise } from 'src/customers/entities/enterprise.entity';

import { EncryptionModule } from 'src/encryption/encryption.module';

@Module({
	imports: [
		TypeOrmModule.forFeature([
			Individual,
			Customer,
			Fountain,
			LegalEntity,
			Enterprise,
			Automobile,
			Rent,
			Bank,
			BankAgent,
			CreditAgreement,
			Contract,
			Agent,
		]),
		EncryptionModule,
	],
	providers: [
		SeederService,
		CustomerSeeder,
		VehicleSeeder,
		RentSeeder,
		BankSeeder,
		BankAgentSeeder,
		CreditAgreementSeeder,
		ContractSeeder,
		AgentSeeder,
		LegalEntitySeeder,
		EnterpriseSeeder,
	],
	exports: [SeederService],
})
export class SeederModule {}
