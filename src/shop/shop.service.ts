import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel, InjectConnection } from '@nestjs/mongoose';
import { Model, Connection } from 'mongoose';
import { BadRequestException } from '@nestjs/common';

import { UsersService } from 'src/users/users.service';
import { WalletService } from 'src/wallet/wallet.service';

import { Item, ItemDocument } from './schemas/item.schema';
import { User,UserDocument } from 'src/users/schemas/user.schema';
import { Wallet,WalletDocument } from '../wallet/schemas/wallet.schema';
import { CreateItemDto } from './dto/create-item.dto';
import { UpdateItemDto } from './dto/update-shop.dto';
import { BuyItemDto } from './dto/buy-item.dto';

@Injectable()
export class ShopService {
  constructor(
    @InjectModel(User.name) private readonly userModel: Model<UserDocument>,
    @InjectModel(Item.name) private readonly itemModel: Model<ItemDocument>,
    @InjectModel(Wallet.name) private readonly walletModel: Model<WalletDocument>,
    @InjectConnection() private readonly connection: Connection, // 👈 이게 핵심!
  ) { }

  async create(dto: CreateItemDto) {
    const created = new this.itemModel(dto);
    return created.save();
  }

  async findAll() {
    return this.itemModel.find().exec();
  }

  async findOne(id: string) {
    const item = await this.itemModel.findById(id);
    if (!item) throw new NotFoundException('아이템를 찾을 수 없습니다');
    return item;
  }

  // 아이템 구매(트랜잭션)
  async buyItem(userId: string, itemId: string) {
    const session = await this.connection.startSession();
  
    try {
      await session.withTransaction(async () => {
        // 1. 아이템 조회
        const item = await this.itemModel.findById(itemId).session(session);
        if (!item) throw new NotFoundException('아이템이 존재하지 않습니다');
  
        // 2. 유저 조회
        const user = await this.userModel.findById(userId).session(session);
        if (!user) throw new NotFoundException('유저가 존재하지 않습니다');
        if (user.lupa < item.price) throw new BadRequestException('루파 부족');
  
        // 3. 유저 업데이트 (재화 차감 + 아이템 추가)
        await this.userModel.updateOne(
          { _id: userId },
          {
            $inc: { lupa: -item.price },
            $push: { items: item._id },
          },
          { session },
        );
  
        // 4. 거래내역 기록
        await this.walletModel.create(
          [{
            userId,
            type: '구매',
            content: item.name,
            price: -item.price,
            left: user.lupa - item.price,
          }],
          { session },
        );
      });
  
      return { success: true, message: '구매 성공' };
    } finally {
      await session.endSession();
    }
  }

  async update(id: string, dto: UpdateItemDto) {
    const updated = await this.itemModel.findByIdAndUpdate(id, dto, { new: true });
    if (!updated) throw new NotFoundException('업데이트 실패');
    return updated;
  }

  async remove(id: string) {
    return this.itemModel.findByIdAndDelete(id);
  }
}
