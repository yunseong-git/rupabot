import { Exclude, Expose } from 'class-transformer';
import { UserTag } from 'src/board/posts/dto/res/post-query-response.dto';

@Exclude()
class Base {
  @Expose()
  content: string;

  @Expose()
  createdAt: Date;

  @Expose()
  likecount: number;

  @Expose()
  isUpdated: boolean;
}

/**<댓글/답글 구분 응답 response DTO>*/
export class CommentsNotPidResponseDto extends Base {
  @Expose()
  userTag: UserTag;

  @Expose()
  isDeleted: boolean;
}

/**<댓글/답글 미구분 응답 response DTO>
 * pid: 댓글/답글 구분 위함;
 */
export class CommentsWithPidResponseDto extends CommentsNotPidResponseDto {
  @Expose()
  pId: string | null;
}

/**<유저 작성 댓글 response DTO>
 * userTag 미포함;
 * postId&pid: 바로 해당 댓글트리나, 게시물로 이동하기 위함;
 */
export class SingleCommentResponseDto extends Base {
  @Expose()
  postId: string;

  @Expose()
  pId: string | null;
}
