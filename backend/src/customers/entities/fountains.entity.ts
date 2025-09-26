import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';
import { Customer } from './customer.entity';

@Entity('fountains')
export class Fountain {
	@PrimaryGeneratedColumn('uuid')
	id: string;

	@Column()
	employerEntity: string;

	@Column()
	output: number;

	@ManyToOne(() => Customer, (customer) => customer.fountains)
	customer: Customer;
}
