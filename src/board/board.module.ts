import { Module } from '@nestjs/common';
import { SharedModule } from 'src/shared/shared.module';

//sub domain
import { CommentsController } from './comments/comments.controller';
import { CommentsService } from './comments/comments.service';
import { PostsService } from './posts/posts.service';
import { PostsController } from './posts/posts.controller';

import { MongooseModule } from '@nestjs/mongoose';
import { PostSchema } from './posts/schemas/post.schema';
import { PostLikeSchema } from './posts/schemas/post-like.schema';
import { CommentLikeSchema } from './comments/schemas/comment-like.schema';
import { CommentSchema } from './comments/schemas/comment.schema';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: 'Post', schema: PostSchema },
      { name: 'PostLike', schema: PostLikeSchema },
      { name: 'Comment', schema: CommentSchema },
      { name: 'CommentLike', schema: CommentLikeSchema },
    ]),SharedModule],
  controllers: [PostsController, CommentsController],
  providers: [PostsService, CommentsService],
})
export class BoardModule {}
