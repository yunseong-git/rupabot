import { Module } from '@nestjs/common';

//controller
import { PostController } from './posts/controllers/post.controller';
import { AdminPostController } from './posts/controllers/admin-post.controller';
import { CommentController } from './comments/controllers/comments.controller';
import { AdminCommentController } from './comments/controllers/admin-comment.controller';

//mongoose
import { MongooseModule } from '@nestjs/mongoose';
import { Post, PostSchema } from './posts/schemas/post.schema';
import { PostLike, PostLikeSchema } from './posts/schemas/post-like.schema';
import { CommentLike, CommentLikeSchema } from './comments/schemas/comment-like.schema';
import { Comment, CommentSchema } from './comments/schemas/comment.schema';

//service
import { BoardUtilService } from './posts/board-utill.service';
import { PostQueryService } from './posts/services/post-query.service';
import { PostCommandService } from './posts/services/post-command.service';
import { CommentQueryService } from './comments/services/comment-query.service';
import { CommentCommandService } from './comments/services/comment-command.service';
import { User, UserSchema } from 'src/users/schemas/user.schema';


@Module({
  imports: [
    MongooseModule.forFeature([
      { name: Post.name, schema: PostSchema },
      { name: PostLike.name, schema: PostLikeSchema },
      { name: Comment.name, schema: CommentSchema },
      { name: CommentLike.name, schema: CommentLikeSchema },
      { name: User.name, schema: UserSchema },
    ])],
  controllers: [
    PostController,
    AdminPostController,
    CommentController,
    AdminCommentController,
  ],
  providers: [
    BoardUtilService,
    PostQueryService,
    PostCommandService,
    CommentQueryService,
    CommentCommandService
  ],
})
export class BoardModule { }
