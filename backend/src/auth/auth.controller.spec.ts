import { Test, TestingModule } from '@nestjs/testing';

jest.mock('src/users/entities/user.entity', () => ({ User: class User {} }));
const { AuthController } = require('./auth.controller');
const AuthService = require('./auth.service').AuthService;

describe('AuthController', () => {
	let controller: any;
	let authService: any;

	beforeEach(async () => {
		authService = {
			signIn: jest.fn().mockResolvedValue({ accessToken: 'token' }),
		} as any;

		const module: TestingModule = await Test.createTestingModule({
			controllers: [AuthController],
			providers: [{ provide: AuthService, useValue: authService }],
		}).compile();

		controller = module.get(AuthController);
	});

	it('should be defined', () => {
		expect(controller).toBeDefined();
	});

	it('signin should call authService.signIn and return token', async () => {
		const dto = { email: 'a@b.com', password: 'p' };
		const result = await controller.signin(dto as any);

		expect(authService.signIn).toHaveBeenCalledWith(dto);
		expect(result).toEqual({ accessToken: 'token' });
	});
});
