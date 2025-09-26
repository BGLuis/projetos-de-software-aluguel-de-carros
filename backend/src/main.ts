import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { INestApplication, ValidationPipe } from '@nestjs/common';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';

async function bootstrap() {
	const app = await NestFactory.create(AppModule);
	configPipe(app);
	configureCors(app);
	app.setGlobalPrefix('api');
	if (process.env.NODE_ENV === 'development') configureSwagger(app);

	await app.listen(process.env.PORT ?? 3000);
}

function configureSwagger(app: INestApplication) {
	const config = new DocumentBuilder()
		.setTitle('Aluguel de carros')
		.setDescription('API para locação de carros')
		.setVersion('0.1')
		.addBearerAuth(
			{
				type: 'http',
				scheme: 'bearer',
				bearerFormat: 'JWT',
				name: 'JWT',
				description: 'Enter JWT token',
				in: 'header',
			},
			'JWT-auth',
		)
		.build();
	const document = SwaggerModule.createDocument(app, config);
	SwaggerModule.setup('docs', app, document);
}

function configPipe(app: INestApplication) {
	app.useGlobalPipes(
		new ValidationPipe({
			transform: true,
			whitelist: true,
			forbidNonWhitelisted: true,
		}),
	);
}

function configureCors(app: INestApplication) {
	app.enableCors({
		credentials: true,
	});
}
bootstrap();
