import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { RecordService } from './record.service';
import { RecordController } from './record.controller';
import { Record, RecordSchema } from './schemas/record.schema';
import { UsersModule } from 'src/users/users.module';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: Record.name, schema: RecordSchema }]),
    UsersModule
  ],
  exports: [MongooseModule], //외부에서 mongoose모델 허용
  controllers: [RecordController],
  providers: [RecordService],
})
export class RecordModule { }
