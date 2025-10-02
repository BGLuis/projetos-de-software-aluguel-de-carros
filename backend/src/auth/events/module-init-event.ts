import { Injectable, Logger } from '@nestjs/common';
import { OnEvent } from '@nestjs/event-emitter';
import { InjectRepository } from '@nestjs/typeorm';
import { AppConfigService } from 'src/app-config/app-config.service';
import { Individual } from 'src/users/entities/individual.entity';
import { Repository } from 'typeorm';
import { PasswordEncryption } from 'src/encryption/password-encryption.provider';
import { Role } from '../roles/role.entity';

@Injectable()
export class ModuleInitEvent {
	private readonly logger = new Logger(ModuleInitEvent.name);
	constructor(
		@InjectRepository(Individual)
		private readonly individualRepository: Repository<Individual>,
		private readonly appConfig: AppConfigService,
		private readonly passwordEncryption: PasswordEncryption,
	) {
		this.logger.log('ModuleInitEvent provider instantiated');
	}

	@OnEvent('auth.init')
	async handleAuthInitEvent() {
		try {
			const usersCount = await this.individualRepository.count();
			if (usersCount === 0) {
				const admin = this.appConfig.adminInfo;
				const encryptedPassword = await this.passwordEncryption.encrypt(
					admin.password,
				);
				const user = this.individualRepository.create({
					name: 'Admin',
					email: admin.email,
					password: encryptedPassword,
					roles: [Role.ADMIN],
					cpf: '00000000000',
					profession: 'Administrator',
					address: 'N/A',
					birthdate: new Date('1990-01-01'),
				});
				await this.individualRepository.save(user);
				this.logger.log(`Admin user created: ${admin.email}`);
			} else {
				this.logger.log(
					`Users already exist (${usersCount}) — skipping admin creation`,
				);
			}
		} catch (err) {
			this.logger.error(
				'Error while handling auth.init event',
				err as any,
			);
		}
	}
}
