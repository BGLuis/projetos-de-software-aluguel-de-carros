import { Module } from '@nestjs/common';
import { CustomersService } from './customers.service';
import { CustomersController } from './customers.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from 'src/users/entities/user.entity';
import { Individual } from 'src/users/entities/individual.entity';
import { Fountain } from './entities/fountains.entity';
import { Customer } from './entities/customer.entity';
import { AuthModule } from 'src/auth/auth.module';
import { EncryptionModule } from 'src/encryption/encryption.module';
import { AppConfigModule } from 'src/app-config/app-config.module';

@Module({
	imports: [
		AuthModule,
		EncryptionModule,
		AppConfigModule,
		TypeOrmModule.forFeature([User, Individual, Fountain, Customer]),
	],
	controllers: [CustomersController],
	providers: [CustomersService],
})
export class CustomersModule {}
