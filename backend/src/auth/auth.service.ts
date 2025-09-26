import {
	BadRequestException,
	Injectable,
	Logger,
	UnauthorizedException,
} from '@nestjs/common';
import { SignInAuthDto } from './dto/signin-auth.dto';
import { Repository } from 'typeorm';
import { User } from 'src/users/entities/user.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { EventEmitter2 } from '@nestjs/event-emitter';
import { PasswordEncryption } from 'src/encryption/password-encryption.provider';
import { JwtService, JwtSignOptions } from '@nestjs/jwt';

@Injectable()
export class AuthService {
	private readonly logger = new Logger(AuthService.name);

	constructor(
		@InjectRepository(User)
		private readonly userRepository: Repository<User>,
		private readonly passwordEncryption: PasswordEncryption,
		private readonly jwtService: JwtService,
		private eventEmitter: EventEmitter2,
	) {}

	async signIn(dto: SignInAuthDto) {
		const { email, password } = dto;
		const user = await this.userRepository.findOne({
			select: { id: true, email: true, password: true, roles: true },
			where: { email },
		});
		if (!user) {
			this.logger.error('User does not exist', email);
			throw new UnauthorizedException('User does not exist');
		}
		if (!(await this.passwordEncryption.compare(user.password, password))) {
			this.logger.error('Invalid password', email);
			throw new UnauthorizedException('Invalid password');
		}

		return this.generateLoginJwt(user);
	}

	private async generateLoginJwt(user: User) {
		const payload = {
			email: user.email,
			sub: user.id,
			roles: user.roles,
			iss: 'login',
		};
		const options: JwtSignOptions = {};

		const accessToken = this.jwtService.sign(payload, options);
		return {
			accessToken,
		};
	}
}
