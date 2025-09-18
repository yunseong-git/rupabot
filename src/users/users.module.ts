import { Module } from '@nestjs/common';
import { UsersController } from './controllers/user.controller';
import { UserQueryService } from './service/user-query.service';
import { AdminUserController } from './controllers/admin-user.controller';
import { UserCommandService } from './service/user-command.service';

import { MongooseModule } from '@nestjs/mongoose';
import { UserSchema } from './schemas/user.schema';
import { PassportModule } from '@nestjs/passport';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: 'User', schema: UserSchema }]),PassportModule],
  exports: [UserQueryService, UserCommandService],
  controllers: [UsersController, AdminUserController],
  providers: [UserQueryService, UserCommandService],
})
export class UsersModule {}
