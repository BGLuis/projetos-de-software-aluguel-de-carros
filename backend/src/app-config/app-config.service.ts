import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class AppConfigService {
	constructor(private readonly config: ConfigService) {}

	get nodeEnv(): string {
		return this.config.get<string>('NODE_ENV') || 'development';
	}

	get port(): number {
		return this.config.get<number>('PORT') || 3000;
	}

	get jwtAccessSecret(): string {
		return this.config.get<string>('JWT_ACCESS_SECRET') || 'default_secret';
	}

	get jwtAccessExpiration(): string {
		return this.config.get<string>('JWT_ACCESS_EXPIRATION') || '60m';
	}

	get saltLength(): number {
		return this.config.get<number>('SALT_LENGTH') || 16;
	}

	get passwordKeyLength(): number {
		return this.config.get<number>('PASSWORD_KEY_LENGTH') || 64;
	}

	get adminInfo() {
		const email = this.config.get<string>('USERADMIN_EMAIL');
		const password = this.config.get<string>('USERADMIN_PASSWORD');
		if (!email || !password) {
			throw new Error(
				'Admin credentials are not set. Please set USERADMIN_EMAIL and USERADMIN_PASSWORD environment variables.',
			);
		}
		return {
			email,
			password,
		};
	}

	get database() {
		return {
			type: this.config.get<string>('DB_TYPE'),
			name: this.config.get<string>('DB_NAME'),
			host: this.config.get<string>('DB_HOST'),
			port: this.config.get<number>('DB_PORT'),
			username: this.config.get<string>('DB_USER'),
			password: this.config.get<string>('DB_PASS'),
		};
	}
}
