import * as Joi from 'joi';

export const validationSchema = Joi.object({
	NODE_ENV: Joi.string()
		.valid('development', 'production', 'test')
		.default('development')
		.description('The Node.js environment'),
	PORT: Joi.number()
		.min(0)
		.max(65535)
		.default(3000)
		.description('The port on which the application will run'),
	DB_TYPE: Joi.string().required(),
	DB_NAME: Joi.string().required(),
	DB_HOST: Joi.string().required(),
	DB_PORT: Joi.number().min(0).max(65535).required(),
	DB_USER: Joi.string().required(),
	DB_PASS: Joi.string().required(),
	JWT_ACCESS_SECRET: Joi.string().default('default_secret'),
	JWT_ACCESS_EXPIRATION: Joi.string().default('60m'),
	SALT_LENGTH: Joi.number().min(1).default(16),
	PASSWORD_KEY_LENGTH: Joi.number().min(1).default(64),
	USERADMIN_EMAIL: Joi.string().email().required(),
	USERADMIN_PASSWORD: Joi.string().required(),
});
