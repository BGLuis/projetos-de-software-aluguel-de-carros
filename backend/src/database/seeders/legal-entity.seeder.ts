import { Injectable, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { faker } from '@faker-js/faker';
import { LegalEntity } from 'src/customers/entities/legal-entity.entity';

@Injectable()
export class LegalEntitySeeder {
    private readonly logger = new Logger(LegalEntitySeeder.name);

    constructor(
        @InjectRepository(LegalEntity)
        private readonly legalEntityRepository: Repository<LegalEntity>,
    ) {}

    async seed(count: number = 15): Promise<LegalEntity[]> {
        const legalEntities: LegalEntity[] = [];

        for (let i = 0; i < count; i++) {
            const legalEntity = this.legalEntityRepository.create({
                cnpj: this.generateCNPJ(),
                companyName: faker.company.name(),
            });

            const savedLegalEntity =
                await this.legalEntityRepository.save(legalEntity);
            legalEntities.push(savedLegalEntity);
        }

        this.logger.log(`Created ${count} legal entities`);
        return legalEntities;
    }

    private generateCNPJ(): string {
        const timestamp = Date.now().toString();
        const cnpj = timestamp.padStart(14, '0').slice(-14);
        return cnpj;
    }
}
