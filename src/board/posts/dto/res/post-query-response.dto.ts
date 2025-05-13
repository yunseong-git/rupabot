import { Exclude, Expose } from 'class-transformer';
import { CommentsNotPidResponseDto } from 'src/board/comments/dto/res/comment-query-response.dto';

/**유저 태그 타입 */
export type UserTag = {
  nickname: string;
  rank: string;
};

/**<res>다수 게시물 응답 */
@Exclude()
export class ManyPostResponseDto {
  @Expose()
  userTag: UserTag;

  @Expose()
  tag: string;

  @Expose()
  title: string;

  @Expose()
  createdAt: Date;

  @Expose()
  viewcount: number;

  @Expose()
  likecount: number;
}

/**<res>단일 게시물 응답(유저태그 미포함) */
@Exclude()
export class SimplePostResponseDto {
  @Expose()
  tag: string;

  @Expose()
  title: string;

  @Expose()
  content: string;

  @Expose()
  images: string[];

  @Expose()
  updatedAt: Date;

  @Expose()
  createdAt: Date;

  @Expose()
  viewcount: number;

  @Expose()
  likecount: number;
}

/**<res>단일 게시물 응답(유저태그 포함) */
export class SinglePostResponseDto extends SimplePostResponseDto {
  @Expose()
  userTag: UserTag;
}

/**<res>단일 게시물 및 댓글목록 응답 */
export class PostWithCommentsResponseDto {
  @Expose()
  post: SinglePostResponseDto;

  @Expose()
  comments: CommentsNotPidResponseDto[];
}
