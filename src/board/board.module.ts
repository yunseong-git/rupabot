import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { SharedModule } from 'src/shared/shared.Module';

//sub domain
import { CommentsController } from './comments/comments.controller';
import { CommentsService } from './comments/comments.service';
import { PostsService } from './posts/posts.service';
import { PostsController } from './posts/posts.controller';

//schemas
import { Post, PostSchema } from './posts/schemas/post.schema';
import { Comment, CommentSchema } from './comments/schemas/comment.schema';


@Module({
  imports: [
    MongooseModule.forFeature([
      { name: Post.name, schema: PostSchema },
      { name: Comment.name, schema: CommentSchema },
    ]),
    SharedModule
  ],
  controllers: [
    PostsController,
    CommentsController,
  ],
  providers: [
    PostsService,
    CommentsService
  ],
})
export class BoardModule { }
