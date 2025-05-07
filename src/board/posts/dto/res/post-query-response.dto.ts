import { Exclude, Expose } from 'class-transformer';

export type UserTag = {
  nickname: string;
  rank: string;
};

@Exclude()
export class SinglePostResponseDto {
  @Expose()
  userTag: UserTag;

  @Expose()
  tag: string;

  @Expose()
  title: string;

  @Expose()
  content: string;

  @Expose()
  images: string[];

  @Expose()
  createdAt: Date;

  @Expose()
  updatedAt: Date;

  @Expose()
  viewcount: number;

  @Expose()
  likecount: number;
}

export class ManyPostsResponseDto {
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
