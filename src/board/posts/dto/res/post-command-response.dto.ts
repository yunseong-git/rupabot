import { ApiProperty } from '@nestjs/swagger';

/**<res>게시물 좋아요 */
export class PostLikeResponseDto {
  @ApiProperty({ example: 'liked' })
  status: 'liked' | 'unliked';
}

/**<res>PostId만 반환 */
export class PostIdResponseDto {
  @ApiProperty({ example: '660fa04149ac491601f005b6' })
  postId: string;
}

/**<res>업데이트 성공 여부 boolean 반환 */
export class UpdatePostResponseDto {
  @ApiProperty({ example: 'true' })
  isUpdated: boolean;
}

/**<res>업데이트 성공 여부 boolean 반환 */
export class DeletePostResponseDto {
  @ApiProperty({ example: 'true' })
  isDeleted: boolean;
}
