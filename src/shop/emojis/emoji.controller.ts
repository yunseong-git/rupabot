import { Controller, Get, Post, Body, Param, UseGuards } from '@nestjs/common';
import { Rank } from 'src/common/decorators/rank.decorator';
import { User } from 'src/common/decorators/user.decorator';
import { AuthGuard } from '@nestjs/passport';
import { RankGuard } from 'src/common/guards/rank.guard';
import { EmojiService } from './emoji.service';
import { TransactionService } from 'src/shared/services/transaction.service';
import { BuyEmojiDto } from './dto/req/buy-emoji.dto';
import { CreateEmojiDto } from './dto/req/create-emoji.dto';

@Controller('emojis')
export class EmojiController {
  constructor(
    private readonly emojiService: EmojiService,
    private readonly transactionService: TransactionService,
  ) {}

  @Get()
  async getSalesEmojis() {
    return await this.emojiService.findSalesEmojis();
  }

  @Get(':id')
  async getEmojiDetail(@Param() id: string) {
    return await this.emojiService.findEmojiById(id);
  }

  @Post('buy')
  async buyEmoji(@Body() dto: BuyEmojiDto, @User() userId: string) {
    return await this.transactionService.buyEmoji(dto, userId);
  }

  @Get('my')
  async getMyEmojis(@User() userId: string) {
    return await this.emojiService.findMyEmojis();
  }

  @UseGuards(AuthGuard, RankGuard)
  @Rank('루파봇')
  @Post()
  async createEmoji(@Body() dto: CreateEmojiDto) {
    return await this.emojiService.createEmoji(dto);
  }
}
