import { DataSource } from 'typeorm';
import { Injectable, Logger } from '@nestjs/common';
import { InjectDataSource } from '@nestjs/typeorm';

@Injectable()
export abstract class BaseSeeder {
	protected readonly logger = new Logger(this.constructor.name);

	constructor(
		@InjectDataSource() protected readonly dataSource: DataSource,
	) {}

	abstract seed(): Promise<void>;

	protected async clearTable(tableName: string): Promise<void> {
		await this.dataSource.query(`DELETE FROM ${tableName}`);
		this.logger.log(`Cleared ${tableName} table`);
	}

	protected async resetAutoIncrement(tableName: string): Promise<void> {
		await this.dataSource.query(
			`ALTER TABLE ${tableName} AUTO_INCREMENT = 1`,
		);
	}
}
