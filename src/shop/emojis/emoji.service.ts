import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Emoji, EmojiDocument } from '../schemas/emoji.schema';
import { Model } from 'mongoose';
import { CreateEmojiDto } from './dto/req/create-emoji.dto';
import { EmojisResponseDto } from './dto/res/query-emoji-response.dto';
import { plainToInstance } from 'class-transformer';
import { EmojiQueryDto, EmojiSearchDto } from './dto/req/query-emoji.dto';
import { QueryOptions, applyPagination } from 'src/common/utils/pagination.utill';
import { CreateEmojiResponseDto } from './dto/res/create-emoji-response.dto';

@Injectable()
export class EmojiService {
  constructor(@InjectModel(Emoji.name) private emojiModel: Model<EmojiDocument>) { }

  async findAllEmojis(dto: EmojiQueryDto): Promise<EmojisResponseDto[]> {
    const { sort, limit = 10, skip = 0 } = dto;
    const option: QueryOptions = { sort, limit, skip };

    let query = this.emojiModel.find();
    query = applyPagination(query, option);
    const emojis = await query.lean().exec();

    return plainToInstance(EmojisResponseDto, emojis, { excludeExtraneousValues: true });
  }

  async searchEmojiByName(dto: EmojiSearchDto): Promise<EmojisResponseDto[]> {
    const { word, limit = 10, skip = 0 } = dto;

    const option: QueryOptions = { limit, skip };
    let query = this.emojiModel.find({ name: { $regex: word } });
    query = applyPagination(query, option)

    const emojis = await query.lean().exec();

    return plainToInstance(EmojisResponseDto, emojis, { excludeExtraneousValues: true });
  }

  async findEmojiById(id: string): Promise<EmojisResponseDto> {
    const emoji = this.emojiModel.findById(id).lean().exec();
    if (!emoji) throw new NotFoundException('이모지가 존재하지 않습니다.')
    return plainToInstance(EmojisResponseDto, emoji, { excludeExtraneousValues: true });
  }

  async createEmoji(dto: CreateEmojiDto): Promise<CreateEmojiResponseDto> {
    const emoji = new this.emojiModel({ ...dto, })
    const saved = await emoji.save();

    return plainToInstance(CreateEmojiResponseDto, saved, { excludeExtraneousValues: true });
  }
}
