import { ChildEntity, ManyToOne, JoinColumn } from 'typeorm';
import { LegalEntity } from 'src/customers/entities/legal-entity.entity';
import { User } from 'src/users/entities/user.entity';

@ChildEntity()
export class Agent extends User {
	@ManyToOne(() => LegalEntity)
	@JoinColumn()
	legalEntity: LegalEntity;
}
