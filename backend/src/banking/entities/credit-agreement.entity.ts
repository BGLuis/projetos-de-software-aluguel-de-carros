import {
	Column,
	Entity,
	PrimaryGeneratedColumn,
	ManyToOne,
	JoinColumn,
	CreateDateColumn,
	UpdateDateColumn,
} from 'typeorm';
import { Contract } from 'src/contracts/entities/contract.entity';
import { Bank } from './bank.entity';

@Entity('credit_agreements')
export class CreditAgreement {
	@PrimaryGeneratedColumn('uuid')
	id: string;

	@ManyToOne(() => Contract)
	@JoinColumn()
	contract: Contract;

	@ManyToOne(() => Bank)
	@JoinColumn()
	bank: Bank;

	@Column({ type: 'decimal', precision: 10, scale: 2 })
	value: number;

	@Column({ type: 'decimal', precision: 5, scale: 2 })
	tax: number;

	@Column({ type: 'date' })
	startDate: Date;

	@Column({ type: 'date' })
	endDate: Date;

	@CreateDateColumn()
	createdAt: Date;

	@UpdateDateColumn()
	updatedAt: Date;
}
