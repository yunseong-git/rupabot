import { Max, Min, IsNotEmpty, IsOptional, IsIn } from 'class-validator';
import { Type } from 'class-transformer';

export class UserQueryDto {
  @IsOptional()
  @IsIn(['rupa', 'rank', 'createdAt', 'attendcount'])
  sort?: string;

  @IsOptional()
  @Type(() => Number)
  @Max(100)
  limit?: number;

  @IsOptional()
  @Type(() => Number)
  skip?: number;
}

export class SearchUserQueryDto extends UserQueryDto {
  @IsNotEmpty()
  @Min(2)
  nickname!: string;
}

export class UserRankQueryDto extends UserQueryDto {
  @IsNotEmpty()
  rank!: string;
}
