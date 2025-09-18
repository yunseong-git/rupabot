<<<<<<< HEAD
import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsNotEmpty, MaxLength, IsMongoId, IsOptional } from 'class-validator';
=======
import { IsString, IsNotEmpty, MaxLength, IsMongoId } from 'class-validator';
>>>>>>> 041b884472753cb26fc32316ab377b8d8d5cb5e2

export class CreateCommentDto {
  @IsMongoId()
  @IsNotEmpty()
  postId!: string;

  @IsString()
  @IsNotEmpty()
  @MaxLength(300)
  content!: string;
<<<<<<< HEAD

  @IsMongoId()
  @IsOptional()
  pId!: string;
}

export class UpdateCommentDto extends CreateCommentDto {}
=======
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
>>>>>>> 041b884472753cb26fc32316ab377b8d8d5cb5e2
