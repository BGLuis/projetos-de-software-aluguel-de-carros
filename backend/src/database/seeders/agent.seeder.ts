import { Injectable, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { faker } from '@faker-js/faker';
import { Agent } from 'src/contracts/entities/agent.entity';
import { LegalEntity } from 'src/customers/entities/legal-entity.entity';

@Injectable()
export class AgentSeeder {
	private readonly logger = new Logger(AgentSeeder.name);

	constructor(
		@InjectRepository(Agent)
		private readonly agentRepository: Repository<Agent>,
		@InjectRepository(LegalEntity)
		private readonly legalEntityRepository: Repository<LegalEntity>,
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
			const agent = this.agentRepository.create({
				legalEntity,
			});

			const savedAgent = await this.agentRepository.save(agent);
			agents.push(savedAgent);
		}

		this.logger.log(`Created ${agents.length} agents`);
		return agents;
	}
}
