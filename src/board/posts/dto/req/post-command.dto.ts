import { PartialType } from '@nestjs/mapped-types';
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
  title!: string;

  @IsString()
  @IsNotEmpty()
  @MaxLength(300)
  @ApiProperty({ example: '질문 받는다.' })
  content!: string;

  @IsOptional()
  @ApiProperty({ example: ['img1.jpg', 'img2.jpg'] })
  image: string[];

  @IsOptional()
  @ApiProperty({ example: '자랑' })
  tag: string;
}

export class UpdatePostDto extends PartialType(CreatePostDto) {}
