import { Role } from 'src/auth/roles/role.entity';
import {
	AfterLoad,
	BeforeUpdate,
	Column,
	CreateDateColumn,
	Entity,
	PrimaryGeneratedColumn,
	UpdateDateColumn,
	TableInheritance,
} from 'typeorm';

@Entity('users')
@TableInheritance({ column: { type: 'varchar', name: 'type' } })
export class User {
	@PrimaryGeneratedColumn('uuid')
	id: string;

	@Column()
	email: string;

	@Column({
		select: false,
	})
	password: string;

	@Column({ type: 'set', enum: Role, default: [] })
	roles: Role[];

	@Column({ type: 'datetime', default: () => 'CURRENT_TIMESTAMP' })
	lastPasswordChange: Date;

	@CreateDateColumn()
	createdAt: Date;

	@UpdateDateColumn()
	updatedAt: Date;

	private _cachedPassword?: string;

	@AfterLoad()
	private _cachePassword() {
		this._cachedPassword = this.password;
	}

	@BeforeUpdate()
	private _checkPasswordChange() {
		if (this._cachedPassword !== this.password) {
			this.lastPasswordChange = new Date();
		}
	}
}
