import { QueryBaseDto } from 'src/common/dto/query-base.dto';
import { IsNotEmpty } from 'class-validator';

export class ReplyCommentQueryDto extends QueryBaseDto {
  @IsNotEmpty()
  commentId: string;
}
export class MyCommentQueryDto extends QueryBaseDto {}
