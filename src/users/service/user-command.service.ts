import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { User, UserDocument } from '../schemas/user.schema';
import { Model } from 'mongoose';
import { CreateUserDto } from '../dto/req/create-user.dto';
import { GetRankConditionResDto } from '../dto/res/user-rank-response.dto';
import { BAN_ORDER } from '../constants/ban-constants';

@Injectable()
export class UserCommandService {
  constructor(@InjectModel(User.name) private userModel: Model<UserDocument>) {}

  async createUser(dto: CreateUserDto) {
    const created = new this.userModel(dto);
    return created.save();
  }

  async updateUserNickname(user: UserDocument, newNickname: string) {
    await this.validateNicknameChange(user, newNickname);

    user.nickname = newNickname;
    user.nicknameUpdatedAt = new Date();
    await user.save();
  }

  async updateUserRank(user: UserDocument, condition: GetRankConditionResDto): Promise<UserDocument> {
    if (!condition.canRankUp) throw new BadRequestException('랭크업이 불가능합니다.');

    user.rank = condition.nextRank;
    return await user.save();
  }

  async activateUserBan(user: UserDocument, bancount: number): Promise<UserDocument> {
    if (!BAN_ORDER.indexOf(bancount)) {
      throw new BadRequestException('명시된 일수만 정지가 가능합니다.');
    }
    user.bancount += bancount;
    return await user.save();
  }

  async deactivateUserBan(user: UserDocument): Promise<UserDocument> {
    if (user.bancount == 0) {
      throw new BadRequestException('정지되지 않은 유저입니다.');
    }
    user.bancount = 0;
    return await user.save();
  }

  async validateNicknameChange(user: UserDocument, newNickname: string): Promise<void> {
    if (user.nicknameUpdatedAt) {
      const daysPassed = (Date.now() - new Date(user.nicknameUpdatedAt).getTime()) / (1000 * 60 * 60 * 24);
      if (daysPassed < 30) {
        throw new BadRequestException('닉네임은 30일에 한 번만 변경할 수 있습니다.');
      }
    }
    const isExist = await this.userModel.exists({ nickname: newNickname });
    if (isExist) {
      throw new BadRequestException('이미 사용 중인 닉네임입니다.');
    }
  }

  /* 추후 트랜잭션으로 이동
  async addItem(userId: string, itemId: string, price: number, session?: ClientSession) {
    return this.userModel.findByIdAndUpdate(
      userId,
      {
        $inc: { lupa: -price },
        $push: { items: itemId },
      },
      { new: true, session },
    );
  }
    */
}
