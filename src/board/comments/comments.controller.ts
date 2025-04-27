import { Controller, Get, Post, Body, Patch, Param, Delete, Query } from '@nestjs/common';

import { User } from 'src/common/decorators/user.decorator';

import { CommentsService } from './comments.service';
import { SoftDeleteService } from 'src/shared/services/soft-delete.service';

import { CreateCommentDto, CreateReplyCommentDto, UpdateCommentDto } from './dto/comment.dto';

@Controller('comments')
export class CommentsController {
  constructor(
    private readonly commentsService: CommentsService,
    private readonly softDeleteService: SoftDeleteService,
  ) {}

  //todo:
  @Get(':id')
  async getComment(@Param('id') id: string) {
    return await this.commentsService.findOneCommentById(id);
  }

  @Get(':pid/reply')
  async getReplyComments(@Param('pId') pId: string) {
    return await this.commentsService.findReplyCommentsByParent(pId);
  }

  @Get(':postId')
  async getParentComments(@Param('postId') postId: string) {
    return await this.commentsService.findParentCommentsByPost(postId);
  }

  @Get('my')
  async getMyComments(@User('userId') userId: string) {
    return await this.commentsService.findMyComments(userId);
  }

  @Post()
  async createComment(@Body() dto: CreateCommentDto, @User('userId') userId: string) {
    return await this.commentsService.createComment(dto, userId);
  }

  @Post('reply')
  async createReplyComment(@Body() dto: CreateReplyCommentDto, @User('userId') userId: string) {
    return await this.commentsService.createReplyComment(dto, userId);
  }

  @Post(':id/like')
  async commentLike(@Param('id') id: string, @Query() query: string, @User('userId') userId: string) {
    return await this.commentsService.commentLike(id, userId);
  }

  @Patch()
  async updateComment(@Body() dto: UpdateCommentDto, @User('userId') userId: string) {
    return this.commentsService.updateComment(dto, userId);
  }

  @Delete('id')
  async deleteComment(@Param('postId') postId: string, @User('userId') userId: string) {
    await this.commentsService.isAuthor(userId, postId);
    return await this.softDeleteService.softDeleteComment(postId);
  }
}
