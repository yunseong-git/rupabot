import { Controller, Get, Patch, Param, Delete, UseGuards, Query, Body } from '@nestjs/common';
import { Rank } from 'src/common/decorators/rank.decorator';
//guard
import { AuthGuard } from '@nestjs/passport';
import { RankGuard } from 'src/common/guards/rank.guard';
//service
import { UserQueryService } from '../service/user-query.service';
import { UserCommandService } from '../service/user-command.service';
//req dto
import { UsersQueryDto, SearchUsersQueryDto } from '../dto/req/user-query.dto';
//res dto
import { ManyUsersResponseDto, SingleUserResponseDto } from '../dto/res/user-query-response.dto';
import { UserBanResponseDto } from '../dto/res/update-user-response.dto';
import { BanUserDto } from '../dto/req/ban-user.dto';

@Controller('admin/users')
@UseGuards(AuthGuard, RankGuard)
@Rank('루파봇')
export class AdminUserController {
  constructor(
    private readonly userQueryService: UserQueryService,
    private readonly userCommandService: UserCommandService,
  ) {}

  @Get()
  async getAllUsers(@Query() query: UsersQueryDto): Promise<ManyUsersResponseDto[]> {
    return await this.userQueryService.findAllUsers(query);
  }

  @Get('/ban')
  async getBannedUsers(@Query() query: UsersQueryDto): Promise<ManyUsersResponseDto[]> {
    return await this.userQueryService.findBannedUsers(query);
  }

  @Get('/search')
  async searchUsers(@Query() query: SearchUsersQueryDto): Promise<ManyUsersResponseDto[]> {
    return await this.userQueryService.searchUsers(query);
  }

  @Get(':id/byId')
  async getUsersById(@Param('id') id: string): Promise<SingleUserResponseDto> {
    return await this.userQueryService.findUserById(id);
  }

  @Get(':email/byEmail')
  async getUsersByEmail(@Param('email') email: string): Promise<SingleUserResponseDto> {
    return await this.userQueryService.findUserByEmail(email);
  }

  @Patch('active/ban')
  async activateUserBan(@Param('id') id: string, @Body() dto: BanUserDto): Promise<UserBanResponseDto> {
    const user = await this.userQueryService.findUserDocumentById(id);
    return await this.userCommandService.activateUserBan(user, dto.bancount);
  }

  @Patch('deactive/ban')
  async deactivateUserBan(@Param('id') id: string): Promise<UserBanResponseDto> {
    const user = await this.userQueryService.findUserDocumentById(id);
    return await this.userCommandService.deactivateUserBan(user);
  }
}
