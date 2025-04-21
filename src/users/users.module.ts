import { Module } from '@nestjs/common';
import { UsersController } from './users.controller';
import { UsersService } from './users.service';
import { MongooseModule } from '@nestjs/mongoose';
import { User, UserSchema } from './schemas/user.schema';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: User.name, schema: UserSchema }
    ])
  ],
  exports: [MongooseModule,UsersService], //외부에서 mongoose모델 허용
  controllers: [UsersController],
  providers: [UsersService],
})
export class UsersModule {}