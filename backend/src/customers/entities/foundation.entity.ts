import {
	Column,
	Entity,
	PrimaryGeneratedColumn,
	CreateDateColumn,
	UpdateDateColumn,
	ManyToOne,
} from 'typeorm';
import { Customer } from './customer.entity';

@Entity('foundations')
export class Foundation {
	@PrimaryGeneratedColumn('uuid')
	id: string;

	@Column()
	description: string;

	@Column()
	employee: string;

	@Column()
	contact: string;

	@Column()
	employerEntity: string;

	@Column()
	output: number;

	@ManyToOne(() => Customer)
	customer: Customer;

	@CreateDateColumn()
	createdAt: Date;

	@UpdateDateColumn()
	updatedAt: Date;
}
