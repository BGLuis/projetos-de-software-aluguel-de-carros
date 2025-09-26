import { Module } from '@nestjs/common';
import { VehiclesService } from './vehicles.service';
import { VehiclesController } from './vehicles.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Automobile } from './entities/automobile.entity';
import { AuthModule } from 'src/auth/auth.module';

@Module({
	imports: [AuthModule, TypeOrmModule.forFeature([Automobile])],
	controllers: [VehiclesController],
	providers: [VehiclesService],
	exports: [VehiclesService],
})
export class VehiclesModule {}
