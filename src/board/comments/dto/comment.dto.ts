import { PartialType } from '@nestjs/mapped-types';
import { IsString, IsNotEmpty, MaxLength } from 'class-validator';

export class CreateCommentDto {
  @IsNotEmpty()
  postId!: string;

  @IsString()
  @IsNotEmpty()
  @MaxLength(300)
  content!: string;
}

export class CreateReplyCommentDto extends CreateCommentDto {
  @IsNotEmpty()
  pId!: string;
}

export class UpdateCommentDto {
  @IsNotEmpty()
  commentId!: string;

  @IsString()
  @IsNotEmpty()
  @MaxLength(300)
  content!: string;
}