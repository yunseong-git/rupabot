import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { Emoji, EmojiSchema } from './schemas/emoji.schema';
import { EmojiController } from './emojis/emoji.controller';
import { EmojiService } from './emojis/emoji.service';
import { SharedModule } from 'src/shared/shared.Module';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: Emoji.name, schema: EmojiSchema }],),
    SharedModule,
  ],
  controllers: [EmojiController],
  providers: [EmojiService],
})
export class ShopModule { }
