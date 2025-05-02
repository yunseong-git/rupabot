import { Injectable, BadRequestException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { User, UserDocument } from '../schemas/user.schema';
import { Model } from 'mongoose';

//types, constants
import { BAN_ORDER } from '../constants/ban-constants';

//req dto
import { CreateUserDto } from '../dto/req/create-user.dto';

//res dto
import { RankConditionResponseDto } from '../dto/res/user-rank-response.dto';
import { BanUserResponseDto, UpdateNicknameResponseDto, UpdateRankResponseDto} from '../dto/res/update-user-response.dto';

@Injectable()
export class UserCommandService {
  constructor(@InjectModel(User.name) private userModel: Model<UserDocument>) {}

  async createUser(dto: CreateUserDto) {
    const created = new this.userModel(dto);
    return created.save();
  }

  /** <update user>
   * updateUserNickname: 유저 닉네임 변경
   * response - UpdateUserNicknameResponseDto
   * private validateNicknameChange: 유저 닉네임 변경 가능성 확인
   *
   * updateUserRank: 유저 랭크 업
   * response - RankConditionResponseDto
   *
   * (de)activateUserBan: 유저 밴(해제)
   * response - UserBanResponseDto
   */
  async updateUserNickname(user: UserDocument, newNickname: string): Promise<UpdateNicknameResponseDto> {
    await this.validateNicknameChange(user, newNickname);

    const nickname = user.nickname;

    user.nickname = newNickname;
    user.nicknameUpdatedAt = new Date();
    await user.save();

    return {
      updatedAt: user.nicknameUpdatedAt,
      nickname: nickname,
      newNickname: user.nickname,
    };
  }

  async updateUserRank(user: UserDocument, condition: RankConditionResponseDto): Promise<UpdateRankResponseDto> {
    if (!condition.canRankUp) throw new BadRequestException('랭크업이 불가능합니다.');

    user.rank = condition.nextRank;
    await user.save();

    return {
      nickname: user.nickname,
      newRank: user.rank,
      updatedAt: new Date(),
    }
  }

  async activateUserBan(user: UserDocument, bancount: number): Promise<BanUserResponseDto> {
    if (!BAN_ORDER.includes(bancount)) {
      throw new BadRequestException('명시된 일수만 정지가 가능합니다.');
    }
    user.bancount += bancount;
    await user.save();
    return {
      nickname: user.nickname,
      bancount: user.bancount,
      updatecount: bancount,
    };
  }

  async deactivateUserBan(user: UserDocument): Promise<BanUserResponseDto> {
    if (user.bancount == 0) {
      throw new BadRequestException('정지되지 않은 유저입니다.');
    }
    user.bancount = 0;
    await user.save();
    return {
      nickname: user.nickname,
      bancount: user.bancount,
      updatecount: 0,
    };
  }

  private async validateNicknameChange(user: UserDocument, newNickname: string): Promise<void> {
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
}
