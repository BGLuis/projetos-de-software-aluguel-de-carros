import {
	Column,
	Entity,
	PrimaryGeneratedColumn,
	ManyToOne,
	JoinColumn,
	CreateDateColumn,
	UpdateDateColumn,
} from 'typeorm';
import { Agent } from './agent.entity';

@Entity('contracts')
export class Contract {
	@PrimaryGeneratedColumn('uuid')
	id: string;

	@ManyToOne(() => Agent)
	@JoinColumn()
	agent: Agent;

	@Column({ type: 'date' })
	validityDate: Date;

	@CreateDateColumn()
	createdAt: Date;

	@UpdateDateColumn()
	updatedAt: Date;
}
