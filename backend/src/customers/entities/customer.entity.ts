import {
	ChildEntity,
	JoinColumn,
	OneToOne,
	OneToMany,
	BeforeInsert,
} from 'typeorm';
import { Individual } from 'src/users/entities/individual.entity';
import { Owner } from './owner.interface';
import { LegalEntity } from './legal-entity.entity';
import { Rent } from 'src/rentals/entities/rent.entity';
import { Fountain } from './fountains.entity';
import { User } from 'src/users/entities/user.entity';
import { Role } from 'src/auth/roles/role.entity';

@ChildEntity()
export class Customer extends User implements Owner {
	@OneToOne(() => Individual, { nullable: true })
	@JoinColumn()
	individual?: Individual;

	@OneToOne(() => LegalEntity, { nullable: true })
	@JoinColumn()
	legalEntity?: LegalEntity;

	@OneToMany(() => Rent, (rent) => rent.client)
	rents: Rent[];

	@OneToMany(() => Fountain, (fountain) => fountain.customer)
	fountains: Fountain[];

	@BeforeInsert()
	setClientRole() {
		if (!this.roles || this.roles.length === 0) {
			this.roles = [Role.CLIENT];
		} else if (!this.roles.includes(Role.CLIENT)) {
			this.roles.push(Role.CLIENT);
		}
	}

	get PersonalData(): any {
		// Implementation for getting personal data
		return {
			id: this.id,
			email: this.email,
			roles: this.roles,
			individual: this.individual,
			legalEntity: this.legalEntity,
		};
	}
}
