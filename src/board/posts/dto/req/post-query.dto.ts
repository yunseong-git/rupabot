import { IsOptional, IsIn, IsNotEmpty } from 'class-validator';
import { QueryBaseDto } from 'src/common/dto/query-base.dto';
<<<<<<< HEAD
import { PostType, SortType } from '../../types/post.type';
=======
>>>>>>> 041b884472753cb26fc32316ab377b8d8d5cb5e2

class Based extends QueryBaseDto {
  @IsOptional()
  @IsIn(['cs', 'free'])
<<<<<<< HEAD
  type?: PostType;
=======
  type?: string;
>>>>>>> 041b884472753cb26fc32316ab377b8d8d5cb5e2
}
export class LikedPostQueryDto extends Based {}
export class AllPostQueryDto extends Based {
  @IsOptional()
  @IsIn(['latest', 'like'])
<<<<<<< HEAD
  sort?: SortType;
=======
  sort?: string;
>>>>>>> 041b884472753cb26fc32316ab377b8d8d5cb5e2
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
<<<<<<< HEAD
  @IsOptional()
  @IsIn(['latest', 'like'])
  sort?: SortType;
=======
  @IsNotEmpty()
  postId: string;

  @IsOptional()
  @IsIn(['latest', 'like'])
  sort?: string;
>>>>>>> 041b884472753cb26fc32316ab377b8d8d5cb5e2
}
