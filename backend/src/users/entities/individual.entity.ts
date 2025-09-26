import { ChildEntity, Column, OneToOne, JoinColumn } from 'typeorm';
import { User } from './user.entity';
import { Fountain } from 'src/customers/entities/fountains.entity';

@ChildEntity()
export class Individual extends User {
	@Column()
	name: string;
	@Column({ unique: true })
	cpf: string;

	@Column()
	profession: string;

	@Column()
	address: string;

	@Column({ type: 'date' })
	birthdate: Date;

	@OneToOne(() => Fountain, { nullable: true })
	@JoinColumn()
	fountain?: Fountain;
}
