import { Controller, Get, Post, Body, Patch, Param, Delete, Query } from '@nestjs/common';
import { User } from 'src/common/decorators/user.decorator';
import { toResponse, toResponseArray } from 'src/common/utils/toResponse.utill';
//service
import { CommentQueryService } from '../services/comment-query.service';
import { CommentCommandService } from '../services/comment-command.service';
//dto(req)
import { PostWithCommentsQueryDto } from 'src/board/posts/dto/req/post-query.dto';
import { ReplyCommentQueryDto, MyCommentQueryDto } from '../dto/req/comment-query.dto';
//dto(res)
import {
  CommentsNotPidResponseDto,
  CommentsWithPidResponseDto,
  SingleCommentResponseDto,
} from '../dto/res/comment-query-response.dto';
import { CreateCommentDto, UpdateCommentDto } from '../dto/req/comment-command.dto';
import { ApiBody, ApiOperation, ApiParam, ApiQuery, ApiResponse } from '@nestjs/swagger';
import {
  CommentIdResponseDto,
  CommentLikeResponseDto,
  DeleteCommentResponseDto,
  UpdateCommentResponseDto,
} from '../dto/res/comment-command-response.dto';

@Controller('comments')
export class CommentController {
  constructor(
    private readonly commentQuerySerivce: CommentQueryService,
    private readonly commentCommandService: CommentCommandService,
  ) {}

  /**<query>단일 댓글 조회*/
  @ApiOperation({ summary: '단일 댓글 조회(유저태그 없음)' })
  @ApiParam({ name: 'id', description: '댓글 ID' })
  @ApiResponse({ status: 200, description: '단일 댓글', type: SingleCommentResponseDto })
  @Get(':id')
  async getComment(@Param('id') id: string): Promise<SingleCommentResponseDto> {
    const comment = await this.commentQuerySerivce.findCommentById(id);

    return toResponse(SingleCommentResponseDto, comment);
  }

  /**<query>게시물의 모든 댓글들 조회(답/댓 미구분)*/
  @Get('all/:postId')
  @ApiOperation({ summary: '게시물의 모든 댓글 조회(답/댓 미구분)' })
  @ApiQuery({ type: PostWithCommentsQueryDto })
  @ApiParam({ name: 'postId', description: '게시물 ID' })
  @ApiResponse({ status: 200, description: '전체 댓글', type: [CommentsWithPidResponseDto] })
  async getAllCommentsByPost(
    @Param('postId') postId: string,
    @Query() query: PostWithCommentsQueryDto,
  ): Promise<CommentsWithPidResponseDto[]> {
    const comments = await this.commentQuerySerivce.findAllCommentsByPost(query, postId);

    return toResponseArray(CommentsWithPidResponseDto, comments);
  }

  /**<query>게시물의 부모 댓글들 조회(답글 미포함)*/
  @Get('parents/:postId')
  @ApiOperation({ summary: '게시물의 모든 댓글 조회(답글 미포함)' })
  @ApiQuery({ type: PostWithCommentsQueryDto })
  @ApiParam({ name: 'postId', description: '게시물 ID' })
  @ApiResponse({ status: 200, description: '답글 미포함 전체 댓글', type: [CommentsNotPidResponseDto] })
  async getParentsCommentsByPost(
    @Param('postId') postId: string,
    @Query() query: PostWithCommentsQueryDto,
  ): Promise<CommentsNotPidResponseDto[]> {
    const comments = await this.commentQuerySerivce.findParentsCommentsByPost(query, postId);

    return toResponseArray(CommentsNotPidResponseDto, comments);
  }

  /**<query>단일 댓글의 답글 조회*/
  @Get('reply')
  @ApiOperation({ summary: '부모 댓글에 대한 답글 조회' })
  @ApiQuery({ type: ReplyCommentQueryDto })
  @ApiResponse({ status: 200, description: '답글 조회', type: [CommentsNotPidResponseDto] })
  async getReplyCommentsByParent(@Query() query: ReplyCommentQueryDto): Promise<CommentsNotPidResponseDto[]> {
    const comments = await this.commentQuerySerivce.findReplyCommentsByParent(query);

    return toResponseArray(CommentsNotPidResponseDto, comments);
  }

  /**<query>user가 작성한 모든 댓글 조회(답글 포함)*/
  @Get('my')
  @ApiOperation({ summary: 'user가 작성한 모든 댓글 조회(답글 포함)' })
  @ApiQuery({ type: MyCommentQueryDto })
  @ApiResponse({ status: 200, description: '내 답글들 조회', type: [SingleCommentResponseDto] })
  async getMyComments(
    @Query() query: MyCommentQueryDto,
    @User('userId') userId: string,
  ): Promise<SingleCommentResponseDto[]> {
    const comments = await this.commentQuerySerivce.findMyComments(query, userId);

    return toResponseArray(SingleCommentResponseDto, comments);
  }

  @Post()
  @ApiOperation({ summary: '댓글 생성' })
  @ApiBody({ type: CreateCommentDto })
  @ApiResponse({ status: 200, description: '생성 완료', type: CommentIdResponseDto })
  async createComment(@Body() dto: CreateCommentDto, @User('userId') userId: string): Promise<CommentIdResponseDto> {
    let result: string;
    if (!dto.pId) result = await this.commentCommandService.createComment(dto, userId);
    else result = await this.commentCommandService.createReplyComment(dto, userId);
    return { CommentId: result };
  }

  @Post(':id/like')
  @ApiOperation({ summary: '댓글 좋아요 동작' })
  @ApiParam({ name: 'id', description: '댓글 ID' })
  @ApiResponse({ status: 200, description: '반영 완료', type: CommentLikeResponseDto })
  async commentLike(@Param('id') commentId: string, @User('userId') userId: string): Promise<CommentLikeResponseDto> {
    const result = await this.commentCommandService.commentLike(commentId, userId);

    return { status: result };
  }

  @Patch(':id')
  @ApiOperation({ summary: '댓글 업데이트' })
  @ApiParam({ name: 'id', description: '댓글 ID' })
  @ApiBody({ type: UpdateCommentDto })
  @ApiResponse({ status: 200, description: '업데이트 완료', type: UpdateCommentResponseDto })
  async updateComment(
    @Param('id') commentId: string,
    @Body() dto: UpdateCommentDto,
    @User('userId') userId: string,
  ): Promise<UpdateCommentResponseDto> {
    await this.commentQuerySerivce.isAuthor(userId, commentId);
    await this.commentCommandService.updateComment(dto);

    return { isUpdated: true };
  }

  @Delete(':id')
  @ApiOperation({ summary: '댓글 삭제' })
  @ApiParam({ name: 'id', description: '댓글 ID' })
  @ApiResponse({ status: 200, description: '삭제 완료', type: DeleteCommentResponseDto })
  async deleteComment(
    @Param('id') commentId: string,
    @User('userId') userId: string,
  ): Promise<DeleteCommentResponseDto> {
    await this.commentQuerySerivce.isAuthor(userId, commentId);
    await this.commentCommandService.softDeleteComment(commentId, userId);

    return { isDeleted: true };
  }
}
