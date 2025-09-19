import { User } from 'src/users/entities/user.entity';
import { Column, Entity, JoinColumn, OneToMany } from 'typeorm';
import { Fountain } from './fountains.entity';

@Entity('customers')
export class Customer extends User {
	@Column()
	address: string;

	@Column()
	rg: string;

	@Column({ unique: true })
	cpf: string;

	@Column()
	profession: string;

	@OneToMany(() => Fountain, (fountain) => fountain.id, { cascade: true })
	@JoinColumn()
	fountains: Fountain[];
}
