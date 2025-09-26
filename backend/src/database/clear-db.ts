import { NestFactory } from '@nestjs/core';
import { AppModule } from '../app.module';
import { DataSource } from 'typeorm';

async function clearDatabase() {
    const app = await NestFactory.createApplicationContext(AppModule);
    const dataSource = app.get(DataSource);

    try {
        console.log('🧹 Clearing database...');

        await dataSource.query('SET FOREIGN_KEY_CHECKS = 0');

        const tables = [
            'rents',
            'automobiles',
            'fountains',
            'customers',
            'users',
            'bank_agents',
            'credit_agreements',
            'contracts',
            'agents',
            'enterprises',
            'legal_entities',
            'banks',
        ];

        for (const table of tables) {
            try {
                await dataSource.query(`TRUNCATE TABLE \`${table}\``);
                console.log(`✅ Cleared table: ${table}`);
            } catch (error) {
                console.log(`⚠️  Table ${table} not found or already empty`);
            }
        }

        await dataSource.query('SET FOREIGN_KEY_CHECKS = 1');

        console.log('✅ Database cleared successfully!');
    } catch (error) {
        console.error('❌ Error clearing database:', error);
        throw error;
    } finally {
        await app.close();
    }
}

void clearDatabase();
