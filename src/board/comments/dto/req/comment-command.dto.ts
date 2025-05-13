import { IsString, IsNotEmpty, MaxLength, IsMongoId } from 'class-validator';

export class CreateCommentDto {
  @IsMongoId()
  @IsNotEmpty()
  postId!: string;

  @IsString()
  @IsNotEmpty()
  @MaxLength(300)
  content!: string;
}

export class CreateReplyCommentDto extends CreateCommentDto {
  @IsMongoId()
  @IsNotEmpty()
  pId!: string;
}

export class UpdateCommentDto extends CreateCommentDto {
  @IsMongoId()
  @IsNotEmpty()
  commentId!: string;
}
