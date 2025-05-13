import { Controller, Get, Post, Body, Patch, Param, Delete, Query } from '@nestjs/common';
import { ApiBody, ApiOperation, ApiParam, ApiQuery, ApiResponse } from '@nestjs/swagger';
//decorator
import { Public } from 'src/common/decorators/public.decorator';
import { User } from 'src/common/decorators/user.decorator';
//for utill
import { plainToInstance } from 'class-transformer';
import { toResponse, toResponseArray } from 'src/common/utils/toResponse.utill';
//service
import { PostCommandService } from '../services/post-command.service';
import { PostQueryService } from '../services/post-query.service';
import { CommentQueryService } from 'src/board/comments/services/comment-query.service';
import { CommentCommandService } from 'src/board/comments/services/comment-command.service';
//dto(req)(command)
import { CreatePostDto, UpdatePostDto } from '../dto/req/post-command.dto';
//dto(req)(query)
import { PostWithCommentsQueryDto, LikedPostQueryDto, AllPostQueryDto, SearchPostDto } from '../dto/req/post-query.dto';
//dto(res)(query)
import {
  ManyPostResponseDto,
  SinglePostResponseDto,
  PostWithCommentsResponseDto,
  SimplePostResponseDto,
} from '../dto/res/post-query-response.dto';
import { CommentsWithPidResponseDto } from 'src/board/comments/dto/res/comment-query-response.dto';
//dto(res)(command)
import {
  PostLikeResponseDto,
  UpdatePostResponseDto,
  DeletePostResponseDto,
  PostIdResponseDto,
} from '../dto/res/post-command-response.dto';

@Controller('posts')
export class PostController {
  constructor(
    private readonly postQueryService: PostQueryService,
    private readonly postCommandService: PostCommandService,
    private readonly commentQueryService: CommentQueryService,
    private readonly commentCommandService: CommentCommandService,
  ) {}

  /**<query>전체 게시물 조회*/
  @Public()
  @Get()
  @ApiOperation({ summary: '전체 게시물 조회' })
  @ApiQuery({ type: AllPostQueryDto })
  @ApiResponse({ status: 200, description: '전체 게시물 목록', type: [ManyPostResponseDto] })
  async getAllPosts(@Query() query: AllPostQueryDto): Promise<ManyPostResponseDto[]> {
    const result = await this.postQueryService.findAllPosts(query);

    return toResponseArray(ManyPostResponseDto, result);
  }

  @Public()
  @Get(':id/only-post')
  @ApiOperation({ summary: '단일 게시물 조회' })
  @ApiParam({ name: 'id', description: '게시물 ID' })
  @ApiResponse({ status: 200, description: '단일 게시물 데이터', type: SinglePostResponseDto })
  async getSinglePost(@Param('id') id: string): Promise<SinglePostResponseDto> {
    const result = await this.postQueryService.findPostByIdWithUserTag(id);

    return toResponse(SinglePostResponseDto, result);
  }

  @Public()
  @Get(':id/only-post/my')
  @ApiOperation({ summary: '유저태그 없는 단일 게시물 조회' })
  @ApiParam({ name: 'id', description: '게시물 ID' })
  @ApiResponse({ status: 200, description: '단일 게시물 데이터', type: SimplePostResponseDto })
  async getMyPost(@Param('id') id: string): Promise<SimplePostResponseDto> {
    const result = await this.postQueryService.findPostById(id);

    return toResponse(SimplePostResponseDto, result);
  }

  @Public()
  @Get('with-comments')
  @ApiOperation({ summary: '게시물 + 부모 댓글 조회' })
  @ApiQuery({ type: PostWithCommentsQueryDto })
  @ApiResponse({ status: 200, description: '게시물 및 댓글', type: PostWithCommentsResponseDto })
  async getPostWithComments(@Query() query: PostWithCommentsQueryDto): Promise<PostWithCommentsResponseDto> {
    const post = await this.postQueryService.findPostByIdWithUserTag(query.postId);
    const comments = await this.commentQueryService.findParentsCommentsByPost(query);

    const result = {
      post: plainToInstance(SinglePostResponseDto, post, { excludeExtraneousValues: true }),
      comments: plainToInstance(CommentsWithPidResponseDto, comments, { excludeExtraneousValues: true }),
    };

    return toResponse(PostWithCommentsResponseDto, result);
  }

  /**<@query>user가 좋아요 누른 게시물 조회*/
  @Get('my')
  @ApiOperation({ summary: '내가 좋아요 누른 게시물 조회' })
  @ApiQuery({ type: LikedPostQueryDto })
  @ApiResponse({ status: 200, description: '좋아요 누른 게시물 목록', type: [ManyPostResponseDto] })
  async getLikedPost(
    @Query() query: LikedPostQueryDto,
    @User('userId') userId: string,
  ): Promise<ManyPostResponseDto[]> {
    const result = await this.postQueryService.findLikedPosts(query, userId);

    return toResponseArray(ManyPostResponseDto, result);
  }

  /**<@query>게시물 검색*/
  @Public()
  @Get('search')
  @ApiOperation({ summary: '게시물 검색' })
  @ApiQuery({ type: SearchPostDto })
  @ApiResponse({ status: 200, description: '검색 결과', type: [ManyPostResponseDto] })
  async getSearchedPost(@Query() query: SearchPostDto): Promise<ManyPostResponseDto[]> {
    const result = await this.postQueryService.findSearchedPosts(query);

    return toResponseArray(ManyPostResponseDto, result);
  }

  ////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
  ////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

  /**<@command>게시물 생성*/
  @Post()
  @ApiOperation({ summary: '게시물 작성' })
  @ApiBody({ type: CreatePostDto })
  @ApiResponse({ status: 201, description: '게시물 작성 완료', type: PostIdResponseDto })
  async createPost(@Body() dto: CreatePostDto, @User('userId') userId: string): Promise<PostIdResponseDto> {
    const result = await this.postCommandService.createPost(dto, userId);
    return { postId: result };
  }

  /**<@command>게시물 좋아요 반영*/
  @ApiOperation({ summary: '게시물 좋아요/취소 토글' })
  @ApiParam({ name: 'id', description: '게시물 ID' })
  @ApiResponse({ status: 200, description: '좋아요 반영 결과', type: PostLikeResponseDto })
  @Post(':id/like')
  async postLike(@Param('id') postId: string, @User('userId') userId: string): Promise<PostLikeResponseDto> {
    const result = await this.postCommandService.postLike(postId, userId);

    return { status: result };
  }

  /**<@command>게시물 수정*/
  @Patch(':postId')
  @ApiOperation({ summary: '게시물 수정' })
  @ApiParam({ name: 'postId', description: '게시물 ID' })
  @ApiBody({ type: UpdatePostDto })
  @ApiResponse({ status: 200, description: '게시물 수정 완료', type: UpdatePostResponseDto })
  async updatePost(
    @Param('postId') postId: string,
    @Body() dto: UpdatePostDto,
    @User('userId') userId: string,
  ): Promise<UpdatePostResponseDto> {
    await this.postQueryService.isAuthor(userId, postId);
    await this.postCommandService.updatePost(dto, postId);

    return { isUpdated: true };
  }

  /**<@command>게시물 삭제*/
  @Delete(':postId')
  @ApiOperation({ summary: '게시물 삭제 (관련 댓글, 좋아요 포함)' })
  @ApiParam({ name: 'postId', description: '게시물 ID' })
  @ApiResponse({ status: 200, description: '게시물 및 관련 댓글/좋아요 삭제 완료' })
  async deletePost(@Param('postId') postId: string, @User('userId') userId: string): Promise<DeletePostResponseDto> {
    await this.postQueryService.isAuthor(userId, postId); //작성자인지 확인

    const now = new Date();
    const commentIds = await this.commentQueryService.findCommentIdsByPost(postId);

    await this.postCommandService.selfDeletePost(postId, now, '작성자'); //게시물+게시물 좋아요삭제

    if (commentIds.length > 0) {
      await this.commentCommandService.deleteWhenPostDeleted(postId, commentIds, now, '게시물'); //댓글+댓글 좋아요 삭제
    }
    return { isDeleted: true };
  }
}
