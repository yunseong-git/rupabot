import { Controller, Get, Post, Body, Patch, Param, Delete, Query } from '@nestjs/common';
import { User } from 'src/common/decorators/user.decorator';
import { toCommandResponse, toResponse, toResponseArray } from 'src/common/utils/toResponse.utill';

//service
import { CommentQueryService } from '../services/comment-query.service';

//dto(req)
import { PostQueryDto } from 'src/board/posts/dto/req/post-query.dto';
import { CommentQueryDto } from '../dto/req/comment-query.dto';

//dto(res)
import { CommonResponseDto } from 'src/common/dto/common-response.dto';
import { CommentQueryResponseDto } from '../dto/res/comment-query-response.dto';
import { CommentCommandService } from '../services/comment-command.service';
import { CommentCommandDto } from '../dto/req/comment-command.dto';

@Controller('comments')
export class CommentController {
  constructor(
    private readonly commentQuerySerivce: CommentQueryService,
    private readonly commentCommandService: CommentCommandService,
  ) { }

  /**<query>단일 댓글 조회*/
  @Get(':id')
  async getComment(@Param('id') id: string): Promise<CommonResponseDto<CommentQueryResponseDto.Single>> {
    const comment = await this.commentQuerySerivce.findCommentById(id)

    return toResponse(CommentQueryResponseDto.Single, comment, "단일 댓글 조회 완료")
  }

  /**<query>게시물의 모든 댓글들 조회(답/댓 미구분)*/
  @Get('all/by-Post')
  async getAllCommentsByPost(@Query() query: PostQueryDto.WithComments): Promise<CommonResponseDto<CommentQueryResponseDto.WithPid[]>> {
    const comments = await this.commentQuerySerivce.findAllCommentsByPost(query);

    return toResponseArray(CommentQueryResponseDto.WithPid, comments, "미구분 댓글 조회 완료")
  }

  /**<query>게시물의 부모 댓글들 조회(답글 미포함)*/
  @Get('parents/by-Post')
  async getParentsCommentsByPost(@Query() query: PostQueryDto.WithComments): Promise<CommonResponseDto<CommentQueryResponseDto.NotPid[]>> {
    const comments = await this.commentQuerySerivce.findParentsCommentsByPost(query);

    return toResponseArray(CommentQueryResponseDto.NotPid, comments, "부모 댓글 조회 완료")
  }

  /**<query>단일 댓글의 답글 조회*/
  @Get('reply')
  async getReplyCommentsByParent(@Query() query: CommentQueryDto.Reply): Promise<CommonResponseDto<CommentQueryResponseDto.NotPid[]>> {
    const comments = await this.commentQuerySerivce.findReplyCommentsByParent(query);

    return toResponseArray(CommentQueryResponseDto.NotPid, comments, "답글 조회 완료")
  }

  /**<query>user가 작성한 모든 댓글 조회(답글 포함)*/
  @Get('my')
  async getMyComments(@Query() query: CommentQueryDto.My, @User('userId') userId: string): Promise<CommonResponseDto<CommentQueryResponseDto.My[]>> {
    const comments = await this.commentQuerySerivce.findMyComments(query, userId);

    return toResponseArray(CommentQueryResponseDto.My, comments, "내 댓글 조회 완료")
  }

  /**<command>user가 작성한 모든 댓글 조회(답글 포함)*/
  @Post()
  async createComment(@Body() dto: CommentCommandDto.Create, @User('userId') userId: string) {
    const result = await this.commentCommandService.createComment(dto, userId);

    return toCommandResponse(result, "댓글 생성 완료")
  }

  @Post('reply')
  async createReplyComment(@Body() dto: CommentCommandDto.CreateReply, @User('userId') userId: string) {
    const result = await this.commentCommandService.createReplyComment(dto, userId);

    return toCommandResponse(result, "답글 생성 완료")
  }

  /**<command>user가 작성한 모든 댓글 조회(답글 포함)*/
  @Post('like')
  async commentLike(@Body() commentId: string, @User('userId') userId: string) {
    const result = await this.commentCommandService.commentLike(commentId, userId)

    return toCommandResponse(result, "좋아요 반영 완료")
  }

  @Patch()
  async updateComment(@Body() dto: CommentCommandDto.Update, @User('userId') userId: string) {
    await this.commentQuerySerivce.isAuthor(userId, dto.commentId)
    const result = await this.commentCommandService.updateComment(dto);

    return toCommandResponse(result, "댓글 업데이트 완료")
  }

  @Delete()
  async deleteComment(@Body() commentId: string, @User('userId') userId: string) {
    await this.commentQuerySerivce.isAuthor(userId, commentId)
    const result = await this.commentCommandService.softDeleteComment(commentId, userId);

    return toCommandResponse(result, "댓글 삭제 완료")
  }
}
