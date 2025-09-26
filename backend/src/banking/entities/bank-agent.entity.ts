import {
	Entity,
	OneToOne,
	JoinColumn,
	OneToMany,
	PrimaryGeneratedColumn,
	CreateDateColumn,
	UpdateDateColumn,
} from 'typeorm';
import { CreditAgreement } from './credit-agreement.entity';
import { Owner } from 'src/customers/entities/owner.interface';

@Entity('bank_agents')
export class BankAgent implements Owner {
	@PrimaryGeneratedColumn('uuid')
	id: string;

	@OneToMany(() => CreditAgreement, (creditAgreement) => creditAgreement.id)
	creditAgreements: CreditAgreement[];

	@OneToOne(() => CreditAgreement)
	@JoinColumn()
	grantedCredit: CreditAgreement;

	@CreateDateColumn()
	createdAt: Date;

	@UpdateDateColumn()
	updatedAt: Date;

	getDocumentsRequest(): void {
		// Implementation for document request
	}

	cancelRequest(): void {
		// Implementation for cancel request
	}

	getPersonalData(): any {
		// Implementation for getting personal data
		return null;
	}
}
