import { Injectable, NotFoundException, InternalServerErrorException, BadRequestException } from '@nestjs/common';
//service
import { CommentQueryService } from './comment-query.service';
//model
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Comment, CommentDocument } from '../schemas/comment.schema';
import { CommentLike, CommentLikeDocument } from '../schemas/comment-like.schema';
//dto
import { CreateReplyCommentDto, CreateCommentDto, UpdateCommentDto } from '../dto/req/comment-command.dto';

@Injectable()
export class CommentCommandService {
  constructor(
    private readonly commentQuerySerivce: CommentQueryService,
    @InjectModel(Comment.name) private readonly commentModel: Model<CommentDocument>,
    @InjectModel(CommentLike.name) private readonly commentLikeModel: Model<CommentLikeDocument>,
  ) {}

  async createComment(dto: CreateCommentDto, userId: string): Promise<string> {
    const created = new this.commentModel({
      ...dto,
      authorId: userId,
    });
    await created.save();

    return created.id;
  }

  async createReplyComment(dto: CreateReplyCommentDto, userId: string) {
    const { postId, pId, content } = dto;
    await this.commentQuerySerivce.isParents(pId);
    const created = new this.commentModel({
      ...dto,
      authorId: userId,
    });
    await created.save();

    return created.id;
  }

  async updateComment(dto: UpdateCommentDto): Promise<boolean> {
    const { commentId, content } = dto;

    const updated = await this.commentModel.updateOne(
      { _id: commentId, isDeleted: false },
      { $set: { content: content } },
      { new: true, timestamps: true },
    );
    if (updated.matchedCount === 0) throw new NotFoundException('댓글을 찾을 수 없습니다.');
    if (updated.modifiedCount === 0) throw new BadRequestException('변경된 내용이 없습니다.');

    return true;
  }

  async softDeleteComment(commentId: string, userId: string) {
    const deleted = await this.commentModel.findOneAndUpdate(
      { _id: commentId, isDeleted: false },
      { $set: { isDeleted: true, deletedBy: userId, deletedAt: new Date() } },
      { new: true },
    );
    if (!deleted) throw new NotFoundException('삭제 실패');

    return deleted.id;
  }

  async commentLike(commentId: string, userId: string): Promise<'liked' | 'unliked'> {
    const isLiked = await this.commentLikeModel.exists({ commentId, userId });
    if (!isLiked) {
      return this.createLike(commentId, userId);
    } else {
      return this.deleteLike(commentId, userId);
    }
  }

  async createLike(commentId: string, userId: string): Promise<'liked'> {
    await Promise.all([
      this.commentLikeModel.create({ commentId, userId }),
      this.commentModel.updateOne({ _id: commentId }, { $inc: { likeCount: 1 } }),
    ]);
    return 'liked';
  }

  async deleteLike(commentId: string, userId: string): Promise<'unliked'> {
    await Promise.all([
      this.commentLikeModel.deleteOne({ commentId, userId }),
      this.commentModel.updateOne({ _id: commentId }, { $inc: { likeCount: -1 } }),
    ]);
    return 'unliked';
  }

  /**단일 댓글 soft delete*/
  async selfDeleteComment(commentId: string) {
    const result = await this.commentModel.updateOne(
      { _id: commentId },
      { $set: { isDeleted: true, deletedAt: new Date(), deletedBy: '작성자' } },
      { timestamps: true },
    );
    if (result.matchedCount === 0) throw new NotFoundException('댓글을 찾을 수 없습니다.');
    if (result.modifiedCount !== 3) throw new InternalServerErrorException('댓글 삭제중 오류가 발생하였습니다..');

    return true;
  }

  /**<게시물삭제시>게시물의 댓글과 댓글좋아요 모두 삭제 */
  async deleteWhenPostDeleted(postId: string, commentIds: string[], deletedAt: Date, deletedBy: string) {
    const deleteOps = commentIds.map((id) => ({ deleteMany: { filter: { commentId: id } } }));
    await Promise.all([
      this.commentLikeModel.bulkWrite(deleteOps), //post에 달린 commentLike hard-delete
      this.commentModel.updateMany(
        //post에 달린 comment soft-delete및 likecount초기화
        { postId },
        { $set: { likecount: 0, isDeleted: true, deletedAt: deletedAt, deletedBy: deletedBy } },
      ),
    ]);
    return postId;
  }

  /**유저가 좋아요한 댓글IDs 배열 조회*/
  async findLikedCommentIdsByUser(userId: string) {
    const comments = await this.commentLikeModel.find({ userId }).select('commentId').lean();
    const commentIds = comments.map((c) => c.commentId);
    return commentIds;
  }

  /**<유저삭제시>연관 댓글정보 delete */
  async deleteWhenUserDeleted(userId: string, commentIds: string[]) {
    const updateOps = commentIds.map((id) => ({
      updateOne: {
        filter: { _id: id, isDeleted: false },
        update: { $inc: { likecount: -1 } },
      },
    }));
    await Promise.all([
      this.commentLikeModel.deleteMany({ userId }), //유저가 작성한 commentLike hard-delete
      this.commentModel.bulkWrite(updateOps), //유저가 좋아요한 comment의 likecount -1
      this.commentModel.updateMany({ authorId: userId, isDeleted: false }, { $set: { isDeleted: true } }), //유저가 작성한 comment soft-delete
    ]);

    return true;
  }
}
