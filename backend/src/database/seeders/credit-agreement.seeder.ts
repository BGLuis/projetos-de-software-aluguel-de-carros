import { Injectable, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { faker } from '@faker-js/faker';
import { CreditAgreement } from 'src/banking/entities/credit-agreement.entity';
import { Contract } from 'src/contracts/entities/contract.entity';
import { Bank } from 'src/banking/entities/bank.entity';

@Injectable()
export class CreditAgreementSeeder {
    private readonly logger = new Logger(CreditAgreementSeeder.name);

    constructor(
        @InjectRepository(CreditAgreement)
        private readonly creditAgreementRepository: Repository<CreditAgreement>,
        @InjectRepository(Contract)
        private readonly contractRepository: Repository<Contract>,
        @InjectRepository(Bank)
        private readonly bankRepository: Repository<Bank>,
    ) {}

    async seed(count: number = 25): Promise<CreditAgreement[]> {
        const creditAgreements: CreditAgreement[] = [];

        const contracts = await this.contractRepository.find();
        const banks = await this.bankRepository.find();

        if (contracts.length === 0 || banks.length === 0) {
            this.logger.warn('No contracts or banks found. Please run contract and bank seeders first.');
            return creditAgreements;
        }

        for (let i = 0; i < count; i++) {
            const contract = faker.helpers.arrayElement(contracts);
            const bank = faker.helpers.arrayElement(banks);

            const value = faker.number.float({
                min: 10000,
                max: 500000,
                fractionDigits: 2,
            });

            const tax = faker.number.float({
                min: 0.5,
                max: 15.0,
                fractionDigits: 2,
            });

            const startDate = faker.date.between({
                from: '2024-01-01',
                to: new Date(),
            });

            const endDate = faker.date.future({
                years: faker.number.int({ min: 1, max: 10 }),
                refDate: startDate,
            });

            const creditAgreement = this.creditAgreementRepository.create({
                contract,
                bank,
                value,
                tax,
                startDate,
                endDate,
            });

            const savedCreditAgreement =
                await this.creditAgreementRepository.save(creditAgreement);
            creditAgreements.push(savedCreditAgreement);
        }

        this.logger.log(`Created ${count} credit agreements`);
        return creditAgreements;
    }
}
