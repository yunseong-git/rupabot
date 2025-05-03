import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { MongooseModule } from '@nestjs/mongoose';
import { ConfigModule } from '@nestjs/config';
import { ConfigService } from '@nestjs/config';
import * as Joi from 'joi';

import { UsersModule } from './users/users.module';
import { BoardModule } from './board/board.module';
import { ShopModule } from './shop/shop.module';
import { RecordModule } from './records/record.module';
import { BattleModule } from './battle/battle.module';
import { AuthModule } from './auth/auth.module';
import { RedisModule } from './redis/redis.module';
import { SharedModule } from './shared/shared.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      validationSchema: Joi.object({
        //환경변수 사전검사
        MONGO_URI: Joi.string().required(),
        PORT: Joi.number().required(),
        JWT_SECRET: Joi.string().required(),
        BCRYPT_SALT: Joi.number().required(),
      }),
    }),
    MongooseModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (config: ConfigService) => ({
        uri: config.get<string>('MONGO_URI', { infer: true }), // string으로 추론
      }),
    }),
    UsersModule,
    BoardModule,
    ShopModule,
    BattleModule,
    RecordModule,
    AuthModule,
    RedisModule,
    SharedModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
