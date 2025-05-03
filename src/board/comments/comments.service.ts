import { Injectable, UnauthorizedException, NotFoundException, BadRequestException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';

import { Comment, CommentDocument } from './schemas/comment.schema';
import { CommentLike, CommentLikeDocument } from './schemas/comment-like.schema';

import { CreateCommentDto, CreateReplyCommentDto, UpdateCommentDto } from './dto/comment.dto';
import { SingleCommentResponse } from './dto/res/comment-response.dto';

@Injectable({})
export class CommentsService {
  constructor(
    @InjectModel(Comment.name) private readonly commentModel: Model<CommentDocument>,
    @InjectModel(CommentLike.name) private readonly commentLikeModel: Model<CommentLikeDocument>,
  ) {}

  /** <main api>:<R>
   * findOneCommentById: 단일 댓글 조회(답글 공용)
   * CommentsByPost: post에 달린 댓글들(답글 포함) 조회
   * ParentCommentsByPost: post에 달린 댓글들(답글 미포함) 조회
   * MyCommentsByUser: userId가 작성한 댓글들 조회
   * ReplyComments": comment에 달린 답글들 조회
   *
   * filter: 검색조건(isDelete확인필수)/ selection: 필요데이터 / usertag:유저닉네임 포함여부
   */

  async findOneCommentById(id: string) {
    const comment = await this.commentModel.findById(id).select('content likeCount createdAt').exec();
    if (!comment || comment.isDeleted) {
      throw new NotFoundException('존재하지 않거나 삭제된 댓글입니다.');
    }
    return comment;
  }

  async findCommentsByPost(postId: string) {
    const filter = { postId: postId };
    const selection = 'content pId likeCount createdAt';
    const userTag = true;

    return await this.findManyComments(filter, selection, userTag);
  }

  async findParentCommentsByPost(postId: string) {
    const filter = { postId: postId, pId: null };
    const selection = 'content likeCount createdAt';
    const userTag = true;

    return await this.findManyComments(filter, selection, userTag);
  }

  async findReplyCommentsByParent(id: string) {
    await this.isParents(id);
    const filter = { pId: id };
    const selection = 'content likeCount createdAt';
    const userTag = true;

    return await this.findManyComments(filter, selection, userTag);
  }

  async findMyComments(id: string) {
    const filter = { authorId: id, isDeleted: false };
    const selection = 'content likeCount createdAt';
    const userTag = false;

    return await this.findManyComments(filter, selection, userTag);
  }

  /** <main api>:<CUD>
   * create(Reply)Comment: 단일 댓글(답글) 작성
   * update/deleteComment: 댓글 업데이트/삭제(답글 공용)
   * commentLike: 좋아요 api
   * filter: 검색조건(isDelete확인필수)/ selection: 필요데이터 / usertag:유저닉네임 포함여부
   */

  async createComment(dto: CreateCommentDto, userId: string): Promise<CommentDocument> {
    const created = new this.commentModel({
      ...dto,
      authorId: userId,
    });
    return created.save();
  }

  async createReplyComment(dto: CreateReplyCommentDto, userId: string) {
    const { postId, pId, content } = dto;
    await this.isParents(pId);

    const created = new this.commentModel({
      ...dto,
      authorId: userId,
    });
    return created.save();
  }

  async updateComment(dto: UpdateCommentDto, userId: string): Promise<CommentDocument> {
    const { commentId, content } = dto;
    await this.isAuthor(userId, commentId);

    const updated = await this.commentModel.findOneAndUpdate(
      { _id: commentId, isDeleted: false },
      { $set: { ...dto } },
      { new: true },
    );
    if (!updated) throw new NotFoundException('업데이트 실패');

    return updated;
  }

  async commentLike(commentId: string, userId: string): Promise<'liked' | 'unliked'> {
    const isLiked = await this.commentLikeModel.exists({ commentId, userId });

    if (!isLiked) {
      return this.createLike(commentId, userId);
    } else {
      return this.deleteLike(commentId, userId);
    }
  }

  /** <sub api>
   * isParents: 부모댓글 여부
   * isAuthor: 작성자 여부
   * findManyComments: 다수댓글 조회 공통api
   * createLike/deleteLike: 좋아요 추가/삭제
   */
  async isParents(id: string): Promise<boolean> {
    const comment = await this.findOneCommentById(id);
    if (comment.pId) {
      throw new BadRequestException('잘못된 요청입니다.');
    } else return true;
  }

  async isAuthor(userId: string, commentId: string): Promise<boolean> {
    const comment = await this.findOneCommentById(commentId);
    if (!comment.authorId.equals(userId)) {
      throw new UnauthorizedException('수정 권한이 없습니다.');
    } else return true;
  }

  private async findManyComments(filter: any, selection: any, userTag: boolean) {
    if (!userTag) {
      return await this.commentModel.find(filter).select(selection).exec();
    } else {
      return await this.commentModel.find(filter).select(selection).populate('authorId', 'nickname').exec();
    }
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
