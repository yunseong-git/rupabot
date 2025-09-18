import { IsNotEmpty, IsOptional, IsIn, Length } from 'class-validator';
import { QueryBaseDto } from 'src/common/dto/query-base.dto';

export class FindAllUsersDto extends QueryBaseDto {
  @IsOptional()
  @IsIn(['rupa', 'rank', 'createdAt', 'attendcount', 'bancount'])
  sort?: string;
}

export class SearchUsersQueryDto extends QueryBaseDto {
  @IsNotEmpty()
  @Length(2, 8)
  nickname!: string;
}

