import { Controller, Get, Post, Body, Param, UseGuards, Query } from '@nestjs/common';
import { Rank } from 'src/common/decorators/rank.decorator';
import { User } from 'src/common/decorators/user.decorator';
import { AuthGuard } from '@nestjs/passport';
import { RankGuard } from 'src/common/guards/rank.guard';
import { EmojiService } from './emoji.service';

import { BuyEmojiDto } from './dto/req/buy-emoji.dto';
import { CreateEmojiDto } from './dto/req/create-emoji.dto';
import { EmojiQueryDto, EmojiSearchDto } from './dto/req/query-emoji.dto';
import { EmojisResponseDto } from './dto/res/query-emoji-response.dto';
import { CreateEmojiResponseDto } from './dto/res/create-emoji-response.dto';


@Controller('emojis')
export class EmojiController {
  constructor(
    private readonly emojiService: EmojiService,
  ) { }

  @Post('buy')
  async buyEmoji(@Body() dto: BuyEmojiDto, @User() userId: string) {
    //return await this.transactionService.buyEmoji(dto, userId);
  }

  @Get()
  async getAllEmojis(@Query() dto: EmojiQueryDto): Promise<EmojisResponseDto[]> {
    return await this.emojiService.findAllEmojis(dto);
  }

  @Get('search')
  async searchEmojis(@Query() dto: EmojiSearchDto): Promise<EmojisResponseDto[]> {
    return await this.emojiService.searchEmojiByName(dto);
  }

  @Get(':id')
  async getEmojiDetail(@Param() id: string): Promise<EmojisResponseDto> {
    return await this.emojiService.findEmojiById(id);
  }



  @UseGuards(AuthGuard(), RankGuard)
  @Rank('루파봇')
  @Post()
  async createEmoji(@Body() dto: CreateEmojiDto): Promise<CreateEmojiResponseDto> {
    return await this.emojiService.createEmoji(dto);
  }
}
