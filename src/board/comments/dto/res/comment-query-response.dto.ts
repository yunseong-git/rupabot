import { Exclude, Expose } from 'class-transformer';
import { UserTag } from 'src/board/posts/dto/res/post-query-response.dto';

export namespace CommentQueryResponseDto {
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
  export class NotPid extends Base {
    @Expose()
    userTag: UserTag;

    @Expose()
    isDeleted: boolean;
  }

  /**<댓글/답글 미구분 응답 response DTO>
  * pid: 댓글/답글 구분 위함;
   */
  export class WithPid extends NotPid {
    @Expose()
    pId: string | null;
  }

  /**<유저 작성 댓글 response DTO>
 * userTag 미포함;
 * postId&pid: 바로 해당 댓글트리나, 게시물로 이동하기 위함;
*/
  export class My extends Base {
    @Expose()
    postId: string;

    @Expose()
    pId: string | null;
  }

  /**<단일 댓글 응답(수정 전 확인용) response DTO>*/
  export class Single extends My {
  }
}