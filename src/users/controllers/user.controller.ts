import { Controller, Get, Post, Body, Param, Patch, Delete, Req } from '@nestjs/common';
import { User } from 'src/common/decorators/user.decorator';

//service
import { UserQueryService } from '../service/user-query.service';
import { UserCommandService } from '../service/user-command.service';

//req dto
import { UpdateNicknameDto } from '../dto/req/update-user.dto';

//res dto
import { UserRankUpResponseDto, UpdateUserNicknameResponseDto } from '../dto/res/update-user-response.dto';
import { SingleUserResponseDto, UserToUserResponseDto } from '../dto/res/user-query-response.dto';
import { OwnedEmojiResponseDto } from '../dto/res/user-emoji-response.dto';
import { RankConditionResponseDto } from '../dto/res/user-rank-response.dto';

@Controller('users')
export class UsersController {
  constructor(
    private readonly userQueryService: UserQueryService,
    private readonly userCommandService: UserCommandService,
  ) {}

  @Get('my')
  async getMyInfo(@User('id') id: string): Promise<SingleUserResponseDto> {
    return await this.userQueryService.findUserById(id);
  }

  @Get('rank-condition')
  async getRankCondition(@User('id') id: string): Promise<RankConditionResponseDto> {
    const user = await this.userQueryService.findUserDocumentById(id);
    const result = await this.userQueryService.getRankCondition(user);
    return result;
  }

  @Patch('rank')
  async updateRank(@User('id') id: string): Promise<UserRankUpResponseDto> {
    const user = await this.userQueryService.findUserDocumentById(id);
    const condition = await this.userQueryService.getRankCondition(user);
    return await this.userCommandService.updateUserRank(user, condition);
  }

  @Get(':id')
  async getOtherUser(@Param('id') id: string): Promise<UserToUserResponseDto> {
    return await this.userQueryService.findUserByUser(id);
  }

  @Get('item')
  async getUserEmojis(@User('id') id: string): Promise<OwnedEmojiResponseDto> {
    return await this.userQueryService.getOwnedEmojis(id);
  }

  @Patch('nickname')
  async updateNickname(@User('id') id: string, @Body() dto: UpdateNicknameDto): Promise<UpdateUserNicknameResponseDto> {
    const user = await this.userQueryService.findUserDocumentById(id);
    return await this.userCommandService.updateUserNickname(user, dto.newNickname);
  }
}
