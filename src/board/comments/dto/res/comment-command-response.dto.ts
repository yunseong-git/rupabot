import { ApiProperty } from '@nestjs/swagger';

/**<res>게시물 좋아요 */
export class CommentLikeResponseDto {
  @ApiProperty({ example: 'liked' })
  status: 'liked' | 'unliked';
}

/**<res>CommentId만 반환 */
export class CommentIdResponseDto {
  @ApiProperty({ example: '660fa04149ac491601f005b6' })
  CommentId: string;
}

/**<res>업데이트 성공 여부 boolean 반환 */
export class UpdateCommentResponseDto {
  @ApiProperty({ example: 'true' })
  isUpdated: boolean;
}

/**<res>업데이트 성공 여부 boolean 반환 */
export class DeleteCommentResponseDto {
  @ApiProperty({ example: 'true' })
  isDeleted: boolean;
}
