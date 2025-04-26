import { Controller, Get, Post, Body, Patch, Param, Delete, Query } from '@nestjs/common';

import { Public } from 'src/common/decorators/public.decorator';
import { User } from 'src/common/decorators/user.decorator';

import { CommentDocument } from './schemas/comment.schema';
import { CommentsService } from './comments.service';

import { CreateCommentDto, UpdateCommentDto } from './dto/comment.dto';

@Controller('comments')
export class CommentsController {
    constructor(
        private readonly commentsService: CommentsService
    ) { }

    //todo: 
    @Post()
    async getAllPosts(@Body() dto: CreateCommentDto): Promise<CommentDocument> {
        return this.commentsService.f
    }
}
