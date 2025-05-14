import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsNotEmpty, MaxLength, IsMongoId, IsOptional } from 'class-validator';

export class CreateCommentDto {
  @IsMongoId()
  @IsNotEmpty()
  postId!: string;

  @IsString()
  @IsNotEmpty()
  @MaxLength(300)
  content!: string;

  @IsMongoId()
  @IsOptional()
  pId!: string;
}

export class UpdateCommentDto extends CreateCommentDto {}
