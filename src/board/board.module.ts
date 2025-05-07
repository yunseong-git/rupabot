import { Module } from '@nestjs/common';
import { SharedModule } from 'src/shared/shared.module';

//sub domain
import { CommentsController } from './comments/comments.controller';
import { CommentsService } from './comments/comments.service';

import { PostsController } from './posts/controllers/post.controller';

import { MongooseModule } from '@nestjs/mongoose';
import { Post, PostSchema } from './posts/schemas/post.schema';
import { PostLike, PostLikeSchema } from './posts/schemas/post-like.schema';
import { CommentLike, CommentLikeSchema } from './comments/schemas/comment-like.schema';
import { Comment, CommentSchema } from './comments/schemas/comment.schema';

import { BoardUtilService } from './posts/board-utill.service';
import { PostQueryService } from './posts/services/post-query.service';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: Post.name, schema: PostSchema },
      { name: PostLike.name, schema: PostLikeSchema },
      { name: Comment.name, schema: CommentSchema },
      { name: CommentLike.name, schema: CommentLikeSchema },
    ]),SharedModule],
  controllers: [PostsController, CommentsController],
  providers: [BoardUtilService, PostQueryService],
})
export class BoardModule {}
