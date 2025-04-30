import { Injectable, NotFoundException, BadRequestException  } from '@nestjs/common';
import { InjectConnection, InjectModel } from '@nestjs/mongoose';
import { Connection, Model, Types } from 'mongoose';

import { User, UserDocument } from 'src/users/schemas/user.schema';
import { Emoji, EmojiDocument } from 'src/shop/schemas/emoji.schema';
import { Record, RecordDocument } from 'src/wallet/schemas/record.schema';

import { BuyEmojiDto } from 'src/shop/emojis/dto/req/buy-emoji.dto';

// soft delete 관련 통합 서비스
@Injectable()
export class TransactionService {
  constructor(
    @InjectConnection() private readonly connection: Connection,
    @InjectModel(User.name) private readonly userModel: Model<UserDocument>,
    @InjectModel(Emoji.name) private readonly emojiModel: Model<EmojiDocument>,
    @InjectModel(Record.name) private readonly recordModel: Model<RecordDocument>,
  ) {}

  async buyEmoji(dto: BuyEmojiDto, userId: string) {
    const session = await this.connection.startSession();
    session.startTransaction();

    try {
      const user = await this.userModel.findById(userId).session(session);
      if (!user) throw new NotFoundException('유저가 존재하지 않습니다.');

      const emoji = await this.emojiModel.findById(dto.emojiId).session(session);
      if (!emoji) throw new NotFoundException('이모지가 존재하지 않습니다.');

      if (user.rupa < emoji.price) {
        throw new BadRequestException('루파가 부족합니다.');
      }

      // 루파 차감
      user.rupa -= emoji.price;
      user.emojis.push(emoji.id); // 보유 이모지 추가
      await user.save({ session });

      // 구매 기록 생성
      await this.recordModel.create([{
        user: user.id,
        emoji: emoji.id,
        price: emoji.price,
        type: '구매',
        createdAt: new Date(),
      }], { session });

      await session.commitTransaction();
      return { message: '이모지를 성공적으로 구매했습니다.' };
    } catch (err) {
      await session.abortTransaction();
      throw err;
    } finally {
      session.endSession();
    }
  }
}
