import { ChildEntity, ManyToOne, JoinColumn, BeforeInsert } from 'typeorm';
import { LegalEntity } from 'src/customers/entities/legal-entity.entity';
import { User } from 'src/users/entities/user.entity';
import { Role } from 'src/auth/roles/role.entity';

@ChildEntity()
export class Agent extends User {
	@ManyToOne(() => LegalEntity)
	@JoinColumn()
	legalEntity: LegalEntity;

	@BeforeInsert()
	setAgentRole() {
		if (!this.roles || this.roles.length === 0) {
			this.roles = [Role.AGENT];
		} else if (!this.roles.includes(Role.AGENT)) {
			this.roles.push(Role.AGENT);
		}
	}
}
