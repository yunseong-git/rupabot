import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { User, UserDocument } from './schemas/user.schema';
import { Model } from 'mongoose';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { ClientSession } from 'mongoose';

@Injectable()
export class UsersService {
  constructor(@InjectModel(User.name) private userModel: Model<UserDocument>) {}

  async create(dto: CreateUserDto) {
    const created = new this.userModel(dto);

    return created.save();
  }

  async findAll() {
    return this.userModel.find().exec();
  }

  async findOne(id: string) {
    const user = await this.userModel.findById(id);
    if (!user) throw new NotFoundException('유저를 찾을 수 없습니다');
    return user;
  }

  async findByEmail(email: string) {
    return this.userModel.findOne({ email: email }).exec();
  }

  async findByNickname(nickname: string) {
    return this.userModel.findOne({ nickname: nickname }).exec();
  }

  async getOwnedItemIds(userId: string): Promise<string[]> {
    const user = await this.userModel.findById(userId).select('items').lean();
    const list = user?.items.map((id) => id.toString()) || [];

    return list;
  }

  async findById(userId: string, session: ClientSession | null = null) {
    return this.userModel.findById(userId).session(session);
  }

  async addItem(
    userId: string,
    itemId: string,
    price: number,
    session?: ClientSession,
  ) {
    return this.userModel.findByIdAndUpdate(
      userId,
      {
        $inc: { lupa: -price },
        $push: { items: itemId },
      },
      { new: true, session },
    );
  }

  async update(id: string, dto: UpdateUserDto) {
    const updated = await this.userModel.findByIdAndUpdate(id, dto, {
      new: true,
    });
    if (!updated) throw new NotFoundException('업데이트 실패');
    return updated;
  }

  async remove(id: string) {
    return this.userModel.findByIdAndDelete(id);
  }
}
