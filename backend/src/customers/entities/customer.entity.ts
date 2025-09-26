import {
	Entity,
	JoinColumn,
	OneToOne,
	OneToMany,
	PrimaryGeneratedColumn,
	CreateDateColumn,
	UpdateDateColumn,
} from 'typeorm';
import { Individual } from 'src/users/entities/individual.entity';
import { Owner } from './owner.interface';
import { LegalEntity } from './legal-entity.entity';
import { Rent } from 'src/rentals/entities/rent.entity';
import { Fountain } from './fountains.entity';

@Entity('customers')
export class Customer implements Owner {
	@PrimaryGeneratedColumn('uuid')
	id: string;

	@OneToOne(() => Individual, { nullable: true })
	@JoinColumn()
	individual?: Individual;

	@OneToOne(() => LegalEntity, { nullable: true })
	@JoinColumn()
	legalEntity?: LegalEntity;

	@CreateDateColumn()
	createdAt: Date;

	@UpdateDateColumn()
	updatedAt: Date;

	@OneToMany(() => Rent, (rent) => rent.client)
	rents: Rent[];

	@OneToMany(() => Fountain, (fountain) => fountain.customer)
	fountains: Fountain[];

	getDocumentsRequest(): void {
		// Implementation for document request
	}

	cancelRequest(): void {
		// Implementation for cancel request
	}

	getPersonalData(): any {
		// Implementation for getting personal data
		return this.individual || this.legalEntity;
	}
}
