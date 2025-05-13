import { Exclude, Expose } from 'class-transformer';
import { CommentQueryResponseDto } from 'src/board/comments/dto/res/comment-query-response.dto';

export type UserTag = {
  nickname: string;
  rank: string;
};

export namespace PostQueryResponseDto {
  @Exclude()
  export class Many {
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
  export class Single extends Many {
    @Expose()
    content: string;

    @Expose()
    images: string[];

    @Expose()
    updatedAt: Date;
  }

  export class WithComments {
    @Expose()
    post: Single;

    @Expose()
    comments: CommentQueryResponseDto.NotPid[];
  }
}