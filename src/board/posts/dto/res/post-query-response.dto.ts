import { Exclude, Expose } from 'class-transformer';
import { CommentResponse } from 'src/board/types/board.types';

export type UserTag = {
  nickname: string;
};

@Exclude()
export class SinglePostResponseDto {
  @Expose()
  UserTag: UserTag;

  @Expose()
  content: string;

  @Expose()
  price: number;

  @Expose()
  comments: CommentResponse;
}

@Exclude()
export class ManyPostsResponseDto {
  @Expose()
  type: 'free' | 'cs';

  @Expose()
  tag: string[]

  @Expose()
  UserTag: UserTag;

  @Expose()
  title: string;

  createdAt: Date
}
