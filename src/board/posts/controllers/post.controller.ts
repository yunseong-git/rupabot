import { Controller, Get, Post, Body, Patch, Param, Delete, Req, Query } from '@nestjs/common';
import { PostDocument } from '../schemas/post.schema';
import { Public } from 'src/common/decorators/public.decorator';
import { User } from 'src/common/decorators/user.decorator';

//service
import { PostCommandService } from '../services/post-command.service';
import { PostQueryService } from '../services/post-query.service';

//dto
import { CreatePostDto, UpdatePostDto } from '../dto/req/post.dto';
import { PostQueryDto, LikedPostQueryDto, SearchedPostQueryDto, DeletedPostQueryDto } from '../dto/req/post-query.dto';
import { SinglePostResponseDto, ManyPostsResponseDto } from '../dto/res/post-query-response.dto';
import { CommonResponseDto } from 'src/common/dto/common-response.dto';
import { plainToInstance } from 'class-transformer';
import { CommandPostResponseDto, PostLikeResponseDto } from '../dto/res/post-command-response.dto';

@Controller('posts')
export class PostController {
  constructor(
    private readonly postQueryService: PostQueryService,
    private readonly postCommandService: PostCommandService,
  ) {}

  /**<query>*/
  @Public()
  @Get()
  async getAllPosts(@Query() query: PostQueryDto): Promise<CommonResponseDto<ManyPostsResponseDto[]>> {
    const result = await this.postQueryService.findAllPosts(query);

    return new CommonResponseDto<ManyPostsResponseDto[]>({
      data: plainToInstance(ManyPostsResponseDto, result, { excludeExtraneousValues: true }),
      message: '게시물 조회 완료',
    });
  }

  /**<query>*/
  @Public()
  @Get(':id/only')
  async getSinglePost(@Param('id') id: string): Promise<CommonResponseDto<SinglePostResponseDto>> {
    const result = await this.postQueryService.findPostbyId(id);

    return new CommonResponseDto<SinglePostResponseDto>({
      data: plainToInstance(SinglePostResponseDto, result, { excludeExtraneousValues: true }),
      message: '게시물 조회 완료',
    });
  }

  /**<query>*/
  @Get('my')
  async getLikedPost(
    @Query() query: LikedPostQueryDto,
    @User('userId') userId: string,
  ): Promise<CommonResponseDto<ManyPostsResponseDto[]>> {
    const result = await this.postQueryService.findLikedPosts(query, userId);

    return new CommonResponseDto<ManyPostsResponseDto[]>({
      data: plainToInstance(ManyPostsResponseDto, result, { excludeExtraneousValues: true }),
      message: '게시물 조회 완료',
    });
  }

  /**<query>*/
  @Public()
  @Get('search')
  async getSearchedPost(@Query() query: SearchedPostQueryDto): Promise<CommonResponseDto<ManyPostsResponseDto[]>> {
    const result = await this.postQueryService.findSearchedPosts(query);

    return new CommonResponseDto<ManyPostsResponseDto[]>({
      data: plainToInstance(ManyPostsResponseDto, result, { excludeExtraneousValues: true }),
      message: '게시물 조회 완료',
    });
  }

  /**<command>*/
  @Post()
  async createPost(
    @Body() dto: CreatePostDto,
    @User('userId') userId: string,
  ): Promise<CommonResponseDto<CommandPostResponseDto>> {
    const result = await this.postCommandService.createPost(dto, userId);

    return new CommonResponseDto<CommandPostResponseDto>({
      data: plainToInstance(CommandPostResponseDto, result, { excludeExtraneousValues: true }),
      message: '게시물 작성 완료',
    });
  }

  /**<command>*/
  @Post(':id/like')
  async postLike(
    @Param('id') postId: string,
    @User('userId') userId: string,
  ): Promise<CommonResponseDto<PostLikeResponseDto>> {
    
    const result = await this.postCommandService.postLike(postId, userId);

    return new CommonResponseDto({
      data: { status: result },
      message: result === 'liked' ? '좋아요를 눌렀습니다.' : '좋아요를 취소했습니다.',
    });
  }

  /**<command>*/
  @Patch(':postId')
  async updatePost(
    @Param('postId') postId: string,
    @Body() dto: UpdatePostDto,
    @User('userId') userId: string,
  ): Promise<CommonResponseDto<CommandPostResponseDto>> {

    await this.postQueryService.isAuthor(userId, postId);
    const result = this.postCommandService.updatePost(dto, postId);

    return new CommonResponseDto<CommandPostResponseDto>({
        data: plainToInstance(CommandPostResponseDto, result, { excludeExtraneousValues: true }),
        message: '게시물 수정 완료',
      });
  }

  @Delete(':postId')
  async deletePost(@Param('postId') postId: string, @User('userId') userId: string) {}
}
