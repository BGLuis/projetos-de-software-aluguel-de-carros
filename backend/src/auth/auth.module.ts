import { Module, Logger, OnApplicationBootstrap } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { EncryptionModule } from 'src/encryption/encryption.module';
import { AppConfigModule } from 'src/app-config/app-config.module';
import { UsersModule } from 'src/users/users.module';
import { User } from 'src/users/entities/user.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import { EventEmitter2, EventEmitterReadinessWatcher } from '@nestjs/event-emitter';
import { ModuleInitEvent } from './events/module-init-event';
import { JwtModule } from '@nestjs/jwt';
import { AppConfigService } from 'src/app-config/app-config.service';
import { JwtAuthGuard } from './guard/jwt-auth.guard';
import { JwtStrategy } from './strategy/jwt.strategy';

@Module({
  imports: [
    EncryptionModule,
    AppConfigModule,
    UsersModule,
    TypeOrmModule.forFeature([User]),
    JwtModule.registerAsync({
      imports: [AppConfigModule],
      inject: [AppConfigService],
      useFactory: (configService: AppConfigService) => ({
        secret: configService.jwtAccessSecret,
        signOptions: { expiresIn: '1d' },
      }),
    }),
  ],
  controllers: [AuthController],
  providers: [AuthService, ModuleInitEvent, JwtStrategy, JwtAuthGuard],
  exports: [JwtModule, JwtStrategy, JwtAuthGuard],
})
export class AuthModule implements OnApplicationBootstrap {
  private readonly logger = new Logger(AuthModule.name);

  constructor(
    private readonly eventEmitterReadinessWatcher: EventEmitterReadinessWatcher,
    private eventEmitter: EventEmitter2,
  ) {}

  async onApplicationBootstrap() {
    await this.eventEmitterReadinessWatcher.waitUntilReady();
    this.eventEmitter.emit('auth.init');
  }
}
