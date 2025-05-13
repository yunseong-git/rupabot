import { Controller, Get, Post, Body, Patch, Param, Delete, Query } from '@nestjs/common';
import { Public } from 'src/common/decorators/public.decorator';
import { User } from 'src/common/decorators/user.decorator';
import { plainToInstance } from 'class-transformer';
import { CommonCommandResponse, toCommandResponse, toResponse, toResponseArray } from 'src/common/utils/toResponse.utill';
import { ApiBody, ApiOperation, ApiParam, ApiQuery, ApiResponse } from '@nestjs/swagger';

//service
import { PostCommandService } from '../services/post-command.service';
import { PostQueryService } from '../services/post-query.service';
import { CommentQueryService } from 'src/board/comments/services/comment-query.service';

//dto(req)
import { CommonResponseDto } from 'src/common/dto/common-response.dto';
import { PostCommandDTO } from '../dto/req/post-command.dto';
import { PostQueryDto } from '../dto/req/post-query.dto';

//dto(res)
import { PostQueryResponseDto } from '../dto/res/post-query-response.dto';
import { CommentQueryResponseDto } from 'src/board/comments/dto/res/comment-query-response.dto';
import { CommentCommandService } from 'src/board/comments/services/comment-command.service';
import { PostCommandResponseDto } from '../dto/res/post-command-response.dto';

@Controller('posts')
export class PostController {
  constructor(
    private readonly postQueryService: PostQueryService,
    private readonly postCommandService: PostCommandService,
    private readonly commentQueryService: CommentQueryService,
    private readonly commentCommandService: CommentCommandService,
  ) { }

  /**<query>전체 게시물 조회*/
  @Public()
  @Get()
  @ApiOperation({ summary: '전체 게시물 조회' })
  @ApiQuery({ type: PostQueryDto.All })
  @ApiResponse({ status: 200, description: '전체 게시물 목록', type: [PostQueryResponseDto.Many], })
  async getAllPosts(@Query() query: PostQueryDto.All): Promise<CommonResponseDto<PostQueryResponseDto.Many[]>> {
    const result = await this.postQueryService.findAllPosts(query);

    return toResponseArray(PostQueryResponseDto.Many, result, '전체 게시물 조회 완료')
  }

  /**<query>단일 게시물 조회*/
  @Public()
  @Get(':id/only-post')
  @ApiOperation({ summary: '단일 게시물 조회' })
  @ApiParam({ name: 'id', description: '게시물 ID' })
  @ApiResponse({ status: 200, description: '단일 게시물 데이터', type: PostQueryResponseDto.Single, })
  async getSinglePost(@Param('id') id: string): Promise<CommonResponseDto<PostQueryResponseDto.Single>> {
    const result = await this.postQueryService.findPostbyId(id);

    return toResponse(PostQueryResponseDto.Single, result, '단일 게시물 조회 완료')
  }

  /**<query>게시물+부모댓글 조회,추후 로직 전체 댓글로 변경 가능*/
  @Public()
  @Get('with-comments')
  @ApiOperation({ summary: '게시물 + 부모 댓글 조회' })
  @ApiQuery({ type: PostQueryDto.WithComments }) // ✅ DTO 기반 Swagger 문서화
  @ApiResponse({ status: 200, description: '게시물 및 댓글', type: PostQueryResponseDto.WithComments, })
  async getPostWithComments(@Query() query: PostQueryDto.WithComments): Promise<CommonResponseDto<PostQueryResponseDto.WithComments>> {
    const post = await this.postQueryService.findPostbyId(query.postId);
    const comments = await this.commentQueryService.findParentsCommentsByPost(query)

    const result = {
      post: plainToInstance(PostQueryResponseDto.Single, post, { excludeExtraneousValues: true }),
      comments: plainToInstance(CommentQueryResponseDto.NotPid, comments, { excludeExtraneousValues: true })
    }
    return toResponse(PostQueryResponseDto.WithComments, result, '게시물+댓글 조회 완료')
  }

  /**<@query>user가 좋아요 누른 게시물 조회*/
  @Get('my')
  @ApiOperation({ summary: '내가 좋아요 누른 게시물 조회' })
  @ApiQuery({ type: PostQueryDto.Liked })
  @ApiResponse({ status: 200, description: '좋아요 누른 게시물 목록', type: [PostQueryResponseDto.Many], })
  async getLikedPost(@Query() query: PostQueryDto.Liked, @User('userId') userId: string,): Promise<CommonResponseDto<PostQueryResponseDto.Many[]>> {
    const result = await this.postQueryService.findLikedPosts(query, userId);

    return toResponseArray(PostQueryResponseDto.Many, result, '좋아요 누른 게시물 조회 완료')
  }

  /**<@query>게시물 검색*/
  @Public()
  @Get('search')
  @ApiOperation({ summary: '게시물 검색' })
  @ApiQuery({ type: PostQueryDto.Search })
  @ApiResponse({ status: 200, description: '검색 결과', type: [PostQueryResponseDto.Many], })
  async getSearchedPost(@Query() query: PostQueryDto.Search): Promise<CommonResponseDto<PostQueryResponseDto.Many[]>> {
    const result = await this.postQueryService.findSearchedPosts(query);

    return toResponseArray(PostQueryResponseDto.Many, result, '게시물 검색 완료')
  }

  /**<@command>게시물 생성*/
  @Post()
  @ApiOperation({ summary: '게시물 작성' })
  @ApiBody({ type: PostCommandDTO.Create })
  @ApiResponse({ status: 201, description: '게시물 작성 완료', type: PostCommandResponseDto.Simple })
  async createPost(@Body() dto: PostCommandDTO.Create, @User('userId') userId: string,): Promise<PostCommandResponseDto.Simple> {
    const result = await this.postCommandService.createPost(dto, userId);
    return { postId: result };
  }

  /**<@command>게시물 좋아요 반영*/
  @ApiOperation({ summary: '게시물 좋아요/취소 토글' })
  @ApiParam({ name: 'id', description: '게시물 ID' })
  @ApiResponse({ status: 200, description: '좋아요 반영 결과', type: PostCommandResponseDto.Like })
  @Post(':id/like')
  async postLike(@Param('id') postId: string, @User('userId') userId: string,): Promise<PostCommandResponseDto.Like> {
    const result = await this.postCommandService.postLike(postId, userId);

    return { status: result };
  }

  /**<@command>게시물 수정*/
  @Patch(':postId')
  @ApiOperation({ summary: '게시물 수정' })
  @ApiParam({ name: 'postId', description: '게시물 ID' })
  @ApiBody({ type: PostCommandDTO.Update })
  @ApiResponse({ status: 200, description: '게시물 수정 완료', type: PostCommandResponseDto.Update })
  async updatePost(@Param('postId') postId: string, @Body() dto: PostCommandDTO.Update, @User('userId') userId: string,): Promise<PostCommandResponseDto.Update> {
    await this.postQueryService.isAuthor(userId, postId);
    await this.postCommandService.updatePost(dto, postId);

    return { isUpdated: true };
  }

  /**<@command>게시물 삭제*/
  @Delete(':postId')
  @ApiOperation({ summary: '게시물 삭제 (관련 댓글, 좋아요 포함)' })
  @ApiParam({ name: 'postId', description: '게시물 ID' })
  @ApiResponse({ status: 200, description: '게시물 및 관련 댓글/좋아요 삭제 완료', })
  async deletePost(@Param('postId') postId: string, @User('userId') userId: string): Promise<PostCommandResponseDto.Delete> {
    await this.postQueryService.isAuthor(userId, postId); //작성자인지 확인

    const now = new Date();
    const commentIds = await this.commentQueryService.findCommentIdsByPost(postId)

    await this.postCommandService.selfDeletePost(postId, now, '작성자'); //게시물+게시물 좋아요삭제

    if (commentIds.length > 0) {
      await this.commentCommandService.deleteWhenPostDeleted(postId, commentIds, now, '게시물'); //댓글+댓글 좋아요 삭제
    }
    return { isDeleted: true }
  }
}

