import { Controller, Get, Post, Body, Patch, Param, Delete, Req, Query } from '@nestjs/common';

import { Public } from 'src/common/decorators/public.decorator';
import { User } from 'src/common/decorators/user.decorator';

import { PostDocument } from '../schemas/post.schema';
import { PostCommandService } from '../services/post-command.service';
import { PostQueryService } from '../services/post-query.service';
import { SoftDeleteService } from 'src/shared/services/soft-delete.service';
import { CommentsService } from '../../comments/comments.service';
import { PostWithCommentsResponse } from '../../types/board.types';

//dto
import { CreatePostDto, UpdatePostDto } from '../dto/req/post.dto';
import { PostQueryDto, LikedPostQueryDto, SearchedPostQueryDto, DeletedPostQueryDto } from '../dto/req/post-query.dto';

@Controller('admin-posts')
export class AdminPostController {
  constructor(
    private readonly postQueryService: PostQueryService,
    private readonly commentsService: CommentsService,
    private readonly softDeleteService: SoftDeleteService,
  ) {}

  @Get('deleted')
  async getDeletedPost(@Query() query: DeletedPostQueryDto): Promise<ManyPostsResponseDto[]>  {
    return await this.postQueryService.findDeletedPosts(query);
  }
}
