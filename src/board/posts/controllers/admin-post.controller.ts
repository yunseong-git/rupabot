import { Controller, Get, Post, Body, Patch, Param, Delete, Req, Query } from '@nestjs/common';

import { Public } from 'src/common/decorators/public.decorator';
import { User } from 'src/common/decorators/user.decorator';

import { PostDocument } from '../schemas/post.schema';
import { PostCommandService } from '../services/post-command.service';
import { PostQueryService } from '../services/post-query.service';


//dto
import { CommentQueryService } from 'src/board/comments/services/comment-query.service';
import { CommentCommandService } from 'src/board/comments/services/comment-command.service';

@Controller('admin-posts')
export class AdminPostController {
  constructor(
    private readonly postQueryService: PostQueryService,
    private readonly postCommandService: PostCommandService,
    private readonly commentQueryService: CommentQueryService,
    private readonly commentCommandService: CommentCommandService,
  ) { }
}
