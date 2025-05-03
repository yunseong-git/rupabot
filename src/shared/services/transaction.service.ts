import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { InjectConnection, InjectModel } from '@nestjs/mongoose';
import { Connection, Model, Types } from 'mongoose';

import { User, UserDocument } from 'src/users/schemas/user.schema';
import { Emoji, EmojiDocument } from 'src/shop/schemas/emoji.schema';
import { Record, RecordDocument } from 'src/records/schemas/record.schema';

import { RecordType } from 'src/records/schemas/record.schema';
import { BuyEmojiDto } from 'src/shop/emojis/dto/req/buy-emoji.dto';
console.log('🔥 TransactionService constructor 시작');
// transaction 통합서비스
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
      await this.recordModel.create(
        [
          {
            userId: user._id, // ✅ 필드명 일치
            type: RecordType.Purchase, // ✅ RecordType enum 사용 (string도 OK)
            content: emoji.name, // ✅ content 필드로 대체
            price: emoji.price,
            left: user.rupa,
          },
        ],
        { session },
      );

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
