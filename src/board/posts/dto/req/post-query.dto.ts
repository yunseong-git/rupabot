import { IsOptional, IsIn, IsNotEmpty } from 'class-validator';
import { QueryBaseDto } from 'src/common/dto/query-base.dto';
import { PostType, SortType } from '../../types/post.type';

class Based extends QueryBaseDto {
  @IsOptional()
  @IsIn(['cs', 'free'])
  type?: PostType;
}
export class LikedPostQueryDto extends Based {}
export class AllPostQueryDto extends Based {
  @IsOptional()
  @IsIn(['latest', 'like'])
  sort?: SortType;
}

export class DeletedPostQueryDto extends AllPostQueryDto {
  @IsOptional()
  word?: string;
}

export class SearchPostDto extends AllPostQueryDto {
  @IsNotEmpty()
  word!: string;
}

export class PostWithCommentsQueryDto extends QueryBaseDto {
  @IsOptional()
  @IsIn(['latest', 'like'])
  sort?: SortType;
}
