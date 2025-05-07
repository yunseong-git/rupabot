import { Expose } from 'class-transformer';

export class CommandPostResponseDto {
  @Expose()
  postId: string;

  @Expose()
  authorId: string;
}

export class PostLikeResponseDto {
  @Expose()
  status: 'liked' | 'unliked';
}
