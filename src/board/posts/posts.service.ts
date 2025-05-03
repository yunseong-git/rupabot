import { Injectable, NotFoundException, UnauthorizedException } from '@nestjs/common';

//data
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { SortOrder } from 'mongoose';
import { Post, PostDocument } from './schemas/post.schema';
import { PostLike, PostLikeDocument } from './schemas/post-like.schema';

//dto
import { PostQueryDto, LikedPostQueryDto, SearchedPostQueryDto, DeletedPostQueryDto } from './dto/req/post-query.dto';
import { CreatePostDto, UpdatePostDto } from './dto/req/post.dto';

type FindOptions = {
  sortOption?: Record<string, SortOrder>;
};

@Injectable()
export class PostsService {
  constructor(
    @InjectModel(Post.name) private readonly postModel: Model<PostDocument>,
    @InjectModel(PostLike.name) private readonly postLikeModel: Model<PostLikeDocument>,
  ) {}
  /** <main api>
   * findAllPosts: 모든 게시물 조회(정렬선택가능)
   * findPost: 해당 게시물 조회
   * find(Liked/searched/deleted)Posts: (좋아요/검색/삭제여부)필터 검색
   * createPost,updatePost
   * deletePost: soft delete, isdeleted만 true로 변경
   * postLike: 좋아요 생성/삭제
   */
  async findAllPosts(query: PostQueryDto): Promise<PostDocument[]> {
    const { type, sort, limit = 10, skip = 0 } = query;
    const condition = { type, isDeleted: false };
    const sortOption: Record<string, SortOrder> = sort === 'like' ? { likeCount: -1 } : { createdAt: -1 };
    const posts = this.findManyPosts(condition, limit, skip, sortOption);
    return posts;
  }

  async findPost(id: string): Promise<PostDocument> {
    const post = await this.postModel.findById(id).exec();
    if (!post || post.isDeleted) {
      throw new NotFoundException('존재하지 않거나 삭제된 게시글입니다.');
    }
    return post;
  }

  async findLikedPosts(query: LikedPostQueryDto, userId: string): Promise<PostDocument[]> {
    const ids = this.findLikedPostsIds(userId);

    const { type, limit = 10, skip = 0 } = query;
    const condition = { _id: { $in: ids }, type, isDeleted: false };
    const posts = this.findManyPosts(condition, limit, skip);
    if (!posts) {
      throw new NotFoundException('좋아요를 누른 게시물이 없습니다.');
    }
    return posts;
  }

  async findSearchedPosts(query: SearchedPostQueryDto): Promise<PostDocument[]> {
    const { type, word, limit = 10, skip = 0 } = query;
    const condition = { title: { $regex: word, $options: 'i' }, type, isDeleted: false };
    const posts = this.findManyPosts(condition, limit, skip);
    if (!posts) {
      throw new NotFoundException('검색결과가 없습니다.');
    }
    return posts;
  }

  async findDeletedPosts(query: DeletedPostQueryDto): Promise<PostDocument[]> {
    const { type, word, limit = 10, skip = 0 } = query;
    const condition = { title: { $regex: word, $options: 'i' }, type, isDeleted: false };
    const posts = this.findManyPosts(condition, limit, skip);
    if (!posts) {
      throw new NotFoundException('검색결과가 없습니다.');
    }
    return posts;
  }

  async postLike(postId: string, userId: string): Promise<'liked' | 'unliked'> {
    const isLiked = await this.postLikeModel.exists({ postId, userId });

    if (!isLiked) {
      return this.createLike(postId, userId);
    } else {
      return this.deleteLike(postId, userId);
    }
  }

  async createPost(dto: CreatePostDto, userId: string): Promise<PostDocument> {
    const created = new this.postModel({
      ...dto,
      authorId: userId,
    });
    return created.save();
  }

  async updatePost(dto: UpdatePostDto, postId: string, userId: string): Promise<PostDocument> {
    const isAuthor = await this.isAuthor(userId, postId);
    if (!isAuthor) throw new UnauthorizedException('수정 권한이 없습니다.');

    const updated = await this.postModel.findByIdAndUpdate(postId, dto, { new: true });
    if (!updated) throw new NotFoundException('업데이트 실패');

    return updated;
  }
  /**<sub api>
   * create/deleteLike: 좋아요 생성/삭제
   * findLikedPostsIds: 좋아요 누른 게시물들 Id 배열생성
   * isAuthor: postId의 authorId와 userId가 동일한지 확인
   * findManyPosts: 다수의 게시물 조회 함수. 필터와 정렬옵션(선택) 인자로 받음.
   */
  async createLike(postId: string, userId: string): Promise<'liked'> {
    await Promise.all([
      this.postLikeModel.create({ postId, userId }),
      this.postModel.findByIdAndUpdate(postId, { $inc: { likeCount: 1 } }),
    ]);
    return 'liked';
  }

  async deleteLike(postId: string, userId: string): Promise<'unliked'> {
    await Promise.all([
      this.postLikeModel.deleteOne({ postId, userId }),
      this.postModel.findByIdAndUpdate(postId, { $inc: { likeCount: -1 } }),
    ]);
    return 'unliked';
  }

  async findLikedPostsIds(userId: string): Promise<Object> {
    const likedPostIds = await this.postLikeModel.find({ userId }).select('postId').lean(); // ← lean()을 써주면 plain JS 객체로 빠름
    const ids = likedPostIds.map((like) => like.postId);

    return ids;
  }

  async isAuthor(userId: string, postId: string): Promise<boolean> {
    const post = await this.findPost(postId);
    if (!post.authorId.equals(userId)) {
      throw new UnauthorizedException('수정 권한이 없습니다.');
    } else return true;
  }

  private async findManyPosts(
    condition: any,
    limit: number,
    skip: number,
    options?: FindOptions,
  ): Promise<PostDocument[]> {
    const query = this.postModel.find(condition).select('title viewCount likeCount createdAt tag');

    if (options?.sortOption) {
      query.sort(options.sortOption);
    }

    return query.limit(limit).skip(skip).exec();
  }
}
