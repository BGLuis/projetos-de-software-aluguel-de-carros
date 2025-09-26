import { Injectable, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { faker } from '@faker-js/faker';
import { Bank } from 'src/banking/entities/bank.entity';

@Injectable()
export class BankSeeder {
	private readonly logger = new Logger(BankSeeder.name);

	constructor(
		@InjectRepository(Bank)
		private readonly bankRepository: Repository<Bank>,
	) {}

	async seed(count: number = 10): Promise<Bank[]> {
		const banks: Bank[] = [];

		const brazilianBanks = [
			{ name: 'Banco do Brasil', code: '001' },
			{ name: 'Banco Bradesco', code: '237' },
			{ name: 'Banco Itaú', code: '341' },
			{ name: 'Banco Santander', code: '033' },
			{ name: 'Caixa Econômica Federal', code: '104' },
			{ name: 'Banco BTG Pactual', code: '208' },
			{ name: 'Banco Safra', code: '422' },
			{ name: 'Banco Votorantim', code: '655' },
			{ name: 'Banco Original', code: '212' },
			{ name: 'Banco Inter', code: '077' },
			{ name: 'Nubank', code: '260' },
			{ name: 'Banco C6', code: '336' },
			{ name: 'Banco Pan', code: '623' },
			{ name: 'Banco Pine', code: '643' },
			{ name: 'Banco BMG', code: '318' },
		];

		const selectedBanks = faker.helpers.arrayElements(
			brazilianBanks,
			Math.min(count, brazilianBanks.length),
		);

		for (const bankData of selectedBanks) {
			const bank = this.bankRepository.create({
				name: bankData.name,
				code: bankData.code,
			});

			const savedBank = await this.bankRepository.save(bank);
			banks.push(savedBank);
		}

		this.logger.log(`Created ${banks.length} banks`);
		return banks;
	}
}
