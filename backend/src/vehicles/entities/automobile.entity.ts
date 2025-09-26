import {
	Column,
	Entity,
	PrimaryGeneratedColumn,
	CreateDateColumn,
	UpdateDateColumn,
} from 'typeorm';

@Entity('automobiles')
export class Automobile {
	@PrimaryGeneratedColumn('uuid')
	id: string;

	@Column({ unique: true })
	plate: string;

	@Column()
	brand: string;

	@Column()
	model: string;

	@Column({ unique: true })
	chassi: string;

	@Column({ unique: true })
	renavam: string;

	@Column()
	year: number;

	@Column()
	color: string;

	@Column('decimal', { precision: 10, scale: 2 })
	dailyRate: number;

	@Column()
	category: string;

	@Column({ default: true })
	available: boolean;

	@CreateDateColumn()
	createdAt: Date;

	@UpdateDateColumn()
	updatedAt: Date;
}
