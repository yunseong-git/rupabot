import { Injectable, UnauthorizedException, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';

import { Comment, CommentDocument } from './schemas/comment.schema';
import { CommentLike, CommentLikeDocument } from './schemas/comment-like.schema';

import { CreateCommentDto, UpdateCommentDto } from './dto/comment.dto';

@Injectable({})
export class CommentsService {
    constructor(
        @InjectModel(Comment.name) private readonly commentModel: Model<CommentDocument>,
        @InjectModel(CommentLike.name) private readonly commentLikeModel: Model<CommentLikeDocument>,
    ) { }

    /** <main api>
     * findReplyComments: pId의 대댓글들 조회
     * create(Reply)Comment: 댓글(대댓글) 생성
     * update,deleteComment: 대댓글도 공용사용, softDelete(삭제시 대댓글도 삭제됨)
     * commentLike: 좋아요 생성/삭제
     */

    async findCommentsByPost(postId: string): Promise<CommentDocument[]> {
        const comment = await this.commentModel
            .find({ postId: postId })
            .populate('authorId', 'nickname')
            .select('content pId likeCount createdAt')
            .sort({ createdAt: -1 })
            .exec();
        return comment;
    }

    async findReplyComments(id: string): Promise<CommentDocument[]> {
        return await this.commentModel.find({ 'pId': id }).exec();
    }

    async createComment(dto: CreateCommentDto, userId: string): Promise<CommentDocument> {
        const created = new this.commentModel({
            ...dto,
            "authorId": userId
        });
        return created.save();
    }
    async createReplyComment(id: string) {
        return await this.commentModel.find({ 'postId': id }).exec();
    }

    async updateComment(dto: UpdateCommentDto, postId: string, userId: string): Promise<CommentDocument> {
        const isAuthor = await this.isAuthor(userId, postId);
        if (!isAuthor) throw new UnauthorizedException('수정 권한이 없습니다.');

        const updated = await this.commentModel.findByIdAndUpdate(postId, dto, { new: true, });
        if (!updated) throw new NotFoundException('업데이트 실패');

        return updated;
    }

    //todo
    async deleteComment(id: string) {
        return await this.commentModel.find({ 'postId': id }).exec();
    }

    async commentLike(commentId: string, userId: string): Promise<'liked' | 'unliked'> {
        const isLiked = await this.commentLikeModel.exists({ commentId, userId });

        if (!isLiked) {
            return this.createLike(commentId, userId);
        } else {
            return this.deleteLike(commentId, userId);
        }
    }

    async isAuthor(userId: string, commentId: string): Promise<boolean> {
        const comment = await this.findComment(commentId);
        if (!comment.authorId.equals(userId)) {
            throw new UnauthorizedException('수정 권한이 없습니다.')
        }
        else return true;
    }

    async findComment(id: string): Promise<CommentDocument> {
        const comment = await this.commentModel.findById(id).exec();
        if (!comment || comment.isDeleted) {
            throw new NotFoundException('존재하지 않거나 삭제된 댓글입니다.');
        }
        return comment;
    }


    async createLike(postId: string, userId: string): Promise<'liked'> {
        await Promise.all([
            this.commentLikeModel.create({ postId, userId }),
            this.commentModel.findByIdAndUpdate(postId, { $inc: { likeCount: 1 } }),
        ]);
        return 'liked';
    }

    async deleteLike(postId: string, userId: string): Promise<'unliked'> {
        await Promise.all([
            this.commentLikeModel.deleteOne({ postId, userId }),
            this.commentModel.findByIdAndUpdate(postId, { $inc: { likeCount: -1 } }),
        ]);
        return 'unliked';
    }
}
