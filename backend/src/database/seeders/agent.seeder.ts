import { Injectable, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { faker } from '@faker-js/faker';
import { Agent } from 'src/contracts/entities/agent.entity';
import { LegalEntity } from 'src/customers/entities/legal-entity.entity';
import { Role } from 'src/auth/roles/role.entity';
import { PasswordEncryption } from 'src/encryption/password-encryption.provider';

@Injectable()
export class AgentSeeder {
	private readonly logger = new Logger(AgentSeeder.name);

	constructor(
		@InjectRepository(Agent)
		private readonly agentRepository: Repository<Agent>,
		@InjectRepository(LegalEntity)
		private readonly legalEntityRepository: Repository<LegalEntity>,
		private readonly passwordEncryption: PasswordEncryption,
	) {}

	async seed(count: number = 8): Promise<Agent[]> {
		const agents: Agent[] = [];

		const legalEntities = await this.legalEntityRepository.find();

		if (legalEntities.length === 0) {
			this.logger.warn(
				'No legal entities found. Please run legal-entity seeder first.',
			);
			return agents;
		}

		const availableEntities = faker.helpers.arrayElements(
			legalEntities,
			Math.min(count, legalEntities.length),
		);

		for (const legalEntity of availableEntities) {
			const email = faker.internet.email();
			const password = await this.passwordEncryption.encrypt('password123');

			const agent = this.agentRepository.create({
				email,
				password,
				roles: [Role.AGENT],
				legalEntity,
			});

			const savedAgent = await this.agentRepository.save(agent);
			agents.push(savedAgent);
		}

		this.logger.log(`Created ${agents.length} agents`);
		return agents;
	}
}
