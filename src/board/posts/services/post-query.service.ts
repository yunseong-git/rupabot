import { Injectable, NotFoundException, UnauthorizedException } from '@nestjs/common';
//model
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { Post, PostDocument } from '../schemas/post.schema';
import { PostLike, PostLikeDocument } from '../schemas/post-like.schema';
//utill
import { UserTag } from '../dto/res/post-query-response.dto';
import { QueryOptions, applyPagination } from 'src/common/utils/pagination.utill';
//service
import { BoardUtilService } from '../board-utill.service';
//dto
import {
  PostWithCommentsQueryDto,
  LikedPostQueryDto,
  AllPostQueryDto,
  SearchPostDto,
  DeletedPostQueryDto,
} from '../dto/req/post-query.dto';

@Injectable()
export class PostQueryService {
  constructor(
    private readonly boardUtillService: BoardUtilService,
    @InjectModel(Post.name) private readonly postModel: Model<PostDocument>,
    @InjectModel(PostLike.name) private readonly postLikeModel: Model<PostLikeDocument>,
  ) {}

  /** 단일 게시물 조회(유저태그 포함) */
  async findPostByIdWithUserTag(id: string): Promise<Post & { userTag: UserTag }> {
    const post = await this.postModel.findById(id).lean().exec();
    if (!post || post.isDeleted) {
      throw new NotFoundException('존재하지 않거나 삭제된 게시글입니다.');
    }
    //타입을 맞추기 위해 [result] 형식 사용
    const [result] = await this.boardUtillService.mapUserTagsToObjects([post]);
    return result;
  }

  /**유저태그 없는 순수 게시물 반환(수정모드 또는 게시물만 refresh용)*/
  async findPostById(id: string): Promise<Post> {
    const post = await this.postModel.findById(id).lean().exec();
    if (!post || post.isDeleted) {
      throw new NotFoundException('존재하지 않거나 삭제된 게시글입니다.');
    }
    return post;
  }

  /** 모든 게시물 조회 */
  async findAllPosts(query: AllPostQueryDto): Promise<(Post & { userTag: UserTag })[]> {
    const { type, sort, limit = 10, skip = 0 } = query;
    const filter = { type, isDeleted: false };
    const options: QueryOptions = { sort, limit, skip };
    const posts = await this.findManyPosts(filter, options);
    return posts;
  }

  /** 게시물 검색 결과 조회(포함여부, 대소문자 구분없음) */
  async findSearchedPosts(query: SearchPostDto): Promise<(Post & { userTag: UserTag })[]> {
    const { type, word, limit = 10, skip = 0 } = query;
    const filter = { title: { $regex: word, $options: 'i' }, type, isDeleted: false };
    const options: QueryOptions = { limit, skip };
    const posts = await this.findManyPosts(filter, options);
    return posts;
  }

  /** <for admin>삭제된 게시물들 조회 */
  async findDeletedPosts(query: DeletedPostQueryDto): Promise<(Post & { userTag: UserTag })[]> {
    const { type, word, limit = 10, skip = 0 } = query;
    const filter = { title: { $regex: word, $options: 'i' }, type, isDeleted: false };
    const options: QueryOptions = { limit, skip };

    const posts = await this.findManyPosts(filter, options);
    if (!posts) {
      throw new NotFoundException('검색결과가 없습니다.');
    }
    return posts;
  }

  /** 유저가 좋아요 누른 게시물들 조회 */
  async findLikedPosts(query: LikedPostQueryDto, userId: string): Promise<(Post & { userTag: UserTag })[]> {
    const ids = await this.findLikedPostsIds(userId);

    const { type, limit = 10, skip = 0 } = query;
    const filter = { _id: { $in: ids }, type, isDeleted: false };
    const options: QueryOptions = { limit, skip };
    const posts = await this.findManyPosts(filter, options);
    return posts;
  }

  /** <내부 로직용>게시물 document형식 추출용 */
  async findPostDocumentById(id: string): Promise<PostDocument> {
    const post = await this.postModel.findById(id).select('-isDeleted -').lean().exec();
    if (!post || post.isDeleted) {
      throw new NotFoundException('존재하지 않거나 삭제된 게시글입니다.');
    }
    return post;
  }

  /** <내부 로직용>접근 가능 유저 확인용 */
  async isAuthor(userId: string, postId: string): Promise<boolean> {
    const post = await this.findPostDocumentById(postId);
    if (!post.authorId || !post.authorId.equals(userId)) {
      throw new UnauthorizedException('게시물 권한이 없습니다.');
    } else return true;
  }

  /** <내부 로직용>유저가 좋아요 누른 게시물 ids 조회 */
  private async findLikedPostsIds(userId: string): Promise<Types.ObjectId[]> {
    const likedPostIds = await this.postLikeModel.find({ userId }).select('postId').lean(); // ← lean()을 써주면 plain JS 객체로 빠름
    const ids = likedPostIds.map((like) => like.postId);

    return ids;
  }

  /** <내부 로직용>다수 게시물 조회용 */
  private async findManyPosts(filter: any, option: QueryOptions): Promise<(Post & { userTag: UserTag })[]> {
    let query = this.postModel.find(filter).select('title viewCount likeCount createdAt tag authorId');
    query = applyPagination(query, option);
    const posts = await query.lean().exec();
    const result = await this.boardUtillService.mapUserTagsToObjects(posts);

    return result;
  }
}
