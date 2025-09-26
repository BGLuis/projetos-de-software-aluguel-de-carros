import { Injectable, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { BankAgent } from 'src/banking/entities/bank-agent.entity';
import { CreditAgreement } from 'src/banking/entities/credit-agreement.entity';

@Injectable()
export class BankAgentSeeder {
	private readonly logger = new Logger(BankAgentSeeder.name);

	constructor(
		@InjectRepository(BankAgent)
		private readonly bankAgentRepository: Repository<BankAgent>,
		@InjectRepository(CreditAgreement)
		private readonly creditAgreementRepository: Repository<CreditAgreement>,
	) {}

	async seed(count: number = 12): Promise<BankAgent[]> {
		const bankAgents: BankAgent[] = [];

		const creditAgreements = await this.creditAgreementRepository.find();

		if (creditAgreements.length === 0) {
			this.logger.warn(
				'No credit agreements found. Please run credit-agreement seeder first.',
			);
			return bankAgents;
		}

		const actualCount = Math.min(count, creditAgreements.length);

		for (let i = 0; i < actualCount; i++) {
			const grantedCredit = creditAgreements[i];

			const bankAgent = this.bankAgentRepository.create({
				grantedCredit,
			});

			const savedBankAgent =
				await this.bankAgentRepository.save(bankAgent);
			bankAgents.push(savedBankAgent);
		}

		this.logger.log(
			`Created ${actualCount} bank agents (limited by available credit agreements: ${creditAgreements.length})`,
		);
		return bankAgents;
	}
}
