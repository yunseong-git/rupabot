import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { User, UserDocument } from '../schemas/user.schema';
import { Model, SortOrder } from 'mongoose';
import { UserQueryDto, SearchUserQueryDto, UserRankQueryDto } from '../dto/user-query.dto';

type FindOptions = {
  sortOption?: Record<string, SortOrder>;
};

@Injectable()
export class UserQueryService {
  constructor(@InjectModel(User.name) private userModel: Model<UserDocument>) {}

  async findAllUsers(query: UserQueryDto) {
    const { sort, limit = 10, skip = 0 } = query;

    const filter = {};

    const option: FindOptions = {
      sortOption: sort ? { [sort]: 1 } : undefined,
    };

    return await this.findManyUsers(filter, limit, skip, option);
  }

  async searchUsers(query: SearchUserQueryDto) {
    const { nickname, sort, limit = 10, skip = 0 } = query;

    const filter = { nickname: { $regex: nickname, $options: 'i' } }; // 대소문자 무시 검색

    const options: FindOptions = {
      sortOption: sort ? { [sort]: 1 } : undefined,
    };

    return await this.findManyUsers(filter, limit, skip, options);
  }

  async findBannedUsers(query: UserQueryDto) {
    const { sort, limit = 10, skip = 0 } = query;

    const filter = { bannedCount: { $gt: 1 } };

    const options: FindOptions = {
      sortOption: sort ? { [sort]: 1 } : undefined,
    };

    return await this.findManyUsers(filter, limit, skip, options);
  }

  private async findManyUsers(filter: any, limit: number, skip: number, option?: FindOptions) {
    let query = this.userModel.find(filter).select('-items -image');

    if (option?.sortOption) {
      query = query.sort(option.sortOption);
    }
    return query.limit(limit).skip(skip).exec();
  }

  //유저 간 조회용
  async findUserDetails(id: string) {
    const user = await this.userModel.findById(id).select('-items -email');
    if (!user) throw new NotFoundException('유저를 찾을 수 없습니다');
    return user;
  }

  async findUserById(id: string) {
    const user = await this.userModel.findById(id).select('-items');
    if (!user) throw new NotFoundException('유저를 찾을 수 없습니다');
    return user;
  }

  async findUserByEmail(email: string) {
    const user = await this.userModel.findOne({ email: email }).exec();
    if (!user) throw new NotFoundException('유저를 찾을 수 없습니다');
    return user;
  }

  async findUserByNickname(nickname: string) {
    const user = await this.userModel.findOne({ nickname: nickname }).exec();
    if (!user) throw new NotFoundException('유저를 찾을 수 없습니다');
    return user;
  }

  async getOwnedItemIds(id: string) {
    const user = await this.userModel.findById(id).select('items');
    if (!user) throw new NotFoundException('유저를 찾을 수 없습니다');
    return user.items;
  }

  /* 추후 transaction으로 이동
  async findById(userId: string, session: ClientSession | null = null) {
    return this.userModel.findById(userId).session(session);
  }
    */
}
