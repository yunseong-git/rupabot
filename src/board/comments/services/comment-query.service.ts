import {
  Injectable,
  UnauthorizedException,
  NotFoundException,
  BadRequestException,
  ForbiddenException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';

import { Comment, CommentDocument } from '../schemas/comment.schema';

import { BoardUtilService } from 'src/board/posts/board-utill.service';
import { UserTag } from 'src/board/posts/dto/res/post-query-response.dto';
import { applyPagination, QueryOptions } from 'src/common/utils/pagination.utill';
import { PostWithCommentsQueryDto } from 'src/board/posts/dto/req/post-query.dto';
import { ReplyCommentQueryDto, MyCommentQueryDto } from '../dto/req/comment-query.dto';
import { PlainComment, toPlainComment } from 'src/board/utill/lean-transform';

@Injectable()
export class CommentQueryService {
  constructor(
    private readonly boardUtillService: BoardUtilService,
    @InjectModel(Comment.name) private readonly commentModel: Model<CommentDocument>,
  ) {}

  /**단일 댓글조회(수정 전 확인용)*/
  async findCommentById(id: string): Promise<PlainComment> {
    const selection = 'content likecount createdAt isUpdated postId pId';
    const comment = await this.commentModel.findById(id).select(selection).lean().exec();

    if (!comment || comment.isDeleted) {
      throw new NotFoundException('존재하지 않거나 삭제된 댓글입니다.');
    }

    return toPlainComment(comment);
  }

  /**해당 게시물의 전체 댓글 반환(미구분)*/
  async findAllCommentsByPost(query: PostWithCommentsQueryDto): Promise<(PlainComment & { userTag: UserTag })[]> {
    const { postId, sort, limit = 10, skip = 0 } = query;

    const filter = { postId: postId };
    const selection = '+isDeleted pId content likecount createdAt isUpdated authorId';
    const options: QueryOptions = { sort, limit, skip };

    return await this.findManyComments(filter, options, selection);
  }

  /**해당 게시물의 부모 댓글 반환(답글 미포함)*/
  async findParentsCommentsByPost(query: PostWithCommentsQueryDto): Promise<(PlainComment & { userTag: UserTag })[]> {
    const { postId, sort, limit = 10, skip = 0 } = query;

    const filter = { postId: postId, pId: null };
    const selection = '+isDeleted content likecount createdAt isUpdated authorId';
    const options: QueryOptions = { sort, limit, skip };

    return await this.findManyComments(filter, options, selection);
  }

  /**부모 댓글의 답글들 반환*/
  async findReplyCommentsByParent(query: ReplyCommentQueryDto): Promise<(PlainComment & { userTag: UserTag })[]> {
    const { commentId, limit = 10, skip = 0 } = query;

    await this.isParents(commentId); //부모댓글요청인지 확인

    const filter = { pId: commentId };
    const selection = '+isDeleted content likecount createdAt isUpdated authorId';
    const options: QueryOptions = { limit, skip };

    return await this.findManyComments(filter, options, selection);
  }

  /**<내부로직용>다수 댓글 조회(유저태그 포함)*/
  private async findManyComments(
    filter: any,
    option: QueryOptions,
    selection: any,
  ): Promise<(PlainComment & { userTag: UserTag })[]> {
    let query = this.commentModel.find(filter).select(selection);

    query = applyPagination(query, option);
    const comments = (await query.lean().exec()).map(toPlainComment);

    const result = await this.boardUtillService.mapUserTagsToObjects(comments);

    return result;
  }

  /**해당 유저가 작성한 모든 댓글 확인*/
  async findMyComments(query: MyCommentQueryDto, userId: string): Promise<PlainComment[]> {
    const { limit = 10, skip = 0 } = query;
    const filter = { authorId: userId, isDeleted: false };
    const selection = 'pId postId content likecount createdAt isUpdated';
    const options: QueryOptions = { limit, skip };

    let comments = this.commentModel.find(filter).select(selection);
    comments = applyPagination(query, options);

    const result = (await comments.lean().exec()).map(toPlainComment);

    return result;
  }

  /**<내부로직용>게시물의 댓글IDs 배열 조회*/
  async findCommentIdsByPost(postId: string): Promise<string[]> {
    const comments = await this.commentModel.find({ postId }).select('_id').lean().exec();
    const commentIds = comments.map((c) => c._id.toString());
    return commentIds;
  }

  async isAuthor(userId: string, commentId: string): Promise<boolean> {
    const comment = await this.commentModel.findById(commentId).select(userId).lean().exec();
    if (!comment) {
      throw new NotFoundException('존재하지 않는 댓글입니다.');
    }
    if (!comment.authorId.equals(userId)) {
      throw new ForbiddenException('작성자만 접근할 수 있습니다.');
    } else return true;
  }

  /**<내부로직용>부모 댓글 여부 확인*/
  async isParents(id: string): Promise<boolean> {
    const comment = await this.commentModel.findById(id).select('pId').lean().exec();

    if (!comment) {
      throw new NotFoundException('존재하지 않거나 삭제된 댓글입니다.');
    }
    if (comment.pId) {
      throw new BadRequestException('잘못된 요청입니다.');
    } else return true;
  }
}
