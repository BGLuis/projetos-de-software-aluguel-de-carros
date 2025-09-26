import {
	Entity,
	Column,
	JoinColumn,
	OneToOne,
	PrimaryGeneratedColumn,
	CreateDateColumn,
	UpdateDateColumn,
} from 'typeorm';
import { LegalEntity } from './legal-entity.entity';
import { Owner } from './owner.interface';

@Entity('enterprises')
export class Enterprise implements Owner {
	@PrimaryGeneratedColumn('uuid')
	id: string;

	@OneToOne(() => LegalEntity)
	@JoinColumn()
	legalEntity: LegalEntity;

	@Column()
	identification: string;

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

	get PersonalData(): any {
		return {
			id: this.id,
			identification: this.identification,
			legalEntity: this.legalEntity,
		};
	}
}
