import { Injectable, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { faker } from '@faker-js/faker';
import { Enterprise } from 'src/customers/entities/enterprise.entity';
import { LegalEntity } from 'src/customers/entities/legal-entity.entity';

@Injectable()
export class EnterpriseSeeder {
	private readonly logger = new Logger(EnterpriseSeeder.name);

	constructor(
		@InjectRepository(Enterprise)
		private readonly enterpriseRepository: Repository<Enterprise>,
		@InjectRepository(LegalEntity)
		private readonly legalEntityRepository: Repository<LegalEntity>,
	) {}

	async seed(count: number = 10): Promise<Enterprise[]> {
		const enterprises: Enterprise[] = [];

		const legalEntities = await this.legalEntityRepository.find();

		if (legalEntities.length === 0) {
			this.logger.warn(
				'No legal entities found. Please run legal-entity seeder first.',
			);
			return enterprises;
		}

		for (let i = 0; i < count && i < legalEntities.length; i++) {
			const legalEntity = legalEntities[i];

			const enterprise = this.enterpriseRepository.create({
				legalEntity,
				identification: faker.string.alphanumeric(10).toUpperCase(),
			});

			const savedEnterprise =
				await this.enterpriseRepository.save(enterprise);
			enterprises.push(savedEnterprise);
		}

		this.logger.log(`Created ${enterprises.length} enterprises`);
		return enterprises;
	}
}
