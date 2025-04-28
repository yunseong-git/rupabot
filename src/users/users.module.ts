import { Module } from '@nestjs/common';
import { UsersController } from './controllers/user.controller';
import { UserQueryService } from './service/user-query.service';
import { MongooseModule } from '@nestjs/mongoose';
import { User, UserSchema } from './schemas/user.schema';
import { SharedModule } from 'src/shared/shared.Module';
import { AdminUserController } from './controllers/admin-user.controller';

@Module({
  imports: [MongooseModule.forFeature([{ name: User.name, schema: UserSchema }]), SharedModule],
  exports: [MongooseModule, UserQueryService], //외부에서 mongoose모델 허용
  controllers: [UsersController,AdminUserController],
  providers: [UserQueryService],
})
export class UsersModule {}
