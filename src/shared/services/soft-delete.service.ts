import { Model, Types } from 'mongoose';
import { Injectable } from '@nestjs/common';

import { PostLikeDocument } from 'src/board/posts/schemas/post-like.schema';
import { PostDocument } from 'src/board/posts/schemas/post.schema';
import { CommentDocument } from 'src/board/comments/schemas/comment.schema';
import { CommentLikeDocument } from 'src/board/comments/schemas/comment-like.schema';
import { UserDocument } from 'src/users/schemas/user.schema';

// soft delete 관련 통합 서비스
@Injectable()
export class SoftDeleteService {
  constructor(
    private readonly postModel: Model<PostDocument>,
    private readonly postLikeModel: Model<PostLikeDocument>,
    private readonly commentModel: Model<CommentDocument>,
    private readonly commentLikeModel: Model<CommentLikeDocument>,
    private readonly userModel: Model<UserDocument>,
  ) {}

  // Post 삭제 (Post + 연관 Comment들 soft delete)
  async softDeletePost(postId: string) {
    // 1. Post soft delete
    await this.postModel.updateOne(
      { _id: postId },
      { $set: { isDeleted: true } }
    );

    // 2. Post에 달린 모든 댓글 soft delete
    await this.commentModel.updateMany(
      { postId },
      { $set: { isDeleted: true } }
    );

    await this.commentLikeModel.deleteMany(
      { postId }
    );
  }

  // Comment 삭제 (자기 자신만 soft delete)
  async softDeleteComment(commentId: string) {
    await this.commentModel.updateOne(
      { _id: commentId },
      { $set: { isDeleted: true } }
    );
    // 답글(reply)들은 그대로 둔다 (답글은 독립적으로 관리할 예정)

    await this.commentLikeModel.deleteMany(
      { commentId },
    );
  }

  // User 삭제
  async softDeleteUser(userId: string) {
    // 1. User soft delete
    await this.userModel.updateOne(
      { _id: userId },
      { $set: { isDeleted: true } }
    );

    // 2. User가 작성한 Post들 soft delete
    await this.postModel.updateMany(
      { authorId: userId },
      { $set: { isDeleted: true } }
    );

    // 3. User가 작성한 Comment는 **soft delete 안 함**
  }
}