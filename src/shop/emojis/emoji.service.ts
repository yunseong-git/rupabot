import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Emoji, EmojiDocument } from '../schemas/emoji.schema';
import { Model } from 'mongoose';
import { CreateEmojiDto } from './dto/req/create-emoji.dto';

@Injectable()
export class EmojiService {
  constructor(@InjectModel(Emoji.name) private emojiModel: Model<EmojiDocument>) {}

  async findSalesEmojis() {
    const emojis = this.emojiModel.find({}).exec();
    
    return emojis;
  }

  async findEmojiById(id: string) {
    const emoji = this.emojiModel.findById(id).exec();

    return emoji;
  }

  async createEmoji(dto: CreateEmojiDto) {}

  async searchEmojiByName() {}

  async findMyEmojis() {}
}
