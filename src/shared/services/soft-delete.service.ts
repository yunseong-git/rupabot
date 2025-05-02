import { Model, Types } from 'mongoose';
import { Injectable } from '@nestjs/common';

import { PostLikeDocument } from 'src/board/posts/schemas/post-like.schema';
import { PostDocument } from 'src/board/posts/schemas/post.schema';
import { CommentDocument } from 'src/board/comments/schemas/comment.schema';
import { CommentLikeDocument } from 'src/board/comments/schemas/comment-like.schema';
import { UserDocument } from 'src/users/schemas/user.schema';
import { RecordDocument } from 'src/records/schemas/record.schema';

// soft delete 관련 통합 서비스
@Injectable()
export class SoftDeleteService {
  constructor(
    private readonly postModel: Model<PostDocument>,
    private readonly postLikeModel: Model<PostLikeDocument>,
    private readonly commentModel: Model<CommentDocument>,
    private readonly commentLikeModel: Model<CommentLikeDocument>,
    private readonly userModel: Model<UserDocument>,
    private readonly recordModel: Model<RecordDocument>,
  ) { }

  // Post 삭제 (Post + 연관 Comment들 soft delete)
  async softDeletePost(postId: string) {

    //1. post에 달린 comment ids 추출
    const comments = await this.commentModel.find({ postId }).select('_id').lean();
    const commentIds = comments.map(c => c._id);

    //2. Post 및 하위 comment에 달린 좋아요들 hard delete
    await this.commentLikeModel.deleteMany({ commentId: { $in: commentIds } });
    await this.postLikeModel.deleteMany({ postId });

    //3. Post에 달린 모든 comments soft delete
    await this.commentModel.updateMany({ postId }, { $set: { isDeleted: true } });

    //4. Post soft delete
    await this.postModel.updateOne({ _id: postId }, { $set: { isDeleted: true } });
  }

  // Comment 삭제 (자기 자신만 soft delete)
  async softDeleteComment(commentId: string) {
    await this.commentModel.updateOne({ _id: commentId }, { $set: { isDeleted: true } });
    // 답글(reply)과 좋아요들은 그대로 둔다 (답글은 독립적으로 관리할 예정)
  }

  // User 삭제
  async softDeleteUser(userId: string) {
    // 1. User soft delete
    await this.userModel.updateOne({ _id: userId }, { $set: { isDeleted: true } });

    // 2. User가 작성한 Post들 soft delete
    await this.postModel.updateMany({ authorId: userId }, { $set: { isDeleted: true } });

    // 3. User가 작성한 postlike, commentlike, record hard delete
    await this.recordModel.deleteMany({ userId });
    await this.postLikeModel.deleteMany({ userId });
    await this.commentLikeModel.deleteMany({ userId });

    // User가 작성한 Comment는 soft delete 안 함
  }
}