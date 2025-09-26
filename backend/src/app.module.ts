import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AppConfigModule } from './app-config/app-config.module';
import { DatabaseModule } from './database/database.module';
import { AuthModule } from './auth/auth.module';
import { UsersModule } from './users/users.module';
import { EventEmitterModule } from '@nestjs/event-emitter';
import { CustomersModule } from './customers/customers.module';
import { VehiclesModule } from './vehicles/vehicles.module';
import { RentalsModule } from './rentals/rentals.module';
import { SeederModule } from './database/seeders/seeder.module';

@Module({
	imports: [
		AppConfigModule,
		DatabaseModule,
		EventEmitterModule.forRoot(),
		AuthModule,
		UsersModule,
		CustomersModule,
		VehiclesModule,
		RentalsModule,
		SeederModule,
	],
	controllers: [AppController],
	providers: [AppService],
})
export class AppModule {}
