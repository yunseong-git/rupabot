import { Injectable, NotFoundException, UnauthorizedException } from '@nestjs/common';

//data
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { SortOrder } from 'mongoose';
import { Post, PostDocument } from '../schemas/post.schema';
import { PostLike, PostLikeDocument } from '../schemas/post-like.schema';

//dto
import { PostQueryDto, LikedPostQueryDto, SearchedPostQueryDto, DeletedPostQueryDto } from '../dto/req/post-query.dto';
import { CreatePostDto, UpdatePostDto } from '../dto/req/post.dto';

@Injectable()
export class PostCommandService {
  constructor(
    @InjectModel(Post.name) private readonly postModel: Model<PostDocument>,
    @InjectModel(PostLike.name) private readonly postLikeModel: Model<PostLikeDocument>,
  ) {}

  /**게시물 좋아요 동작*/
  async postLike(postId: string, userId: string): Promise<'liked' | 'unliked'> {
    const isLiked = await this.postLikeModel.exists({ postId, userId });

    if (!isLiked) {
      return this.createLike(postId, userId);
    } else {
      return this.deleteLike(postId, userId);
    }
  }

  /**게시물 작성*/
  async createPost(dto: CreatePostDto, userId: string): Promise<PostDocument> {
    const created = new this.postModel({
      ...dto,
      authorId: userId,
    });
    return created.save();
  }

  async updatePost(dto: UpdatePostDto, postId: string): Promise<PostDocument> {
    const updated = await this.postModel.findByIdAndUpdate(postId, dto, { new: true });
    if (!updated) throw new NotFoundException('업데이트 실패');

    return updated;
  }

  async deleltePost(dto: UpdatePostDto, postId: string): Promise<PostDocument> {
    //1. post에 달린 comment ids 추출
    const comments = await this.commentModel.find({ postId }).select('_id').lean();
    const commentIds = comments.map((c) => c._id);

    //2. Post 및 하위 comment에 달린 좋아요들 hard delete
    await this.commentLikeModel.deleteMany({ commentId: { $in: commentIds } });
    await this.postLikeModel.deleteMany({ postId });

    //3. Post에 달린 모든 comments soft delete
    await this.commentModel.updateMany({ postId }, { $set: { isDeleted: true } });

    //4. Post soft delete
    await this.postModel.updateOne({ _id: postId }, { $set: { isDeleted: true } });
  }

  /**<내부 로직용>게시물 좋아요 생성*/
  async createLike(postId: string, userId: string): Promise<'liked'> {
    await Promise.all([
      this.postLikeModel.create({ postId, userId }),
      this.postModel.findByIdAndUpdate(postId, { $inc: { likeCount: 1 } }),
    ]);
    return 'liked';
  }

  /**<내부 로직용>게시물 좋아요 삭제*/
  async deleteLike(postId: string, userId: string): Promise<'unliked'> {
    await Promise.all([
      this.postLikeModel.deleteOne({ postId, userId }),
      this.postModel.findByIdAndUpdate(postId, { $inc: { likeCount: -1 } }),
    ]);
    return 'unliked';
  }
}
