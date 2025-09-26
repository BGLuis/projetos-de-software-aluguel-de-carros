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

	@CreateDateColumn()
	createdAt: Date;

	@UpdateDateColumn()
	updatedAt: Date;
}
