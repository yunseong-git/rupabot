import { Controller, Get, Patch, Param, Delete, UseGuards, Query } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { RankGuard } from 'src/common/guards/rank.guard';
import { Rank } from 'src/common/decorators/rank.decorator';
import { UserQueryService } from '../service/user-query.service';
import { UserCommandService } from '../service/user-command.service';
import { SoftDeleteService } from 'src/shared/services/soft-delete.service';
import { UserQueryDto, SearchUserQueryDto } from '../dto/user-query.dto';

@Controller('admin/users')
@UseGuards(AuthGuard, RankGuard)
@Rank('루파봇')
export class AdminUserController {
  constructor(
    private readonly userQueryService: UserQueryService,
    private readonly userCommandService: UserCommandService,
    private readonly softDeleteService: SoftDeleteService,
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

  //todo: 조금 더 RESTfull하게? id는 param 나머지는 쿼리로고민
  @Get(':id/byId')
  async getUsersById(@Param('id') id: string) {
    return await this.userQueryService.findUserById(id);
  }

  @Get(':email/byEmail')
  async getUsersByEmail(@Param('email') email: string) {
    return await this.userQueryService.findUserByEmail(email);
  }

  @Get(':nickname/byNickname')
  async getUsersByNickname(@Param('nickname') nickname: string) {
    return await this.userQueryService.findUserByNickname(nickname);
  }

  @Patch(':nickname/byNickname')
  async updateUser(@Param('nickname') nickname: string) {
    return await this.userQueryService.findUserByNickname(nickname);
  }

  @Patch(':nickname/byNickname')
  async deleteUser(@Param('nickname') nickname: string) {
    return await this.userQueryService.findUserByNickname(nickname);
  }
}
