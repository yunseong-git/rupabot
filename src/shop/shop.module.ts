import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { ShopService } from './shop.service';
import { ShopController } from './shop.controller';
import { Item, ItemSchema } from './schemas/emoji.schema';
import { UsersModule } from 'src/users/users.module';
import { WalletModule } from 'src/wallet/wallet.module';

@Module({
  imports: [MongooseModule.forFeature([
    { name: Item.name, schema: ItemSchema }
  ]),
    UsersModule,
    WalletModule,
  ],
  controllers: [ShopController],
  providers: [ShopService],
})
export class ShopModule { }
