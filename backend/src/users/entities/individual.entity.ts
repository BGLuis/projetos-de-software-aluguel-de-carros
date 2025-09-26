import { ChildEntity, Column, OneToOne, JoinColumn } from 'typeorm';
import { User } from './user.entity';
import { Foundation } from 'src/customers/entities/foundation.entity';

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

	@OneToOne(() => Foundation, { nullable: true })
	@JoinColumn()
	foundation?: Foundation;
}
