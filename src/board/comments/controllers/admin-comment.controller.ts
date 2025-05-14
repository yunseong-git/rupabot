import { Controller, Get, Post, Body, Patch, Param, Delete, Query } from '@nestjs/common';
import { User } from 'src/common/decorators/user.decorator';
import { toCommandResponse, toResponse, toResponseArray } from 'src/common/utils/toResponse.utill';

//service
import { CommentQueryService } from '../services/comment-query.service';

//dto(req)

//dto(res)
import { CommentCommandService } from '../services/comment-command.service';

@Controller('admin-comments')
export class AdminCommentController {
  constructor(
    private readonly commentQuerySerivce: CommentQueryService,
    private readonly commentCommandService: CommentCommandService,
  ) { }
}