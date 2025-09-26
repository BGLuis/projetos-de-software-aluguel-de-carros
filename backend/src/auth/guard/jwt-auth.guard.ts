import {
	ExecutionContext,
	Injectable,
	Logger,
	UnauthorizedException,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { AuthGuard } from '@nestjs/passport';
import { ROLES_KEY } from '../roles/role.decorator';

@Injectable()
export class JwtAuthGuard extends AuthGuard('jwt') {
	private readonly logger = new Logger(JwtAuthGuard.name);
	constructor(private readonly reflector: Reflector) {
		super();
	}

	async canActivate(context: ExecutionContext) {
		const canActivate = await super.canActivate(context);
		if (!canActivate) {
			this.logger.error('User is not authenticated');
			throw new UnauthorizedException('User is not authenticated');
		}
		const requiredRoles = this.reflector.getAllAndOverride<string[]>(
			ROLES_KEY,
			[context.getHandler(), context.getClass()],
		);

		if (!requiredRoles) {
			return true;
		}

		const request = context.switchToHttp().getRequest();

		const user = request.user;
		if (!user) {
			this.logger.error('Authenticated request has no user attached');
			throw new UnauthorizedException('User not found on request');
		}

		const userRoles: string[] = Array.isArray(user.roles)
			? user.roles
			: user.roles
				? [user.roles]
				: [];

		const hasRole = requiredRoles.some((role) => userRoles.includes(role));

		if (!hasRole) {
			this.logger.warn(
				`User '${user?.sub ?? user?.id ?? 'unknown'}' lacks required roles: ${requiredRoles}`,
			);
			throw new UnauthorizedException('Insufficient permissions');
		}
		return true;
	}
}
