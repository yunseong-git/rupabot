import { Exclude, Expose } from 'class-transformer';
import { UserTag } from 'src/board/posts/dto/res/post-query-response.dto';

@Exclude()
export class SingleCommentResponse {
  @Expose()
  author: UserTag;

  @Expose()
  pid: string;

  @Expose()
  content: string;

  @Expose()
  likecount: number;

  @Expose()
  isDeleted: boolean;
}

@Exclude()
export class ManyCommentsResponse {}

export class SingleCommentsWithReplyResponse {}
