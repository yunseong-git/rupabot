import { Controller, Get, Post, Body, Patch, Param, Delete, Req, Query } from '@nestjs/common';

import { Public } from 'src/common/decorators/public.decorator';
import { User } from 'src/common/decorators/user.decorator';

import { PostDocument } from './schemas/post.schema';
import { PostsService } from './posts.service';
import { SoftDeleteService } from 'src/shared/services/soft-delete.service';
import { CommentsService } from '../comments/comments.service';
import { PostWithCommentsResponse } from '../types/board.types';

//dto
import { CreatePostDto, UpdatePostDto } from './dto/post.dto';
import { PostQueryDto, LikedPostQueryDto, SearchedPostQueryDto, DeletedPostQueryDto } from './dto/post-query.dto';


@Controller('posts')
export class PostsController {
    constructor(
        private readonly postsService: PostsService,
        private readonly commentsService: CommentsService,
        private readonly softDeleteService: SoftDeleteService,
    ) { }

    /**<기본조회>
     * @Get() :전체 게시물 조회
     * @Get(':id') :id 게시물조회(댓글포함):Promise<PostWithCommentsResponse>
     * @Get(':id/only') :id 게시물 조회(게시물만)
     */
    @Public()
    @Get()
    async getAllPosts(@Query() query: PostQueryDto): Promise<PostDocument[]> {
        return this.postsService.findAllPosts(query);
    }

    @Public()
    @Get(':id')
    async getPostWithComments(@Param('id') id: string): Promise<PostWithCommentsResponse> {
        const [post, comments] = await Promise.all([
            this.postsService.findPost(id),
            this.commentsService.findCommentsByPost(id),
        ]);
        return { post, comments }
    }

    @Public()
    @Get(':id/only')
    async getPost(@Param('id') id: string): Promise<PostDocument> {
        return this.postsService.findPost(id);
    }

    /**<특수 조회>
     * @Get('my'): 좋아요 누른 게시물 조회
     * @Get('search'): 게시물 검색
     * @Get('deleted'): 삭제된 게시물 검색(추후 관리자로 전환예정)
     */
    @Get('my')
    async getLikedPost(@Query() query: LikedPostQueryDto, @User('userId') userId: string): Promise<PostDocument[]> {
        return await this.postsService.findLikedPosts(query, userId);
    }

    @Get('search')
    async getSearchedPost(@Query() query: SearchedPostQueryDto): Promise<PostDocument[]> {
        return await this.postsService.findSearchedPosts(query);
    }

    @Get('deleted')
    async getDeletedPost(@Query() query: DeletedPostQueryDto): Promise<PostDocument[]> {
        return await this.postsService.findDeletedPosts(query);
    }
    /**<mutation>
     * @Post(":id/like"): 좋아요  create/delete
     * @Post()/@Patch(':id')/@Delete(':id'): 게시물 기본 create/update/delete
     */

    @Post()
    async createPost(@Body() dto: CreatePostDto, @User('userId') userId: string): Promise<PostDocument> {
        return await this.postsService.createPost(dto, userId);
    }

    @Post(":id/like")
    async postLike(@Param('id') id: string, @User('userId') userId: string): Promise<'liked' | 'unliked'> {
        return await this.postsService.postLike(id, userId);
    }

    @Patch(':postId')
    async updatePost(@Param('postId') postId: string, @Body() dto: UpdatePostDto, @User('userId') userId: string): Promise<PostDocument> {
        return await this.postsService.updatePost(dto, postId, userId);
    }

    @Delete(':postId')
    async deletePost(@Param('postId') postId: string, @User('userId') userId: string) {
        await this.postsService.isAuthor(postId,userId);
        return await this.softDeleteService.softDeletePost(postId)
    }
}
