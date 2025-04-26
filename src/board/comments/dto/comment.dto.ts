import { PartialType } from '@nestjs/mapped-types';
import { IsString, IsNotEmpty, MaxLength } from 'class-validator';

export class CreateCommentDto {
  @IsString()
  @IsNotEmpty()
  @MaxLength(300)
  content!: string;
}

//create와 동일, @IsOptional()만 추가
export class UpdateCommentDto extends PartialType(CreateCommentDto) {}