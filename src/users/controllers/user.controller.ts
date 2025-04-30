import { Controller, Get, Post, Body, Param, Patch, Delete, Req } from '@nestjs/common';
import { UserQueryService } from '../service/user-query.service';
import { User } from 'src/common/decorators/user.decorator';
import { UpdateNicknameDto } from '../dto/req/update-user.dto';
import { UserCommandService } from '../service/user-command.service';
import { GetRankConditionResDto } from '../dto/res/user-rank-response.dto';
import { UserDocument } from '../schemas/user.schema';
import { PopulatedEmoji } from '../types/populate.type';

@Controller('users')
export class UsersController {
  constructor(
    private readonly userQueryService: UserQueryService,
    private readonly userCommandService: UserCommandService,
  ) {}

  @Get('my')
  async getMyInfo(@User('id') id: string): Promise<UserDocument> {
    return await this.userQueryService.findUserById(id);
  }

  @Get('rank-condition')
  async getRankCondition(@User('id') id: string): Promise<GetRankConditionResDto> {
    const user = await this.userQueryService.findUserById(id);
    const result = await this.userQueryService.getRankCondition(user);
    return result;
  }

  @Patch('rank')
  async updateRank(@User('id') id: string): Promise<GetRankConditionResDto> {
    const user = await this.userQueryService.findUserById(id);
    const condition = await this.userQueryService.getRankCondition(user);
    const updatedUser = await this.userCommandService.updateUserRank(user, condition);
    return await this.userQueryService.getRankCondition(updatedUser);
  }

  @Get(':id')
  async getOtherUser(@Param('id') id: string): Promise<UserDocument> {
    return await this.userQueryService.findUserDetails(id);
  }

  @Get('item')
  async getUserItems(@User('id') id: string): Promise<PopulatedEmoji[]> {
    return await this.userQueryService.getOwnedEmojis(id);
  }

  @Patch('nickname')
  async updateNickname(@User('id') id: string, @Body() dto: UpdateNicknameDto) {
    const user = await this.userQueryService.findUserById(id);
    return await this.userCommandService.updateUserNickname(user, dto.newNickname);
  }
}
