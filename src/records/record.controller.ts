import { Controller, Get, Post, Body, Param, UseGuards, Query } from '@nestjs/common';
import { RecordService } from './record.service';
import { RecordQueryDto } from './dto/query-record.dto';
import { User } from 'src/common/decorators/user.decorator';
import { AuthGuard } from '@nestjs/passport';
import { RankGuard } from 'src/common/guards/rank.guard';
import { Rank } from 'src/common/decorators/rank.decorator';
import { UserQueryService } from 'src/users/service/user-query.service';
import { RecordQueryResponseDto, AdminRecordQueryResponseDto } from './dto/query-record-response.dto';

@Controller('record')
export class RecordController {
  constructor(
    private readonly recordService: RecordService,
    private readonly userQueryService: UserQueryService,
  ) { }

  @Get()
  async getMyRecords(@Query() dto: RecordQueryDto, @User() userId: string): Promise<RecordQueryResponseDto[]> {
    return await this.recordService.findMyRecords(userId, dto);
  }

  @UseGuards(AuthGuard, RankGuard)
  @Rank('루파봇')
  @Get(':userId/admin')
  async getUserRecords(@Param('userId') userId: string, @Query() dto: RecordQueryDto): Promise<AdminRecordQueryResponseDto[]> {
    const user = await this.userQueryService.findUserDocumentById(userId);
    return await this.recordService.adminFindRecords(user, dto);
  }
}
