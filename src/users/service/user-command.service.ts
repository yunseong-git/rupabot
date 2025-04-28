import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { User, UserDocument } from '../schemas/user.schema';
import { Model } from 'mongoose';
import { CreateUserDto } from '../dto/create-user.dto';
import { UpdateNicknameDto } from '../dto/update-user.dto';

@Injectable()
export class UserCommandService {
  constructor(@InjectModel(User.name) private userModel: Model<UserDocument>) {}

  async createUser(dto: CreateUserDto) {
    const created = new this.userModel(dto);
    return created.save();
  }

  async updateUserNickname(id: string, newNickname: string) {
    const user = await this.userModel.findById(id).exec();
    if (!user) {
      throw new NotFoundException('정보를 찾을 수 없습니다.');
    }
    await this.validateNicknameChange(user, newNickname);

    user.nickname = newNickname;
    user.nicknameUpdatedAt = new Date();
    await user.save();
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
