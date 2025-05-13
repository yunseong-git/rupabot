import { BadRequestException, Injectable, InternalServerErrorException, NotFoundException, UnauthorizedException } from '@nestjs/common';

//data
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { SortOrder } from 'mongoose';
import { Post, PostDocument } from '../schemas/post.schema';
import { PostLike, PostLikeDocument } from '../schemas/post-like.schema';

//dto
import { PostCommandDTO } from '../dto/req/post-command.dto';

@Injectable()
export class PostCommandService {
  constructor(
    @InjectModel(Post.name) private readonly postModel: Model<PostDocument>,
    @InjectModel(PostLike.name) private readonly postLikeModel: Model<PostLikeDocument>,
  ) { }

  /**게시물 좋아요 동작*/
  async postLike(postId: string, userId: string): Promise<'liked' | 'unliked'> {
    const isLiked = await this.postLikeModel.exists({ postId, userId });

    if (!isLiked) {
      return await this.createLike(postId, userId);
    } else {
      return await this.deleteLike(postId, userId);
    }
  }

  /**게시물 작성*/
  async createPost(dto: PostCommandDTO.Create, userId: string): Promise<string> {
    const created = new this.postModel({
      ...dto,
      authorId: userId,
    });
    await created.save();

    return created.id.toString();
  }

  /**게시물 업데이트*/
  async updatePost(dto: PostCommandDTO.Update, postId: string): Promise<boolean> {
    const result = await this.postModel.updateOne({ _id: postId }, { $set: dto }, { runValidators: true, timestamps: true });
    if (result.matchedCount === 0) throw new NotFoundException('해당 게시물 없음');
    if (result.modifiedCount === 0) throw new BadRequestException('변경 된 내용 없음');

    return true;
  }

  /**게시물 및 게시물 좋아요 삭제*/
  async selfDeletePost(postId: string, deletedAt: Date, deletedBy: string): Promise<boolean> {
    await Promise.all([
      this.postModel.updateOne({ _id: postId }, { $set: { isDeleted: true, likecount: 0, deletedAt: deletedAt, deletedBy: deletedBy } }),
      this.postLikeModel.deleteMany({ postId })
    ]);
    return true;
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
