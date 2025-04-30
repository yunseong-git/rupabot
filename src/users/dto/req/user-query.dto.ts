import { Max, Min, IsNotEmpty, IsOptional, IsIn } from 'class-validator';
import { Type } from 'class-transformer';

export class UsersQueryDto {
  @IsOptional()
  @IsIn(['rupa', 'rank', 'createdAt', 'attendcount', 'bancount'])
  sort?: string;

  @IsOptional()
  @Type(() => Number)
  @Max(100)
  limit?: number;

  @IsOptional()
  @Type(() => Number)
  skip?: number;
}

export class SearchUsersQueryDto extends UsersQueryDto {
  @IsNotEmpty()
  @Min(2)
  nickname!: string;
}

