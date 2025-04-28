import { Controller, Get, Post, Body, Param, Patch, Delete, Req } from '@nestjs/common';
import { UserQueryService } from '../service/user-query.service';
import { User } from 'src/common/decorators/user.decorator';
import { CreateUserDto } from '../dto/create-user.dto';
import { UpdateNicknameDto } from '../dto/update-user.dto';
import { SoftDeleteService } from 'src/shared/services/soft-delete.service';
import { UserCommandService } from '../service/user-command.service';

@Controller('users')
export class UsersController {
  constructor(
    private readonly userQueryService: UserQueryService,
    private readonly userCommandService: UserCommandService,
    private readonly softDeleteService: SoftDeleteService,
  ) {}

  @Get('my')
  async getMyInfo(@User('id') id: string) {
    return await this.userQueryService.findUserById(id);
  }

  @Get(':id')
  async getOtherUser(@Param('id') id: string) {
    return await this.userQueryService.findUserDetails(id);
  }

  @Get('item')
  async getUserItems(@User('id') id: string) {
    return await this.userQueryService.getOwnedItemIds(id);
  }

  @Patch('nickname')
  async updateNickname(@User('id') id: string, @Body() dto: UpdateNicknameDto) {
    return await this.userCommandService.updateUserNickname(id, dto.newNickname);
  }
}
