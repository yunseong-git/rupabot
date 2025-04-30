import { Controller, Get, Patch, Param, Delete, UseGuards, Query, Body } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { RankGuard } from 'src/common/guards/rank.guard';
import { Rank } from 'src/common/decorators/rank.decorator';
import { UserQueryService } from '../service/user-query.service';
import { UserCommandService } from '../service/user-command.service';
import { UserQueryDto, SearchUserQueryDto } from '../dto/req/user-query.dto';
import { UserDocument } from '../schemas/user.schema';

@Controller('admin/users')
@UseGuards(AuthGuard, RankGuard)
@Rank('루파봇')
export class AdminUserController {
  constructor(
    private readonly userQueryService: UserQueryService,
    private readonly userCommandService: UserCommandService,
  ) {}

  @Get()
  async getAllUsers(@Query() query: UserQueryDto) {
    return await this.userQueryService.findAllUsers(query);
  }

  @Get('/ban')
  async getBannedUsers(@Query() query: UserQueryDto) {
    return await this.userQueryService.findBannedUsers(query);
  }

  @Get('/search')
  async searchUsers(@Query() query: SearchUserQueryDto) {
    return await this.userQueryService.searchUsers(query);
  }

  @Get(':id/byId')
  async getUsersById(@Param('id') id: string) {
    return await this.userQueryService.findUserById(id);
  }

  @Get(':email/byEmail')
  async getUsersByEmail(@Param('email') email: string) {
    return await this.userQueryService.findUserByEmail(email);
  }

  @Patch('active/ban')
  async activateUserBan(@Param('id') id: string, @Body() bancount: number): Promise<UserDocument> {
    const user = await this.userQueryService.findUserById(id);
    return await this.userCommandService.activateUserBan(user, bancount);
  }

  @Patch('deactive/ban')
  async deactivateUserBan(@Param('id') id: string): Promise<UserDocument> {
    const user = await this.userQueryService.findUserById(id);
    return await this.userCommandService.deactivateUserBan(user);
  }
}
