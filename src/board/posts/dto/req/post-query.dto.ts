import { IsOptional, IsIn, IsNotEmpty } from 'class-validator';
import { QueryBaseDto } from 'src/common/dto/query-base.dto';

class Based extends QueryBaseDto {
  @IsOptional()
  @IsIn(['cs', 'free'])
  type?: string;
}
export class LikedPostQueryDto extends Based {}
export class AllPostQueryDto extends Based {
  @IsOptional()
  @IsIn(['latest', 'like'])
  sort?: string;
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
  @IsNotEmpty()
  postId: string;

  @IsOptional()
  @IsIn(['latest', 'like'])
  sort?: string;
}
