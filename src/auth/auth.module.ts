import { Module } from '@nestjs/common';
import { APP_GUARD } from '@nestjs/core';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { JwtModule } from '@nestjs/jwt';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { JwtStrategy } from './jwt.strategy';
import { PassportModule } from '@nestjs/passport';
import { JwtAuthGuard } from './jwt.guard';
import { UsersModule } from 'src/users/users.module';
import { RedisModule } from 'src/redis/redis.module';

@Module({
  imports: [
    PassportModule,
    ConfigModule.forRoot(), // .env 사용 가능하게 함
    JwtModule.registerAsync({
      imports: [ConfigModule],
      useFactory: async (configService: ConfigService) => ({
        secret: configService.get('JWT_SECRET'),
        signOptions: { expiresIn: '1d' },
      }),
      inject: [ConfigService],
    }),
    UsersModule,
    RedisModule
  ],
  controllers: [AuthController],
  providers: [
    {
      provide: APP_GUARD,
      useClass: JwtAuthGuard,
    },
    AuthService,
    JwtStrategy
  ],
  exports: [AuthService],
})
export class AuthModule {}
