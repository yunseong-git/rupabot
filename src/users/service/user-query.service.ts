import { Injectable, NotFoundException, ConflictException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { User, UserDocument } from '../schemas/user.schema';
import { Model } from 'mongoose';
import { plainToInstance } from 'class-transformer';

//types, constants, utills
import { RANK_CONDITIONS, RankType, RANK_ORDER } from '../constants/rank-constants';
import { applyPagination, QueryOptions } from 'src/common/utils/pagination.utill';

//req dto
import { FindAllUsersDto, SearchUsersQueryDto } from '../dto/req/query-user.dto';

//res dto
import { UserToUserResponseDto, SingleUserResponseDto, ManyUsersResponseDto } from '../dto/res/query-user-response.dto';
import { RankConditionResponseDto, RequirementDetail } from '../dto/res/user-rank-response.dto';
import { OwnedEmojiResponseDto } from '../dto/res/user-emoji-response.dto';

@Injectable()
export class UserQueryService {
  constructor(@InjectModel(User.name) private userModel: Model<UserDocument>) {}

  /** <many users>
   * findAllUsers: 모든 유저 find(sorting 선택)
   * SearchUsers: 닉네임 중 특정단어 포함된 유저 find
   * findBannedUsers: bancount가 존재하는 유저 find
   *
   * private findManyUsers:다수 유저 검색용 공통 로직
   * response - ManyUsersResponseDto[]
   */

  async findAllUsers(dto: FindAllUsersDto): Promise<ManyUsersResponseDto[]> {
    const { sort, limit = 10, skip = 0 } = dto;
    const filter = {};
    const option: QueryOptions = { sort, limit, skip };

    return await this.findManyUsers(filter, option);
  }

  async searchUsers(dto: SearchUsersQueryDto): Promise<ManyUsersResponseDto[]> {
    const { nickname, limit = 10, skip = 0 } = dto;
    const filter = { nickname: { $regex: nickname, $options: 'i' } };
    const option: QueryOptions = { limit, skip };

    return await this.findManyUsers(filter, option);
  }

  async findBannedUsers(dto: FindAllUsersDto): Promise<ManyUsersResponseDto[]> {
    const { sort, limit = 10, skip = 0 } = dto;
    const filter = { bancount: { $gt: 1 } };
    const option: QueryOptions = { sort, limit, skip };

    return await this.findManyUsers(filter, option);
  }

  private async findManyUsers(filter: any, option: QueryOptions): Promise<ManyUsersResponseDto[]> {
    let query = this.userModel.find(filter).select('email nickname rupa rank attendcount bancount');
    query = applyPagination(query, option);
    const users = await query.lean().exec();

    return plainToInstance(ManyUsersResponseDto, users, { excludeExtraneousValues: true });
  }

  /** <single user>
   * findUserByUser: 유저-유저 간 조회
   * response - UserToUserResponseDto
   *
   * findUserById, findUserByEmail: by에 해당하는 필드로 유저 검색
   * response - SingleUserResponseDto
   *
   * findUserDocumentById(ByEmail, ByNickname) : 내부 로직용
   */

  async findUserByUser(id: string): Promise<UserToUserResponseDto> {
    const user = await this.userModel
      .findById(id)
      .select('nickname rank attendcount nicknameUpdatedAt bancount image')
      .lean()
      .exec();
    if (!user) throw new NotFoundException('유저를 찾을 수 없습니다');
    return plainToInstance(UserToUserResponseDto, user, { excludeExtraneousValues: true });
  }

  async findUserById(id: string): Promise<SingleUserResponseDto> {
    const user = await this.userModel.findById(id).select('-emojis').lean().exec();
    if (!user) throw new NotFoundException('유저를 찾을 수 없습니다');
    return plainToInstance(SingleUserResponseDto, user, { excludeExtraneousValues: true });
  }

  async findUserByEmail(email: string): Promise<SingleUserResponseDto> {
    const user = await this.userModel.findOne({ email: email }).select('-emojis').lean().exec();
    if (!user) throw new NotFoundException('유저를 찾을 수 없습니다');
    return plainToInstance(SingleUserResponseDto, user, { excludeExtraneousValues: true });
  }

  /** <User Details>
   * getOwnedEmojis: 유저가 보유한 이모지 목록 get
   * response-OwnedEmojiResponseDto
   *
   * getRankCondition: 유저 랭크업 지표 get
   * response-RankConditionResponseDto
   */
  async getOwnedEmojis(id: string): Promise<OwnedEmojiResponseDto> {
    const user = await this.userModel
      .findById(id)
      .populate({ path: 'emojis', select: 'image' })
      .select('emojis')
      .lean()
      .exec();

    if (!user) throw new NotFoundException('유저를 찾을 수 없습니다');

    const images = (user.emojis as { image?: string }[]).map((emoji) => emoji.image || '');

    return {
      _id: user._id.toString(),
      emojis: images,
    };
  }

  async getRankCondition(user: UserDocument): Promise<RankConditionResponseDto> {
    const currentRank = user.rank;
    const currentRankIndex = RANK_ORDER.indexOf(user.rank as RankType);
    const nextRank = RANK_ORDER[currentRankIndex + 1];
    const condition = RANK_CONDITIONS[nextRank];

    const attendCountRequirement: RequirementDetail = {
      current: user.attendcount,
      required: condition.attendcount,
      isAchieved: user.attendcount >= condition.attendcount,
    };

    const rupaRequirement: RequirementDetail = {
      current: user.rupa,
      required: condition.rupa,
      isAchieved: user.rupa >= condition.rupa,
    };

    const canRankUp = attendCountRequirement.isAchieved && rupaRequirement.isAchieved;

    const result: RankConditionResponseDto = {
      currentRank,
      nextRank,
      requirements: {
        attendCount: attendCountRequirement,
        rupa: rupaRequirement,
      },
      canRankUp,
    };

    return result;
  }

  /** <single user document>
   * findUserDocumentById(ByEmail, ByNickname) : 내부 로직용
   */

  async findUserDocumentByEmail(email: string): Promise<UserDocument> {
    const user = await this.userModel.findOne({ email: email }).select('-emojis').exec();
    if (!user) throw new NotFoundException('유저를 찾을 수 없습니다');
    return user;
  }

  async findUserDocumentByNickname(nickname: string): Promise<UserDocument> {
    const user = await this.userModel.findOne({ nickname: nickname }).select('-emojis').exec();
    if (!user) throw new NotFoundException('유저를 찾을 수 없습니다');
    return user;
  }

  async findUserDocumentById(id: string): Promise<UserDocument> {
    const user = await this.userModel.findById(id).select('-emojis').exec();
    if (!user) throw new NotFoundException('유저를 찾을 수 없습니다');
    return user;
  }

  async isExist(email: string, nickname: string): Promise<void> {
    const isExistEmail = await this.userModel.findOne({ email: email }).exec();
    if (isExistEmail) {
      throw new ConflictException('이미 존재하는 이메일입니다.');
    }
    const isExistNickName = await this.userModel.findOne({ nickname: nickname }).exec();
    if (isExistNickName) {
      throw new ConflictException('이미 존재하는 닉네임입니다.');
    }
  }

  async findPassword(email: string): Promise<UserDocument> {
    const user = await this.userModel.findOne({ email }).select('+password').exec();
    if (!user) throw new NotFoundException('유저를 찾을 수 없습니다');
    return user;
  }
}
