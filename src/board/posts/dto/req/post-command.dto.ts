import { PartialType } from '@nestjs/mapped-types';
<<<<<<< HEAD
import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsNotEmpty, MaxLength, IsOptional, IsIn } from 'class-validator';
import { PostType } from '../../types/post.type';

export class CreatePostDto {
  @IsNotEmpty()
  @IsIn(['cs', 'free'])
  @ApiProperty({ enum: PostType, example: PostType.FREE })
  type!: PostType;

  @IsString()
  @IsNotEmpty()
  @MaxLength(300)
  @ApiProperty({ example: '오늘 소개팅간다.' })
=======
import { IsString, IsNotEmpty, MaxLength } from 'class-validator';

export class CreatePostDto {
  @IsString()
  @IsNotEmpty()
  @MaxLength(300)
>>>>>>> 041b884472753cb26fc32316ab377b8d8d5cb5e2
  title!: string;

  @IsString()
  @IsNotEmpty()
  @MaxLength(300)
<<<<<<< HEAD
  @ApiProperty({ example: '질문 받는다.' })
  content!: string;

  @IsOptional()
  @ApiProperty({ example: ['img1.jpg', 'img2.jpg'] })
  image: string[];

  @IsOptional()
  @ApiProperty({ example: '자랑' })
=======
  content!: string;

>>>>>>> 041b884472753cb26fc32316ab377b8d8d5cb5e2
  tag: string;
}

export class UpdatePostDto extends PartialType(CreatePostDto) {}
