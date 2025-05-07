import { PartialType } from '@nestjs/mapped-types';
import { IsString, IsNotEmpty, MaxLength } from 'class-validator';

export class CreatePostDto {
  @IsString()
  @IsNotEmpty()
  @MaxLength(300)
  title!: string;

  @IsString()
  @IsNotEmpty()
  @MaxLength(300)
  content!: string;

  tag: string;


}

//create와 동일, @IsOptional()만 추가
export class UpdatePostDto extends PartialType(CreatePostDto) {
  
}
