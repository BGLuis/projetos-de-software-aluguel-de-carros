import { Test, TestingModule } from '@nestjs/testing';

// Jest precisa que o caminho 'src/...' seja mockado antes de carregar o módulo que o importa.
jest.mock('src/users/entities/user.entity', () => ({ User: class User {} }));
const { AuthService } = require('./auth.service');
import { Repository } from 'typeorm';
import { User } from 'src/users/entities/user.entity';
import { getRepositoryToken } from '@nestjs/typeorm';
import { PasswordEncryption } from 'src/encryption/password-encryption.provider';
import { JwtService } from '@nestjs/jwt';
import { EventEmitter2 } from '@nestjs/event-emitter';
import { UnauthorizedException } from '@nestjs/common';

describe('AuthService', () => {
	let service: any;
	let userRepo: any;
	let passwordEncryption: any;
	let jwtService: any;
	let eventEmitter: any;

	beforeEach(async () => {
		userRepo = { findOne: jest.fn() } as any;
		passwordEncryption = { compare: jest.fn() } as any;
		jwtService = { sign: jest.fn().mockReturnValue('signed-token') } as any;
		eventEmitter = { emit: jest.fn() } as any;

		const module: TestingModule = await Test.createTestingModule({
			providers: [
				AuthService,
				{ provide: getRepositoryToken(User), useValue: userRepo },
				{ provide: PasswordEncryption, useValue: passwordEncryption },
				{ provide: JwtService, useValue: jwtService },
				{ provide: EventEmitter2, useValue: eventEmitter },
			],
		}).compile();

		service = module.get(AuthService);
	});

	it('should be defined', () => {
		expect(service).toBeDefined();
	});

	it('should sign in successfully and return accessToken', async () => {
		const mockUser: any = {
			id: '1',
			email: 'test@example.com',
			password: 'hashed',
			roles: ['user'],
		};

		userRepo.findOne.mockResolvedValue(mockUser);
		passwordEncryption.compare.mockResolvedValue(true);

		const result = await service.signIn({
			email: 'test@example.com',
			password: 'plain',
		});

		expect(userRepo.findOne).toHaveBeenCalledWith({
			select: { id: true, email: true, password: true, roles: true },
			where: { email: 'test@example.com' },
		});
		expect(passwordEncryption.compare).toHaveBeenCalledWith(
			'hashed',
			'plain',
		);
		expect(jwtService.sign).toHaveBeenCalled();
		expect(result).toEqual({ accessToken: 'signed-token' });
	});

	it('should throw UnauthorizedException when user does not exist', async () => {
		userRepo.findOne.mockResolvedValue(undefined);

		await expect(
			service.signIn({ email: 'noone@example.com', password: 'any' }),
		).rejects.toBeInstanceOf(UnauthorizedException);
	});

	it('should throw UnauthorizedException when password is invalid', async () => {
		const mockUser: any = {
			id: '2',
			email: 'test2@example.com',
			password: 'hashed',
			roles: ['user'],
		};

		userRepo.findOne.mockResolvedValue(mockUser);
		passwordEncryption.compare.mockResolvedValue(false);

		await expect(
			service.signIn({ email: 'test2@example.com', password: 'wrong' }),
		).rejects.toBeInstanceOf(UnauthorizedException);
	});
});
