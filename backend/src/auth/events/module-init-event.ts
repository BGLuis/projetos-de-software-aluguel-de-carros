import { Injectable, Logger } from "@nestjs/common";
import { OnEvent } from "@nestjs/event-emitter";
import { InjectRepository } from "@nestjs/typeorm";
import { AppConfigService } from "src/app-config/app-config.service";
import { User } from "src/users/entities/user.entity";
import { Repository } from "typeorm";
import { PasswordEncryption } from "src/encryption/password-encryption.provider";
import { Role } from "../roles/role.entity";

@Injectable()
export class ModuleInitEvent {
    private readonly logger = new Logger(ModuleInitEvent.name);
    constructor(
        @InjectRepository(User)
        private readonly userRepository: Repository<User>,
        private readonly appConfig: AppConfigService,
        private readonly passwordEncryption: PasswordEncryption
    ) {
        this.logger.log('ModuleInitEvent provider instantiated');
    }

    @OnEvent('auth.init')
    async handleAuthInitEvent() {
        try {
            const usersCount = await this.userRepository.count();
            if (usersCount === 0) {
                const admin = this.appConfig.adminInfo;
                const encryptedPassword = await this.passwordEncryption.encrypt(admin.password);
                const user = this.userRepository.create({
                    name: 'admin',
                    email: admin.email,
                    password: encryptedPassword,
                    roles: [Role.ADMIN],
                } as Partial<User>);
                await this.userRepository.save(user);
                this.logger.log(`Admin user created: ${admin.email}`);
            } else {
                this.logger.log(`Users already exist (${usersCount}) — skipping admin creation`);
            }
        } catch (err) {
            this.logger.error('Error while handling auth.init event', err as any);
        }
    }
}
