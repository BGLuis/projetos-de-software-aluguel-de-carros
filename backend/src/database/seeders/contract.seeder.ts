import { Injectable, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { faker } from '@faker-js/faker';
import { Contract } from 'src/contracts/entities/contract.entity';
import { Agent } from 'src/contracts/entities/agent.entity';

@Injectable()
export class ContractSeeder {
    private readonly logger = new Logger(ContractSeeder.name);

    constructor(
        @InjectRepository(Contract)
        private readonly contractRepository: Repository<Contract>,
        @InjectRepository(Agent)
        private readonly agentRepository: Repository<Agent>,
    ) {}

    async seed(count: number = 20): Promise<Contract[]> {
        const contracts: Contract[] = [];

        const agents = await this.agentRepository.find();

        if (agents.length === 0) {
            this.logger.warn('No agents found. Please run agent seeder first.');
            return contracts;
        }

        for (let i = 0; i < count; i++) {
            const agent = faker.helpers.arrayElement(agents);

            const validityDate = faker.date.future({
                years: 5,
                refDate: new Date(),
            });

            const contract = this.contractRepository.create({
                agent,
                validityDate,
            });

            const savedContract = await this.contractRepository.save(contract);
            contracts.push(savedContract);
        }

        this.logger.log(`Created ${count} contracts`);
        return contracts;
    }
}
