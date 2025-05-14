import { Injectable } from '@nestjs/common';
import { User, UserDocument } from 'src/users/schemas/user.schema';
import { InjectModel } from '@nestjs/mongoose';
import { Types, Model } from 'mongoose';
import { UserTag } from './dto/res/post-query-response.dto';

@Injectable()
export class BoardUtilService {
  constructor(@InjectModel(User.name) private readonly userModel: Model<UserDocument>) {}

  //
  async mapUserTagsToObjects<T extends { authorId: Types.ObjectId | string }>(
    objects: T[],
  ): Promise<(T & { userTag: UserTag })[]> {
    //author 중복제거
    const authorIds = [...new Set(objects.map((obj) => obj.authorId.toString()))];

    //유저 검색
    const users = await this.userModel
      .find({ _id: { $in: authorIds } })
      .select('nickname rank')
      .lean();

    //유저 id타입변환
    const userMap = new Map(users.map((u) => [u._id.toString(), u]));

    const result = objects.map((obj) => ({
      ...obj,
      userTag: {
        nickname: userMap.get(obj.authorId.toString())?.nickname || 'unknown',
        rank: userMap.get(obj.authorId.toString())?.rank || 'unknown',
      },
    }));

    return result;
  }
}
