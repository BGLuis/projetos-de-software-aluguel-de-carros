import {
	Column,
	Entity,
	PrimaryGeneratedColumn,
	ManyToOne,
	JoinColumn,
	CreateDateColumn,
	UpdateDateColumn,
} from 'typeorm';
import { Customer } from 'src/customers/entities/customer.entity';
import { Automobile } from 'src/vehicles/entities/automobile.entity';
import { OrderStatus } from 'src/vehicles/entities/order-status.enum';

@Entity('rents')
export class Rent {
	@PrimaryGeneratedColumn('uuid')
	id: string;

	@Column({ type: 'date' })
	data: Date;

	@Column({ type: 'enum', enum: OrderStatus })
	status: OrderStatus;

	@ManyToOne(() => Customer, (customer) => customer.rents)
	@JoinColumn()
	client: Customer;

	@ManyToOne(() => Automobile)
	@JoinColumn()
	automobile: Automobile;

	@Column({ type: 'decimal', precision: 10, scale: 2 })
	value: number;

	@CreateDateColumn()
	createdAt: Date;

	@UpdateDateColumn()
	updatedAt: Date;
}
