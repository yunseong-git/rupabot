import { Module } from '@nestjs/common';
import { EmojiController } from './emojis/emoji.controller';
import { EmojiService } from './emojis/emoji.service';
import { MongooseModule } from '@nestjs/mongoose';
import { EmojiSchema } from './schemas/emoji.schema';
import { PassportModule } from '@nestjs/passport';
@Module({
  imports: [MongooseModule.forFeature([{ name: 'Emoji', schema: EmojiSchema }]), PassportModule],
  controllers: [EmojiController],
  providers: [EmojiService],
})
export class ShopModule {}
