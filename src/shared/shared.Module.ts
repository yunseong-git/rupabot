import { Module } from '@nestjs/common';

import { MongooseModule } from '@nestjs/mongoose';
import { User, UserSchema } from 'src/users/schemas/user.schema';
import { Post, PostSchema } from 'src/board/posts/schemas/post.schema';
import { Comment, CommentSchema } from 'src/board/comments/schemas/comment.schema';
import { Record, RecordSchema } from 'src/records/schemas/record.schema';
import { PostLike, PostLikeSchema } from 'src/board/posts/schemas/post-like.schema';
import { CommentLike, CommentLikeSchema } from 'src/board/comments/schemas/comment-like.schema';
import { Emoji, EmojiSchema } from 'src/shop/schemas/emoji.schema';

import { SoftDeleteService } from './services/soft-delete.service';
import { TransactionService } from './services/transaction.service';
console.log('✅ PostLike.name =', PostLike.name);
@Module({
  imports: [
    MongooseModule.forFeature([
      { name: User.name, schema: UserSchema },
      { name: Post.name, schema: PostSchema },
      { name: Comment.name, schema: CommentSchema },
      { name: PostLike.name, schema: PostLikeSchema },
      { name: CommentLike.name, schema: CommentLikeSchema },
      { name: Emoji.name, schema: EmojiSchema },
      { name: Record.name, schema: RecordSchema },
    ]),
  ],
  providers: [SoftDeleteService, TransactionService],
  exports: [SoftDeleteService, TransactionService],
})
export class SharedModule {}
